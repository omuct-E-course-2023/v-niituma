// import * as line from "@line/bot-sdk";
import OpenAI from "openai";
import { WebhookEvent, messagingApi, ClientConfig } from "@line/bot-sdk";
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CHANNEL_ACCESS_TOKEN, CHANNEL_SECRET, OPENAI_TOKEN } from "secret";
import { role } from "static/role"

const config: ClientConfig = {
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CHANNEL_SECRET
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Post('webhook')
  // FIXME: events を Schema で validation すべき
  // service としてきりだす
  async handleWebhook(@Body('events') events: WebhookEvent[]): Promise<void> {
    const client = new messagingApi.MessagingApiClient(config);
    const openai = new OpenAI({apiKey: OPENAI_TOKEN});
    console.log(events);
    
    events.map(async (event) => { 
      if (!(event.type === "message" && event.message.type === "text")) return;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: role }, {role: "user", content: event.message.text}],
        model: "gpt-4o",
      });
      
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: completion.choices[0].message.content
          }
        ]
      })
    });
  }
}
