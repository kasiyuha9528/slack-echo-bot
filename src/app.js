import { App } from "@slack/bolt";
import { buildReply, threadTsOf } from "./reply.js";
import { createDedupe } from "./dedupe.js";

// 必要な環境変数が設定されているか確認する
for (const name of ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET"]) {
  if (!process.env[name]) {
    console.error(`環境変数 ${name} が設定されていません`);
    process.exit(1);
  }
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const alreadyHandled = createDedupe();

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

await app.start(process.env.PORT || 3000);
app.logger.info("⚡️ Bolt app is running!");