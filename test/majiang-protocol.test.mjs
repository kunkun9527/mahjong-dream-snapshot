import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import protobuf from 'protobufjs/light.js';
import { extractMaJiangProtocol, readLiteralArray } from '../tools/extract_majiang_protocol.mjs';
import { MAJIANG_DESCRIPTOR, MAJIANG_SOURCE } from '../mockjs/majiang_desc.mjs';
import { encodeMaJiang, decodeMaJiang, encodeMaJiangEnvelope, decodeMaJiangEnvelope,
  majiangMessageName, MaJiangMsg, MaJiangAction, MaJiangResult } from '../mockjs/majiang_pb.mjs';
await import('../mock/proto.js');
const P = globalThis.__mj.proto;

// 专门复现原WASM在第12槽使用base - -64，而不是store offset=64的写法。
function literalProgram(order) {
  const code = [0x21, 0]; // local.set 0：保存array_new返回的数组基址。
  for (const index of order) {
    code.push(0x20, 0);
    if (index === 12) code.push(0x41, 0x40, 0x6b);
    code.push(0x41, 32 + index, 0x28, 2, 0, 0x36, 2, index === 12 ? 0 : 16 + index * 4);
  }
  code.push(0x20, 0, 0x41, 0, 0x10, 0x80, 0x07); // Concat(array, null)
  return Uint8Array.from(code);
}

test('描述符片段按真实写入地址排序，不能把加64的槽位排到文件头', () => {
  const expected = Array.from({ length: 13 }, (_, i) => (32 + i) * 10);
  for (const order of [Array.from({ length: 13 }, (_, i) => i), [12, ...Array.from({ length: 12 }, (_, i) => i)]]) {
    assert.deepEqual(readLiteralArray(literalProgram(order), 13, (address) => address * 10), expected);
  }
});

test('描述符提取遇到缺失、重复槽位或未知指令时明确失败', () => {
  assert.throws(() => readLiteralArray(literalProgram([0, 1]), 13, (x) => x), /片段缺失/);
  assert.throws(() => readLiteralArray(literalProgram([0, 0]), 13, (x) => x), /重复写入/);
  assert.throws(() => readLiteralArray(Uint8Array.of(0x01), 13, (x) => x), /未核验指令/);
});

test('从原三份Unity文件重提取描述符逐项一致且全部消息引用可解析', () => {
  const rootPath = fileURLToPath(new URL('../', import.meta.url));
  const { schema, source } = extractMaJiangProtocol(rootPath);
  assert.deepEqual(schema, MAJIANG_DESCRIPTOR);
  assert.deepEqual(source, MAJIANG_SOURCE);
  assert.equal(source.functionIndex, 105782);
  assert.equal(source.stringCount, 251);
  assert.equal(source.descriptorSha256, '69aa89417974a5992c39e5314e11d5b28a7d634e2dff226e5e334e37d5ea9d4a');
  const root = protobuf.Root.fromJSON(schema).resolveAll();
  const entries = Object.values(root.lookup('majiang').nested);
  assert.equal(entries.filter((entry) => entry instanceof protobuf.Type).length, 67);
  assert.equal(entries.filter((entry) => entry instanceof protobuf.Enum).length, 12);
  assert.equal(root.lookupType('majiang.NtfPrepare').fields.userInfos.resolvedType.fullName, '.majiang.PrepareUserInfo');
  assert.ok(root.lookupType('majiang.GameStartUserInfo').fields.handCards);
  assert.doesNotMatch(JSON.stringify(schema), /PrepareUsercore/);
});

test('四川换牌、定缺与自动操作事件使用地方麻将枚举而非日麻枚举', () => {
  assert.equal(MaJiangMsg.EReqChangeCard, 7);
  assert.equal(MaJiangMsg.EReqDingQue, 9);
  assert.equal(MaJiangMsg.EReqSetInternalState, 17);
  assert.equal(MaJiangMsg.ENtfChangeCardEnd, 1010);
  assert.equal(MaJiangMsg.ENtfDingQueEnd, 1012);
  assert.equal(MaJiangAction.Hu, 8);
  assert.equal(MaJiangResult.Fail_InvalidChangeCards, 301);
  assert.equal(MaJiangResult.Fail_InvalidDingQue, 401);
  assert.equal(majiangMessageName(1003), 'NtfGameStart');
  for (const id of [0, -1, 50001, 60000, 999, '7']) assert.throws(() => majiangMessageName(id), RangeError);
});

