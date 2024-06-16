import { WebhookEvent } from '@line/bot-sdk';
import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('webhook')
  // FIXME: events を Schema で validation すべき
  async handleWebhook(@Body('events') events: WebhookEvent[]): Promise<void> {
    console.log(events);

    events.map(async (event) => this.appService.handleEvent(event));
  }
}
