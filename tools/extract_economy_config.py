"""只读提取本快照的段位/商店配置，生成后端目录；开发机需已有 UnityPy。
字段顺序核对自 IL2CPP v31 metadata 的 Create*Cfg 参数（MethodDefinition 36 字节）。
运行：python tools/extract_economy_config.py；不修改 Unity bundle。
"""
import hashlib
import json
from pathlib import Path
import struct
import UnityPy
import brotli

ROOT = Path(__file__).resolve().parent.parent
SOURCE = 'StreamingAssets/Bundles/WebGL/commonconfigs_d005e1531b1cf360239da815293e48c6.bundle'


class Table:
    def __init__(self, data, position):
        self.data, self.position = data, position
        vtable = position - struct.unpack_from('<i', data, position)[0]
        size = struct.unpack_from('<H', data, vtable)[0]
        self.offsets = struct.unpack_from('<' + 'H' * ((size - 4) // 2), data, vtable + 4)

    def field(self, index):
        offset = self.offsets[index] if index < len(self.offsets) else 0
        return self.position + offset if offset else None

    def integer(self, index):
        at = self.field(index)
        return struct.unpack_from('<i', self.data, at)[0] if at is not None else 0

    def tables(self, index):
        at = self.field(index)
        if at is None:
            return []
        vector = at + struct.unpack_from('<I', self.data, at)[0]
        length = struct.unpack_from('<I', self.data, vector)[0]
        result = []
        for i in range(length):
            at = vector + 4 + i * 4
            result.append(Table(self.data, at + struct.unpack_from('<I', self.data, at)[0]))
        return result


def shop_types():
    source = 'Build/mj-h5.data.unityweb'
    packed = (ROOT / source).read_bytes()
    raw = brotli.decompress(packed)
    offset = raw.find(bytes.fromhex('af1bb1fa1f000000'))
    if offset < 0:
        raise ValueError('缺少预期的 IL2CPP v31 元数据')
    data = raw[offset:]
    header = struct.unpack_from('<64I', data)

    def text(index):
        start = header[6] + index
        return data[start:data.index(b'\0', start)].decode('utf-8')

    defaults = {}
    for at in range(header[16], header[16] + header[17], 12):
        field, _, index = struct.unpack_from('<iii', data, at)
        if index >= 0:
            defaults[field] = index
    for at in range(header[40], header[40] + header[41], 88):
        if text(struct.unpack_from('<I', data, at)[0]) != 'ShopType':
            continue
        start = struct.unpack_from('<i', data, at + 32)[0]
        count = struct.unpack_from('<H', data, at + 68)[0]
        values = {}
        for field in range(start, start + count):
            if field not in defaults:
                continue
            name = text(struct.unpack_from('<I', data, header[24] + field * 12)[0])
            # 本枚举全是 0..10；v31 默认整数使用压缩 ZigZag，而非固定四字节。
            value = data[header[18] + defaults[field]]
            assert value < 128 and value % 2 == 0
            values[name] = value // 2
        mapping = {'GROCERY': 'GroceryCfg', 'COIN': 'CoinShopCfg', 'RECRUIT': 'RecruitShopCfg', 'HONOR': 'MatchRankShop'}
        return {key: values[name] for key, name in mapping.items()}, source, hashlib.sha256(packed).hexdigest()
    raise ValueError('缺少 ShopType 枚举')


def main():
    bundle = (ROOT / SOURCE).read_bytes()
    assert bundle[33:41] == b'UnityFS\0'
    assets = {}
    for obj in UnityPy.load(bundle[33:]).objects:
        if obj.type.name != 'TextAsset':
            continue
        reader = obj.reader
        reader.Position = obj.byte_start
        name = reader.read_aligned_string()
        assets[name] = reader.read_bytes(reader.read_int())

    def rows(name, names, vectors=()):
        data = assets[name]
        tables = Table(data, struct.unpack_from('<I', data)[0]).tables(0)
        result = []
        for table in tables:
            row = {name: table.integer(i) for i, name in enumerate(names) if name}
            for field, name in vectors:
                values = table.tables(field)
                # 本构建全为空；未来配置有档位时必须先补齐语义，不能把 offset 当价格。
                if values:
                    raise ValueError(f'{name}: 出现尚未支持的非空档位配置')
                row[name] = []
            result.append(row)
        return result

    shop_type_map, protocol_source, protocol_sha = shop_types()
    catalog = {
        'source': SOURCE,
        'sha256': hashlib.sha256(bundle).hexdigest(),
        'shopTypes': shop_type_map,
        'protocolSource': protocol_source,
        'protocolSha256': protocol_sha,
        'defaults': {
            'coinId': 60001,
            'currencyIds': [60001, 60002, 60008, 60009, 60010, 60011, 60012],
            'rank': {'level': 17, 'point': 2300},
        },
        'grocery': rows('ShopGroceryTb', ['id', 'type', 'tokenType', 'price', 'buyType', 'limit', 'sort']),
        'recruit': rows('ShopRecruitShopTb', ['id', 'type', 'price', 'sort'], [(4, 'gears')]),
        'honor': rows('ShopHonorPointsShopTb', ['id', 'type', 'price', 'buyType', 'limit', 'sort'], [(6, 'gears')]),
        'coinSlots': rows('ShopCoinShopTb', ['id', 'type', 'rarity', 'count']),
        'refresh': rows('ShopCoinShopRefreshTb', ['count', 'tokenType', 'price']),
        'gifts': rows('BagGiftTable', ['id', 'type', None, 'name', None, 'rarity', None, None, 'price']),
        'materials': rows('BagMaterialTable', ['id', 'type', None, 'name', None, 'rarity', None, None, None, 'price']),
        'dojos': rows('Rank2DojoCfgTb', ['id', 'name', None, None, None, None, 'minRank', 'maxRank', 'entryCurrency', 'entryBalance', 'feeCurrency', 'fee', 'rewardCurrency', 'rewardRate']),
    }
    for mode, table in [('yonma', 'Rank2RankFourCfgTb'), ('sanma', 'Rank2RankThreeCfgTb')]:
        catalog[mode + 'Ranks'] = rows(table, ['id', 'room', 'name', None, 'initial', 'up', 'canDecrease', 'inherit', 'special', 'down'])
    catalog['rankPoints'] = rows('Rank2DojoRankCfgTb', ['id', 'room', 'rank', 'name', 'east1_4', 'east2_4', 'east3_4', 'east4_4', 'half1_4', 'half2_4', 'half3_4', 'half4_4', 'east1_3', 'east2_3', 'east3_3', 'half1_3', 'half2_3', 'half3_3'])
    body = '// 由 tools/extract_economy_config.py 从原客户端配置生成；勿手改。\n'
    body += 'export const ECONOMY_CATALOG = ' + json.dumps(catalog, ensure_ascii=False, indent=2) + ';\n'
    (ROOT / 'mockjs/economy_catalog.mjs').write_text(body, encoding='utf-8', newline='\n')
    print('Generated mockjs/economy_catalog.mjs (source SHA-256 ' + catalog['sha256'] + ')')


if __name__ == '__main__':
    main()