test('换三张packed实体牌编码与独立构造的字节一致', () => {
  const bytes = encodeMaJiang('ReqChangeCard', { cards: [111, 121, 131] });
  assert.equal(Buffer.from(bytes).toString('hex'), '0a046f798301');
  assert.deepEqual(decodeMaJiang('ReqChangeCard', bytes), { cards: [111, 121, 131] });
  // protobuf同时接受原客户端可能使用的unpacked repeated编码。
  assert.deepEqual(decodeMaJiang('ReqChangeCard', P.W().v(1, 111).v(1, 121).v(1, 131).bytes()).cards, [111, 121, 131]);
});

test('GameServerLogicData字段3保留gameNumber且100是内层消息', () => {
  const bytes = encodeMaJiangEnvelope(7, { cards: [111, 121, 131] }, { gameNumber: 12 });
  assert.equal(Buffer.from(bytes).toString('hex'), '0807180ca206060a046f798301');
  const fields = P.dict(bytes);
  assert.equal(fields[1], 7);
  assert.equal(fields[3], 12);
  assert.equal(Buffer.from(fields[100]).toString('hex'), '0a046f798301');
  assert.deepEqual(decodeMaJiangEnvelope(bytes), {
    cmd: 7, name: 'ReqChangeCard', gameNumber: '12', payload: { cards: [111, 121, 131] }, extraLogicData: [],
  });
});

test('封包保留未核验extraLogicData原始字节，不伪装成已处理', () => {
  const extra = Uint8Array.of(8, 1);
  const packet = P.W().v(1, 9).s(2, extra).s(100, P.W().v(1, 2).bytes()).bytes();
  const decoded = decodeMaJiangEnvelope(packet);
  assert.equal(decoded.payload.dingQue, 2);
  assert.equal(decoded.gameNumber, '0');
  assert.equal(decoded.extraLogicData.length, 1);
  assert.deepEqual(Array.from(decoded.extraLogicData[0]), Array.from(extra));
});

test('原大小写字段与嵌套map从描述符保留，不生成不存在的MapEntry引用', () => {
  const state = { InternalState: { 1: 1, 2: 0, 3: 1 } };
  assert.deepEqual(decodeMaJiang('ReqSetInternalState', encodeMaJiang('ReqSetInternalState', state)), state);
  const start = decodeMaJiang('NtfGameStart', encodeMaJiang('NtfGameStart', {
    userInfos: [{ seat: 0, score: 999999, handCards: [111, 121, 131], changeCardSuggest: [111, 121, 131] }],
    specialCardNumMap: { 450: 6 }, changeCardRule: 1, hasDingQue: true, topBei: 128,
  }));
  assert.equal(start.userInfos[0].score, '999999');
  assert.deepEqual(start.specialCardNumMap, { 450: 6 });
  assert.equal(start.hasDingQue, true);
});

test('64位有符号结算和无符号用户ID解码不丢精度', () => {
  const max = protobuf.util.Long.fromString('9223372036854775807');
  const uid = protobuf.util.Long.fromString('18446744073709551615', true);
  const log = decodeMaJiang('MoneyLogUserInfo', encodeMaJiang('MoneyLogUserInfo', { seat: 0, money: -300, finalMoney: max }));
  assert.equal(log.money, '-300');
  assert.equal(log.finalMoney, '9223372036854775807');
  const user = decodeMaJiang('ToPrepareUserInfo', encodeMaJiang('ToPrepareUserInfo', { seat: 0, userID: uid }));
  assert.equal(user.userID, '18446744073709551615');
});

test('编码拒绝字段拼写错误、非法类型及会被静默截断的整数', () => {
  assert.throws(() => encodeMaJiang('ReqSetInternalState', { internalState: {} }), /未知字段/);
  assert.throws(() => encodeMaJiang('ReqChangeCard', { cards: ['111'] }), TypeError);
  assert.throws(() => encodeMaJiang('ReqDingQue', { dingQue: 4294967297 }), RangeError);
  assert.throws(() => encodeMaJiang('MoneyLogUserInfo', { money: 2 ** 53 }), RangeError);
  assert.throws(() => encodeMaJiang('NtfGameStart', { userInfos: [{ nickname: 'mock' }] }), /未知字段/);
  assert.throws(() => encodeMaJiang('constructor', {}), /未知地方麻将消息/);
});

test('损坏内层消息、非字节输入和GM事件不能被当作合法请求', () => {
  assert.throws(() => decodeMaJiang('ReqChangeCard', Uint8Array.of(0x0a, 0xff)));
  assert.throws(() => decodeMaJiang('ReqPrepare', []), TypeError);
  assert.throws(() => decodeMaJiangEnvelope(P.W().v(1, 50001).bytes()), RangeError);
  assert.throws(() => encodeMaJiangEnvelope(50001, {}), RangeError);
});
