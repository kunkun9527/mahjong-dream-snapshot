// 从本快照原 MajiangReflection 静态初始化代码还原 protobuf 描述符。
// 仅处理经过核验的字符串数组初始化指令；遇到新指令立即失败，不猜字段。
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliDecompressSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import protobuf from 'protobufjs';
import descriptor from 'protobufjs/ext/descriptor/index.js';

class Reader {
  constructor(bytes, position = 0) { this.bytes = bytes; this.position = position; }
  byte() {
    if (this.position >= this.bytes.length) throw new Error('WASM数据意外结束');
    return this.bytes[this.position++];
  }
  leb(signed = false) {
    let value = 0;
    let shift = 0;
    let byte;
    do {
      byte = this.byte();
      value += (byte & 127) * 2 ** shift;
      shift += 7;
      if (shift > 35) throw new Error('超出32位WASM立即数');
    } while (byte & 128);
    if (signed && (byte & 64)) value -= 2 ** shift;
    return value;
  }
  take(length) {
    assert.ok(Number.isInteger(length) && length >= 0 && this.position + length <= this.bytes.length);
    const result = this.bytes.subarray(this.position, this.position + length);
    this.position += length;
    return result;
  }
}

function readModule(bytes) {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '0061736d01000000');
  const reader = new Reader(bytes, 8);
  let imports = 0;
  const bodies = [];
  const segments = [];
  while (reader.position < bytes.length) {
    const id = reader.byte();
    const section = new Reader(reader.take(reader.leb()));
    if (id === 2) {
      const count = section.leb();
      for (let i = 0; i < count; i += 1) {
        section.take(section.leb());
        section.take(section.leb());
        assert.equal(section.byte(), 0, '当前快照预期只有函数导入');
        section.leb();
        imports += 1;
      }
    } else if (id === 10) {
      const count = section.leb();
      for (let i = 0; i < count; i += 1) bodies.push(section.take(section.leb()));
    } else if (id === 11) {
      const count = section.leb();
      for (let i = 0; i < count; i += 1) {
        assert.equal(section.leb(), 0, '只接受已核验的活动数据段');
        assert.equal(section.byte(), 0x41);
        const address = section.leb(true);
        assert.equal(section.byte(), 0x0b);
        segments.push({ address, bytes: section.take(section.leb()) });
      }
    }
  }
  return { imports, bodies, readU32(address) {
    const segment = segments.find((entry) => address >= entry.address && address + 4 <= entry.address + entry.bytes.length);
    assert.ok(segment, `未找到WASM数据地址 ${address}`);
    return segment.bytes.readUInt32LE(address - segment.address);
  } };
}

// code从array_new_specific返回后开始；readU32返回原数据段中的字符串metadata token。
// 必须计算地址表达式，不能按i32.store自身的offset排序（base - -64也是第12槽）。
export function readLiteralArray(code, count, readU32, concatFunction = 896) {
  const base = 0x10000000;
  const stack = [base];
  const locals = new Map();
  const slots = new Map();
  const reader = new Reader(code);
  while (reader.position < code.length) {
    const op = reader.byte();
    if (op === 0x20) {
      const local = reader.leb();
      assert.ok(locals.has(local), '引用了未定义local');
      stack.push(locals.get(local));
    } else if (op === 0x21 || op === 0x22) {
      const local = reader.leb();
      assert.ok(stack.length);
      locals.set(local, op === 0x22 ? stack.at(-1) : stack.pop());
    } else if (op === 0x41) {
      stack.push(reader.leb(true));
    } else if (op === 0x6a || op === 0x6b) {
      assert.ok(stack.length >= 2);
      const right = stack.pop();
      const left = stack.pop();
      stack.push(op === 0x6a ? left + right : left - right);
    } else if (op === 0x28 || op === 0x36) {
      assert.equal(reader.leb(), 2, '预期32位对齐读写');
      const offset = reader.leb();
      if (op === 0x28) {
        assert.ok(stack.length);
        stack.push(readU32(stack.pop() + offset));
      } else {
        assert.ok(stack.length >= 2);
        const value = stack.pop();
        const index = (stack.pop() + offset - base - 16) / 4;
        assert.ok(Number.isInteger(index) && index >= 0 && index < count, '字符串槽位越界');
        assert.ok(!slots.has(index), '重复写入字符串槽位');
        slots.set(index, value);
      }
    } else if (op === 0x10) {
      assert.equal(reader.leb(), concatFunction, '数组初始化出现未核验的调用');
      assert.deepEqual(stack, [base, 0]);
      assert.equal(slots.size, count, '描述符字符串片段缺失');
      return Array.from({ length: count }, (_, i) => slots.get(i));
    } else {
      throw new Error(`数组初始化出现未核验指令 0x${op.toString(16)}`);
    }
  }
  throw new Error('缺少字符串数组Concat调用');
}

