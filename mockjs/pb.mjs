import protobuf from 'protobufjs/light.js';
import riichiDesc from './riichi_desc.mjs';

const root = protobuf.Root.fromJSON(riichiDesc);
function encodeMsg(typeName, obj) {
  const T = root.lookupType("riichi." + typeName);
  const err = T.verify(obj);
  if (err) throw new Error("protobuf verify " + typeName + ": " + err);
  const msg = T.fromObject(obj);
  const buf = T.encode(msg).finish();
  return buf instanceof Uint8Array ? buf : new Uint8Array(buf);
}
function decodeMsg(typeName, buf) {
  const T = root.lookupType("riichi." + typeName);
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const m = T.decode(u8);
  return T.toObject(m, { defaults: true, arrays: true, objects: true, enums: Number });
}

export { encodeMsg, decodeMsg };
