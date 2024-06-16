import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { role } from 'static/role';
import { CHANNEL_ACCESS_TOKEN, CHANNEL_SECRET, OPENAI_TOKEN } from 'secret';
import { messagingApi, ClientConfig } from '@line/bot-sdk';

const config: ClientConfig = {
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CHANNEL_SECRET,
};

@Injectable()
export class AppService {
  async sendMessage(replyToken: string, message: string): Promise<void> {
    const client = new messagingApi.MessagingApiClient(config);

    await client.replyMessage({
      replyToken: replyToken,
      messages: [{ type: 'text', text: message }],
    });
  }

  async getAiInteraction(message: string): Promise<string> {
    const openai = new OpenAI({ apiKey: OPENAI_TOKEN });
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: role },
        { role: 'user', content: message },
      ],
      model: 'gpt-4o',
    });

    return completion.choices[0].message.content;
  }
}