export function extractMaJiangProtocol(root) {
  const sources = ['Build/mj-h5.wasm.unityweb', 'Build/mj-h5.data.unityweb', 'Build/mj-h5.symbols.json.unityweb'];
  const packed = sources.map((source) => fs.readFileSync(path.join(root, source)));
  const [wasm, dataFile, symbolsFile] = packed.map((bytes) => brotliDecompressSync(bytes));
  const symbols = JSON.parse(symbolsFile.toString('utf8'));
  const entries = Object.entries(symbols).filter(([, name]) => /^MajiangReflection__cctor_/.test(name));
  assert.equal(entries.length, 1);
  const functionIndex = Number(entries[0][0]);
  const module = readModule(wasm);
  const body = module.bodies[functionIndex - module.imports];
  // 本快照是 i32.const 251; call 617(array_new_specific)，且只出现一次。
  const startMarker = Buffer.from([0x41, 0xfb, 0x01, 0x10, 0xe9, 0x04]);
  const start = body.indexOf(startMarker);
  assert.ok(start >= 0);
  assert.equal(body.indexOf(startMarker, start + 1), -1);
  const tokens = readLiteralArray(body.subarray(start + startMarker.length), 251, module.readU32);
  const metadataOffset = dataFile.indexOf(Buffer.from('af1bb1fa1f000000', 'hex'));
  assert.ok(metadataOffset >= 0);
  const metadata = dataFile.subarray(metadataOffset);
  const literalTable = metadata.readUInt32LE(8);
  const literalCount = metadata.readUInt32LE(12) / 8;
  const literalData = metadata.readUInt32LE(16);
  const parts = tokens.map((token) => {
    assert.equal(token >>> 29, 5, 'metadata token不是字符串');
    const index = (token >>> 1) & 0x0fffffff;
    assert.ok(index < literalCount);
    const length = metadata.readUInt32LE(literalTable + index * 8);
    const offset = metadata.readUInt32LE(literalTable + index * 8 + 4);
    assert.ok(literalData + offset + length <= metadata.length);
    const text = metadata.subarray(literalData + offset, literalData + offset + length).toString('ascii');
    assert.match(text, /^[A-Za-z0-9+/=]+$/);
    return text;
  });
  const base64 = parts.join('');
  const bytes = Buffer.from(base64, 'base64');
  assert.equal(bytes.toString('base64'), base64, 'Base64不是完整规范编码');
  const file = descriptor.FileDescriptorProto.decode(bytes);
  assert.equal(file.name, 'game_logic/majiang/majiang.proto');
  assert.equal(file.package, 'majiang');
  assert.equal(file.messageType.length, 67);
  assert.equal(file.enumType.length, 12);
  const reflected = protobuf.Root.fromDescriptor({ file: [file] }).resolveAll().toJSON();
  // protobufjs枚举对象带反向查询原型；输出契约是纯JSON，不携带库对象原型。
  const schema = JSON.parse(JSON.stringify(reflected));
  return {
    schema,
    source: {
      files: sources.map((source, i) => ({ path: source, sha256: createHash('sha256').update(packed[i]).digest('hex') })),
      functionIndex,
      stringCount: tokens.length,
      descriptorSha256: createHash('sha256').update(bytes).digest('hex'),
      protoName: file.name,
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { schema, source } = extractMaJiangProtocol(root);
  const body = '// 由 tools/extract_majiang_protocol.mjs 从原Unity描述符生成；勿手改。\n'
    + `export const MAJIANG_SOURCE = ${JSON.stringify(source, null, 2)};\n`
    + `export const MAJIANG_DESCRIPTOR = ${JSON.stringify(schema, null, 2)};\n`;
  fs.writeFileSync(path.join(root, 'mockjs/majiang_desc.mjs'), body, 'utf8');
  console.log('Generated mockjs/majiang_desc.mjs (67 messages, 12 enums, all references resolved)');
}
