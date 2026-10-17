import { App } from "@slack/bolt";
import { VercelReceiver, createHandler } from "@vercel/slack-bolt";
import { registerHandlers } from "../../src/handlers.js";

// Vercel 用の受け口(Slack からのリクエストを受け取る部分)
const receiver = new VercelReceiver();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver,
  deferInitialization: true,
});

registerHandlers(app);

// POST リクエスト(Slack からの通知)を、Bolt に渡す
export const POST = createHandler(app, receiver);