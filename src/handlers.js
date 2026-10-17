import { buildReply, threadTsOf } from "./reply.js";
import { createDedupe } from "./dedupe.js";

const alreadyHandled = createDedupe();

// Bolt の App に、イベントの処理を登録する。
// ローカル用(src/app.js)と、Vercel用(api/slack/events.js)の、両方から呼ばれる。
export function registerHandlers(app) {
  // メンション(app_mention)が届いたときの処理
  app.event("app_mention", async ({ event, body, context, say, logger }) => {
    // Slack の再送で同じイベントが届いたら、2回返信しないよう無視する
    if (alreadyHandled(body.event_id)) {
      logger.info(`処理済みのイベントのため無視します: ${body.event_id}`);
      return;
    }

    const replyText = buildReply(event, context.botUserId);
    // ログは必要最小限(本文や、ファイル名は出さない)
    logger.info(
      `メンション受信: channel=${event.channel} files=${event.files?.length ?? 0} 返信の長さ=${replyText.length}`
    );

    try {
      await say({ text: replyText, thread_ts: threadTsOf(event) });
    } catch (error) {
      logger.error(`返信に失敗しました: ${error.message}`);
    }
  });
}