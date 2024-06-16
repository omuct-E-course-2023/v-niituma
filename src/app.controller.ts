import { WebhookEvent, messagingApi, ClientConfig } from "@line/bot-sdk";
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Post('webhook')
  // FIXME: events を Schema で validation すべき
  async handleWebhook(@Body('events') events: WebhookEvent[]): Promise<void> {
    console.log(events);
    
    events.map(async (event) => { 
      if (!(event.type === "message" && event.message.type === "text")) return;

      const message = await this.appService.getAiInteraction(event.message.text);
      
      this.appService.sendMessage(event.replyToken, message);
    });
  }
}
