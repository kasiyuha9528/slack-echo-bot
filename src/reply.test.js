import { test } from "node:test";
import assert from "node:assert/strict";
import { buildReply, stripBotMention, neutralizeBroadcast, threadTsOf, MESSAGES } from "./reply.js";

const BOT = "U0CACJX679N";
const withFile = [{ id: "F1" }];

test("文章だけ → そのままオウム返し", () => {
  assert.equal(buildReply({ text: `<@${BOT}> こんにちは` }, BOT), "こんにちは");
});

test("メンションだけ → 本文が空っぽのお知らせ", () => {
  assert.equal(buildReply({ text: `<@${BOT}>` }, BOT), MESSAGES.empty);
});

test("文章 + 画像 → 断りの一言 + 本文", () => {
  assert.equal(
    buildReply({ text: `<@${BOT}> 画像テスト`, files: withFile }, BOT),
    `${MESSAGES.filePrefix}\n\n画像テスト`
  );
});

test("画像だけ → 断り + 文字を入れてのお願い", () => {
  assert.equal(buildReply({ text: `<@${BOT}>`, files: withFile }, BOT), MESSAGES.fileOnly);
});

test("Bot 以外へのメンションは残す", () => {
  assert.equal(stripBotMention(`<@${BOT}> <@U999> おはよう`, BOT), "<@U999> おはよう");
});

test("@channel などの一斉通知は、ただの文字にする", () => {
  assert.equal(neutralizeBroadcast("<!channel> 集合"), "@channel 集合");
  assert.equal(neutralizeBroadcast("<!here|here> 集合"), "@here 集合");
});

test("スレッドの中なら thread_ts、外なら ts に返信する", () => {
  assert.equal(threadTsOf({ ts: "2", thread_ts: "1" }), "1");
  assert.equal(threadTsOf({ ts: "2" }), "2");
});