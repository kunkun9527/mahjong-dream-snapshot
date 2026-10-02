import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { SICHUAN_CATALOG as catalog } from '../mockjs/sichuan_catalog.mjs';

const game = (type) => catalog.games[type];
const rule = (type, id) => game(type).rules.find((entry) => entry.ruleId === id);
const yaku = (type, name) => game(type).yaku.find((entry) => entry.name === name && entry.ruleOpen === 1);

// 这些测试固定已人工交叉核验的原规则页面证据，不代表四川引擎已接通。
test('四川规则目录绑定原客户端配置及字段元数据版本', async () => {
  for (const [path, expected] of [[catalog.source, catalog.sha256], [catalog.schemaSource, catalog.schemaSha256]]) {
    const bytes = await readFile(new URL(`../${path}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected);
  }
  assert.deepEqual(Object.keys(catalog.games), ['5021', '5022', '5023']);
  assert.deepEqual(Object.values(catalog.games).map((entry) => entry.rules.length), [8, 8, 7]);
  assert.deepEqual(Object.values(catalog.games).map((entry) => entry.yaku.length), [33, 33, 52]);
  assert.equal(catalog.languageAsset, 'LanguageTbUISC');
});

test('普通四川血战与血流保留不同终局条件及原封顶说明', () => {
  assert.match(rule(5022, 502201).content, /108张牌/);
  assert.match(rule(5022, 502201).content, /不能吃/);
  assert.match(rule(5022, 502202).content, /有三个人都胡牌/);
  assert.match(rule(5021, 502102).content, /每个玩家可多次胡牌/);
  assert.match(rule(5022, 502208).content, /免费~逐梦场：128倍/);
  assert.match(rule(5022, 502208).content, /不换三张：256倍/);
  assert.match(rule(5021, 502108).content, /免费场：5120倍/);
  assert.match(rule(5021, 502108).content, /其它场：10240倍/);
});

test('四川规则保留同色换三张、强制打缺及特殊流局赔付条件', () => {
  assert.match(rule(5022, 502204).content, /3张同花色/);
  assert.match(rule(5022, 502203).content, /摸到这门花色的牌一定要打出/);
  assert.match(rule(5022, 502205).content, /先碰再补杠不收取底分/);
  assert.match(rule(5022, 502206).content, /一炮多响，不触发呼叫转移/);
  assert.match(rule(5022, 502207).content, /听牌未胡牌玩家/);
  assert.match(rule(5022, 502207).content, /不包含自摸倍数/);
  assert.match(rule(5022, 502207).content, /若全程打缺牌，无需赔付/);
});

test('番型倍率与不重复计算说明来自页面字段而非仅凭残留算法', () => {
  assert.equal(catalog.multiplierFormat.text, 'X{0}倍');
  assert.equal(catalog.formula.text, '番型1 x 番型2 x ... x 底分');
  const expected = { 平胡: 1, 根: 2, 自摸: 2, 碰碰胡: 2, 清一色: 4, 七对: 4,
    金钩钓: 4, 龙七对: 8, 将对: 8, 清七对: 16, 清金钩钓: 16, 十八罗汉: 64, 清十八罗汉: 256 };
  for (const [name, bei] of Object.entries(expected)) {
    const entry = yaku(5022, name);
    assert.equal(entry.bei, bei, name);
    assert.equal(entry.beiType, 2, name);
    assert.equal(entry.isOpen, 1, name);
  }
  const entry = yaku(5022, '清金钩钓');
  assert.match(entry.description, /不计清一色、金钩钓、碰碰胡、清碰/);
  for (const name of ['清一色', '金钩钓', '碰碰胡', '清碰']) {
    assert.ok(entry.exceptYis.includes(yaku(5022, name).yiType), name);
  }
  // 原展示牌是牌种示意，重复 111 不是重复实体牌；不可直接作为牌山使用。
  assert.ok(entry.yiTypeShow.includes(0));
  assert.ok(new Set(entry.yiTypeShow).size < entry.yiTypeShow.length);
});

test('原始异常和非展示条目完整保留，不能无声修正为推测规则', () => {
  assert.equal(yaku(5022, '将三龙七对').bei, 126); // 原字段是126，不擅改128。
  const hidden = game(5022).yaku.find((entry) => entry.yiType === 502200081);
  assert.equal(hidden.ruleOpen, 0);
  assert.equal(hidden.name, '');
  assert.equal(hidden.bei, 4);
  assert.deepEqual(hidden.exceptYis, [502200071]);
  // 原表的自排除/跨玩法引用是资料事实，不表示应直接照抄为服务端算法。
  assert.ok(yaku(5022, '七对').exceptYis.includes(yaku(5022, '七对').yiType));
  assert.ok(yaku(5022, '天胡').exceptYis.includes(502100111));
});

test('红中血流的独有文案与单吊冲突不被普通四川规则覆盖', () => {
  assert.match(rule(5023, 502301).content, /6张赖子牌，共114张牌/);
  assert.match(rule(5023, 502304).content, /选择3张手牌/);
  assert.doesNotMatch(rule(5023, 502304).content, /同花色/);
  assert.match(rule(5023, 502305).content, /不触发抢杠胡/);
  assert.match(rule(5023, 502302).content, /红中赖子不能做将牌单吊胡牌/);
  assert.match(yaku(5023, '红中金钩钓').description, /只剩下一张红中单钓胡牌/);
  assert.equal(yaku(5023, '红中金钩钓').bei, 16);
});
