import { App } from "@slack/bolt";
import { registerHandlers } from "./handlers.js";

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

registerHandlers(app);

await app.start(process.env.PORT || 3000);
app.logger.info("⚡️ Bolt app is running!");