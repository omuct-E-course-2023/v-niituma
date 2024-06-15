// import * as line from "@line/bot-sdk";
import { WebhookEvent, messagingApi, ClientConfig } from "@line/bot-sdk";
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CHANNEL_ACCESS_TOKEN, CHANNEL_SECRET } from "secret";

const config: ClientConfig = {
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CHANNEL_SECRET
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('webhook')
  async handleWebhook(@Body('events') events: WebhookEvent[]): Promise<void> {
    const client = new messagingApi.MessagingApiClient(config);
    console.log(events);
    
    events.map(async (event) => {
      
      if (!(event.type === "message" && event.message.type === "text")) return;
      
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: event.message.text
          }
        ]
      })
    })
  }
}
