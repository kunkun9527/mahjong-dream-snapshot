import protobuf from 'protobufjs/light.js';
import { MAJIANG_DESCRIPTOR } from './majiang_desc.mjs';

const root = protobuf.Root.fromJSON(MAJIANG_DESCRIPTOR).resolveAll();
const namespace = root.lookup('majiang');
const types = new Map(Object.entries(namespace.nested).filter(([, value]) => value instanceof protobuf.Type));
export const MaJiangMsg = Object.freeze({ ...root.lookupEnum('majiang.MaJiangMsg').values });
export const MaJiangAction = Object.freeze({ ...root.lookupEnum('majiang.PlayAction').values });
export const MaJiangResult = Object.freeze({ ...root.lookupEnum('majiang.Result').values });
const messageNames = new Map(Object.entries(MaJiangMsg)
  .filter(([name, id]) => id > 0 && id < 50000 && /^E(?:Req|Rsp|Ntf)/.test(name))
  .map(([name, id]) => [id, name.slice(1)]));

// 外层GameServerLogicData不属于majiang.proto。
// 依据原InternalWriteTo(115514)及FieldNumber常量：cmd=1、extraLogicData=2、
// gameNumber=3、serialized=100。字段3的原名是GameNumber，不能直接套用日麻time语义。
// extraLogicData暂保留不透明bytes；未核验其子结构，不伪造解析结果。
const envelope = new protobuf.Type('GameServerLogicData')
  .add(new protobuf.Field('cmd', 1, 'int32'))
  .add(new protobuf.Field('extraLogicData', 2, 'bytes', 'repeated'))
  .add(new protobuf.Field('gameNumber', 3, 'int64'))
  .add(new protobuf.Field('serialized', 100, 'bytes'));
new protobuf.Root().add(envelope).resolveAll();

function typeOf(name) {
  if (!types.has(name)) throw new Error(`未知地方麻将消息：${name}`);
  return types.get(name);
}

function verifyValues(type, value) {
  for (const key of Object.keys(value)) {
    if (!Object.hasOwn(type.fields, key)) throw new TypeError(`protobuf ${type.name}: 未知字段 ${key}`);
    const field = type.fields[key];
    const values = field.repeated ? value[key] : field.map ? Object.values(value[key] || {}) : [value[key]];
    for (const item of values) {
      if (item == null) continue;
      if (field.resolvedType instanceof protobuf.Type) {
        verifyValues(field.resolvedType, item);
      } else if (typeof item === 'number' && /^(?:u?int|sint|s?fixed)(?:32|64)$/.test(field.type)) {
        const signed = !/^(?:uint|fixed)/.test(field.type);
        const valid = Number.isSafeInteger(item) && (field.type.endsWith('64')
          ? signed || item >= 0
          : item >= (signed ? -2147483648 : 0) && item <= (signed ? 2147483647 : 4294967295));
        if (!valid) throw new RangeError(`protobuf ${type.name}.${key}: 整数超出安全范围`);
      }
    }
  }
}

function encode(type, value) {
  const error = type.verify(value);
  if (error) throw new TypeError(`protobuf ${type.name}: ${error}`);
  verifyValues(type, value);
  return type.encode(type.fromObject(value)).finish();
}

function decode(type, bytes) {
  if (!(bytes instanceof Uint8Array)) throw new TypeError('protobuf输入必须是字节数组');
  // int64保留十进制字符串，避免大额余额、局编号或用户ID被浮点数静默截断。
  return type.toObject(type.decode(bytes), { defaults: true, arrays: true, objects: true, enums: Number, longs: String });
}

export function encodeMaJiang(name, value) {
  return encode(typeOf(name), value);
}

export function decodeMaJiang(name, bytes) {
  return decode(typeOf(name), bytes);
}

export function majiangMessageName(cmd) {
  if (!Number.isInteger(cmd) || !messageNames.has(cmd)) throw new RangeError(`未支持的地方麻将事件：${cmd}`);
  return messageNames.get(cmd);
}

export function encodeMaJiangEnvelope(cmd, payload, { gameNumber = 0 } = {}) {
  const name = majiangMessageName(cmd);
  return encode(envelope, { cmd, gameNumber, serialized: encodeMaJiang(name, payload) });
}

export function decodeMaJiangEnvelope(bytes) {
  const { cmd, gameNumber, serialized, extraLogicData } = decode(envelope, bytes);
  const name = majiangMessageName(cmd);
  return { cmd, name, gameNumber, payload: decodeMaJiang(name, serialized), extraLogicData };
}
