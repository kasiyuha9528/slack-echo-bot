import { App } from "@slack/bolt";

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

// メンション(app_mention)が届いたときの処理
app.event("app_mention", async ({ event, logger }) => {
  logger.info(`メンションを受け取りました: ${JSON.stringify(event)}`);
});

await app.start(process.env.PORT || 3000);
app.logger.info("⚡️ Bolt app is running!");
