"""只读提取原四川规则页面的数据，不推断服务端规则或修改 Unity。
运行：python -B tools/extract_sichuan_rules.py（开发机需已有 UnityPy、Brotli）。
字段顺序来自原 IL2CPP v31 CreateRulesCfg / CreateCNYiCfg 参数；
页面调用链及残留/冲突项见 docs/multigame-backend-plan.md。
"""
import sys
sys.dont_write_bytecode = True

import hashlib
import json
from pathlib import Path
import struct

from extract_economy_config import ROOT, SOURCE, Table, UnityPy, brotli

GAME_TYPES = (5021, 5022, 5023)
RULE_FIELDS = ['ruleId', 'gameType', 'tab', 'titleId', 'contentId']
YAKU_FIELDS = [
    'yiType', 'gameType', 'calcYiType', 'endId', 'languageId', 'describeId',
    'yiTypeShow', 'picturePath', 'size', 'isOpen', 'priority', 'ruleOpen',
    'cantHuTypes', 'beiType', 'bei', 'sizeType', 'exceptYis',
]
ROOM_FIELDS = [
    'id', 'gameType', 'tab', 'rules', 'separateName', 'backPath', 'colorNum', 'giftId',
    'moneyNeedMin', 'moneyNeedMax', 'moneyCost', 'moneyBase', 'topBei', 'superDoubleLimit',
    'noRobot', 'lockId',
]


def validate_schema():
    """核对字段位置，而不是凭 int 值/offset 的大小猜字段含义。"""
    packed = (ROOT / 'Build/mj-h5.data.unityweb').read_bytes()
    raw = brotli.decompress(packed)
    offset = raw.find(bytes.fromhex('af1bb1fa1f000000'))
    if offset < 0:
        raise ValueError('缺少预期的 IL2CPP v31 元数据')
    data = raw[offset:]
    header = struct.unpack_from('<64I', data)

    def text(index):
        start = header[6] + index
        return data[start:data.index(b'\0', start)].decode('utf-8')

    expected = {
        'CreateRulesCfg': RULE_FIELDS,
        'CreateCNYiCfg': YAKU_FIELDS,
        'CreateSeparateCfg': ROOM_FIELDS,
    }
    seen = set()
    for at in range(header[12], header[12] + header[13], 36):
        method = struct.unpack_from('<7I4H', data, at)
        name = text(method[0])
        if name not in expected:
            continue
        parameters = []
        for index in range(1, method[-1]):  # 第一个参数是 builder。
            param = header[22] + (method[4] + index) * 12
            parameter = text(struct.unpack_from('<I', data, param)[0])
            parameter = parameter.removesuffix('Offset')
            parameters.append(parameter[0].lower() + parameter[1:])
        if parameters != expected[name]:
            raise ValueError(f'{name} 字段顺序变化：{parameters}')
        seen.add(name)
    if seen != set(expected):
        raise ValueError('未找到完整四川配置 schema')
    return hashlib.sha256(packed).hexdigest()


def pointed_field(table, index):
    at = table.field(index)
    return None if at is None else at + struct.unpack_from('<I', table.data, at)[0]


def string(table, index):
    at = pointed_field(table, index)
    if at is None:
        return ''
    length = struct.unpack_from('<I', table.data, at)[0]
    return table.data[at + 4:at + 4 + length].decode('utf-8')


def integers(table, index):
    at = pointed_field(table, index)
    if at is None:
        return []
    length = struct.unpack_from('<I', table.data, at)[0]
    return list(struct.unpack_from('<' + 'i' * length, table.data, at + 4))


def main():
    metadata_hash = validate_schema()
    packed = (ROOT / SOURCE).read_bytes()
    if packed[33:41] != b'UnityFS\0':
        raise ValueError('资源不符合原 commonconfigs 容器格式')
    assets = {}
    for obj in UnityPy.load(packed[33:]).objects:
        if obj.type.name != 'TextAsset':
            continue
        reader = obj.reader
        reader.Position = obj.byte_start
        name = reader.read_aligned_string()
        assets[name] = reader.read_bytes(reader.read_int())

    def rows(name):
        data = assets[name]
        return Table(data, struct.unpack_from('<I', data)[0]).tables(0)

    language = {row.integer(0): string(row, 1) for row in rows('LanguageTbUISC')}
    result = {
        'source': SOURCE,
        'sha256': hashlib.sha256(packed).hexdigest(),
        'schemaSource': 'Build/mj-h5.data.unityweb',
        'schemaSha256': metadata_hash,
        'languageAsset': 'LanguageTbUISC',
        'multiplierFormat': {'id': 1549, 'text': language[1549]},
        'formula': {'id': 2159, 'text': language[2159]},
        'games': {},
    }
    for game_type, name_id in zip(GAME_TYPES, (2034, 2035, 2036)):
        rules = []
        for row in rows('CommonRulesCfgTb'):
            if row.integer(1) != game_type:
                continue
            item = {name: row.integer(i) for i, name in enumerate(RULE_FIELDS)}
            item.update(title=language[item['titleId']], content=language[item['contentId']])
            rules.append(item)
        yaku = []
        for row in rows('CommonCNYiCftTb'):
            if row.integer(1) != game_type:
                continue
            item = {}
            for i, name in enumerate(YAKU_FIELDS):
                if i in (6, 12, 16):
                    item[name] = integers(row, i)
                elif i == 7:
                    item[name] = string(row, i)
                elif i == 8:
                    continue  # Size 是页面布局结构，与规则无关，不猜测其内部格式。
                else:
                    item[name] = row.integer(i)
            item.update(name=language.get(item['languageId'], ''), description=language.get(item['describeId'], ''))
            yaku.append(item)
        rooms = []
        for row in rows('MatchSeparateCfgTb'):
            if row.integer(1) != game_type:
                continue
            # 指针字段只取规则标签；路径/颜色/礼包是界面资源，不参与服务端逻辑。
            item = {'id': row.integer(0), 'gameType': game_type, 'nameId': row.integer(4),
                    'name': language.get(row.integer(4), ''), 'ruleTags': integers(row, 3)}
            for i in range(8, 16):
                item[ROOM_FIELDS[i]] = row.integer(i)
            rooms.append(item)
        result['games'][str(game_type)] = {'name': language[name_id], 'rules': rules, 'yaku': yaku, 'rooms': rooms}
    target = ROOT / 'mockjs/sichuan_catalog.mjs'
    target.write_text(
        '// 由 tools/extract_sichuan_rules.py 提取的原规则页面数据；勿手改。\n'
        '// 含不可见条目和原始异常值；不是可直接执行的完整服务端计分规则。\n'
        'export const SICHUAN_CATALOG = ' + json.dumps(result, ensure_ascii=False, indent=2) + ';\n',
        encoding='utf-8', newline='\n',
    )
    print(f'Generated {target.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
