import { test } from "node:test";
import assert from "node:assert/strict";
import { createDedupe } from "./dedupe.js";

test("同じIDは、2回目から「処理済み」になる", () => {
  const alreadyHandled = createDedupe();
  assert.equal(alreadyHandled("Ev1"), false);
  assert.equal(alreadyHandled("Ev1"), true);
});

test("IDがないときは、処理する", () => {
  const alreadyHandled = createDedupe();
  assert.equal(alreadyHandled(undefined), false);
  assert.equal(alreadyHandled(undefined), false);
});

test("覚える数の上限を超えたら、古いものから忘れる", () => {
  const alreadyHandled = createDedupe(2);
  alreadyHandled("a");
  alreadyHandled("b");
  alreadyHandled("c");               // 上限(2)を超え、"a" を忘れる
  assert.equal(alreadyHandled("a"), false);
});