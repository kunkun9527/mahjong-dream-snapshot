import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createDefaultProfile, saveProfile } from '../local/profile.mjs';

for (const permanent of [false, true]) {
  test(permanent ? '文件持续占用只尝试三次并保留原档案' : '文件短暂占用后仍以原子替换完成存档', async (t) => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mj-save-retry-'));
    try {
      const profile = createDefaultProfile();
      await saveProfile(directory, profile);
      const file = path.join(directory, 'profile.json');
      const before = await fs.readFile(file, 'utf8');
      const rename = fs.rename.bind(fs);
      let attempts = 0;
      t.mock.method(fs, 'rename', async (...args) => {
        attempts++;
        assert.equal(await fs.readFile(file, 'utf8'), before);
        if (permanent || attempts < 3) throw Object.assign(new Error('mock 文件占用'), { code: 'EPERM' });
        return rename(...args);
      });
      profile.coins = 55;
      if (permanent) {
        await assert.rejects(saveProfile(directory, profile), { code: 'EPERM' });
        assert.equal(await fs.readFile(file, 'utf8'), before);
      } else {
        await saveProfile(directory, profile);
        assert.equal(JSON.parse(await fs.readFile(file, 'utf8')).coins, 55);
      }
      assert.equal(attempts, 3);
      assert.deepEqual(await fs.readdir(directory), ['profile.json']);
    } finally {
      t.mock.restoreAll();
      await fs.rm(directory, { recursive: true, force: true });
    }
  });
}
