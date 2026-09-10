import { YiType, ManType } from './proto_enum.mjs';

var DIRECT = {
  "\u7ACB\u76F4": YiType.LiZhi,
  "\u30C0\u30D6\u30EB\u7ACB\u76F4": YiType.ShuangLiZi,
  // 2101 双立直
  "\u4E00\u767A": YiType.YiFa,
  "\u9580\u524D\u6E05\u81EA\u6478\u548C": YiType.MengQianQingZiMoHu,
  "\u5E73\u548C": YiType.PingHu,
  "\u4E00\u76C3\u53E3": YiType.YiBeiKou,
  "\u4E8C\u76C3\u53E3": YiType.ErBeiKou,
  // 3101
  "\u65AD\u4E48\u4E5D": YiType.DuanYaoJiu,
  "\u5F79\u724C\u767D": YiType.YiPaiSanYuanBai,
  "\u5F79\u724C\u767A": YiType.YiPaiSanYuanFa,
  "\u5F79\u724C\u4E2D": YiType.YiPaiSanYuanZhong,
  "\u4E00\u6C17\u901A\u8CAB": YiType.YiQiTongGuan,
  "\u4E09\u8272\u540C\u9806": YiType.SanSeTongShun,
  "\u4E09\u8272\u540C\u523B": YiType.SanSeTongKe,
  "\u4E09\u6697\u523B": YiType.SanAnKe,
  "\u4E09\u69D3\u5B50": YiType.SanGangZi,
  "\u5BFE\u3005\u548C": YiType.DuiDuiHu,
  "\u6DF7\u8001\u982D": YiType.HunLaoTou,
  "\u5C0F\u4E09\u5143": YiType.XiaoSanYuan,
  "\u7D14\u5168\u5E2F\u4E48\u4E5D": YiType.ChunQuanDaiYaoJiu,
  "\u6DF7\u5168\u5E2F\u4E48\u4E5D": YiType.HunQuanDaiYaoJiu,
  "\u6DF7\u4E00\u8272": YiType.HunYiSe,
  "\u6E05\u4E00\u8272": YiType.QingYiSe,
  "\u4E03\u5BFE\u5B50": YiType.QiDuiZi,
  "\u5DBA\u4E0A\u958B\u82B1": YiType.LingShangKaiHua,
  "\u6436\u69D3": YiType.QiangGang,
  "\u6D77\u5E95\u6478\u6708": YiType.HaiDiLaoYue,
  "\u6CB3\u5E95\u6488\u9B5A": YiType.HeDiMoYu,
  "\u56FD\u58EB\u7121\u53CC": YiType.GuoShiWuShuang,
  "\u56FD\u58EB\u7121\u53CC\u5341\u4E09\u9762\u5F85\u3061": YiType.GuoShiWuShuangShiSanMian,
  "\u4E5D\u84EE\u5B9D\u71C8": YiType.JiuLianBaoDeng,
  "\u7D14\u6B63\u4E5D\u84EE\u5B9D\u71C8": YiType.ChunZhengJiuLianBaoDeng,
  "\u56DB\u6697\u523B": YiType.SiAnKe,
  "\u56DB\u6697\u523B\u5358\u9A0E\u5F85\u3061": YiType.SiAnKeDanQi,
  "\u5927\u56DB\u559C": YiType.DaSiXi,
  "\u5C0F\u56DB\u559C": YiType.XiaoSiXi,
  "\u5927\u4E09\u5143": YiType.DaSanYuan,
  "\u5B57\u4E00\u8272": YiType.ZiYiSe,
  "\u7DD1\u4E00\u8272": YiType.LvYiSe,
  "\u6E05\u8001\u982D": YiType.QingLaoTou,
  "\u56DB\u69D3\u5B50": YiType.SiGangZi,
  "\u5929\u548C": YiType.TianHu,
  "\u5730\u548C": YiType.DiHu,
  "\u30C9\u30E9": YiType.Bao,
  // 宝（表宝牌）
  "\u8D64\u30C9\u30E9": YiType.RedBao
  // 赤宝（赤5 dora）
};
function windYiType(key, roundWind, seatWind) {
  const m = key.match(/^(場風|自風)([東南西北])$/);
  if (!m) return null;
  const kind = m[1];
  const wind = m[2];
  if (kind === "\u5834\u98A8") return YiType.YiPaiChangFeng;
  if (wind === "\u5317") return YiType.YiPaiBeiFeng;
  return YiType.YiPaiZiFeng;
}
function parseFan(val) {
  if (typeof val === "string") {
    if (val.includes("\u5F79\u6E80")) {
      return val.includes("\u30C0\u30D6\u30EB") ? 26 : 13;
    }
    const n = parseInt(val, 10);
    return isNaN(n) ? 0 : n;
  }
  return typeof val === "number" ? val : 0;
}
function mapYaku(yakuObj, { roundWind = 1, seatWind = 1 } = {}) {
  const yiFans = [];
  let isYiMan = false;
  let baoFan = 0, liBaoFan = 0, redBaoFan = 0;
  for (const [key, val] of Object.entries(yakuObj)) {
    let yiType = DIRECT[key];
    if (yiType === void 0) yiType = windYiType(key, roundWind, seatWind);
    if (yiType === void 0 || yiType === null) continue;
    const fan = parseFan(val);
    const ym = typeof val === "string" && val.includes("\u5F79\u6E80");
    if (ym) isYiMan = true;
    yiFans.push({ yiType, fan, isYiMan: ym, isFuLuMinus: false });
    if (key === "\u30C9\u30E9") baoFan += fan;
    else if (key === "\u8D64\u30C9\u30E9") redBaoFan += fan;
  }
  return { yiFans, isYiMan, baoFan, liBaoFan, redBaoFan };
}
function manTypeFromResult({ han, fu = 0, yakuman, name }) {
  if (yakuman > 0 || /役満/.test(name || "")) return ManType.YiMan;
  if (han >= 13) return ManType.YiMan;
  if (han >= 11) return ManType.SanBeiMan;
  if (han >= 8) return ManType.BeiMan;
  if (han >= 6) return ManType.TiaoMan;
  if (han >= 5) return ManType.ManGuan;
  // 低番高符满贯：4 番 40 符以上 / 3 番 70 符以上即满贯档（荣和 8000）
  if ((han === 4 && fu >= 40) || (han === 3 && fu >= 70)) return ManType.ManGuan;
  return ManType.NoMan;
}

export { mapYaku, manTypeFromResult };
