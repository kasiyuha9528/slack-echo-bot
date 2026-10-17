// 返信の内容を決める「判断だけ」の関数たち。
// Slack には、つながない。→ テストしやすく、Vercel でも再利用できる。

export const MESSAGES = {
  // 本文も画像もないとき
  empty: "あれ、本文が空っぽみたいです。本文を入れてもう一度送ってみてください。",
  // 画像だけで、本文がないとき
  fileOnly: "画像やファイルには、お返事できません。文字を入れてもう一度送ってみてください。",
  // 画像つきで、本文があるとき(この後ろに本文を続ける)
  filePrefix: "画像やファイルには、お返事できません。文章だけお返ししますね",
};

// 本文から、Bot 自身へのメンション(<@Botのid>)だけを取り除く。
// 他の人へのメンションは、残す。
export function stripBotMention(text, botUserId) {
  if (!text) return "";
  if (!botUserId) return text.trim();
  const mention = new RegExp(`<@${botUserId}(\\|[^>]*)?>`, "g");
  return text.replace(mention, "").trim();
}

// @channel / @here / @everyone を、通知が飛ばない普通の文字に置き換える。
// (Bot が代わりに、全員へ通知してしまうのを防ぐ)
export function neutralizeBroadcast(text) {
  return text.replace(/<!(channel|here|everyone)(\|[^>]*)?>/g, "@$1");
}

// 返信する文章を決める(4つの分岐)
export function buildReply(event, botUserId) {
  const text = neutralizeBroadcast(stripBotMention(event.text, botUserId));
  const hasFiles = Array.isArray(event.files) && event.files.length > 0;

  if (hasFiles) {
    // 画像つき:本文があれば断りの一言 + 本文、なければ断りの一言だけ
    return text ? `${MESSAGES.filePrefix}\n\n${text}` : MESSAGES.fileOnly;
  }
  // 画像なし:本文があればそのまま、なければ「空っぽ」のお知らせ
  return text || MESSAGES.empty;
}

// 返信先のスレッドを決める。
// スレッドの中でメンションされたら、そのスレッドへ。外なら、そのメッセージを親にして新しいスレッドへ。
export function threadTsOf(event) {
  return event.thread_ts ?? event.ts;
}