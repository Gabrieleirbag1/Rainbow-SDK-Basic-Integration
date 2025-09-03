import { Inject, Injectable } from '@angular/core';
import {
  Conversation,
  ConversationServiceEvents,
  Message,
  RainbowSDK,
  RBEvent,
  User,
} from 'rainbow-web-sdk';

@Injectable({
  providedIn: 'root',
})
export class ConvService {
  private rainbowSDK: RainbowSDK;

  constructor() {
    this.rainbowSDK = RainbowSDK.getInstance();
  }

  private getConversationService(): any {
    return this.rainbowSDK.conversationService;
  }

  private getConversation(user: User): Promise<any> {
    const conversationService = this.getConversationService();
    return conversationService.getConversation(user);
  }

  async getMessages(user: User): Promise<Message[]> {
    const conversation = await this.getConversation(user);

    if (conversation) {
      // Retrieve the first 30 messages exchanged with "A" in the history (i.e. the thirty most recent).
      await conversation.getHistoryPage(30);
      const messages: Message[] = conversation.getMessages();

      console.log('Messages', messages);
      return messages;
    }
    return [];
  }

  async sendMessage(user: User, messageText: string): Promise<void> {
    const conversation = await this.getConversation(user);

    if (conversation) {
      conversation.sendMessage(messageText);
    }
  }
}
