import { Inject, Injectable } from '@angular/core';
import { Message, RainbowSDK, User } from 'rainbow-web-sdk';

@Injectable({
  providedIn: 'root'
})
export class ConvService {

  private rainbowSDK: RainbowSDK;

  constructor() { 
    this.rainbowSDK = RainbowSDK.getInstance();
  }

  async getMessages(user: User): Promise<void> {  

    const conversationService = this.rainbowSDK.conversationService;

    // Get the conversation associate to the user "A"
    const conversation = await conversationService.getConversation(user);

    if (conversation) {
      // Retrieve the first 10 messages exchanged with "A" in the history (i.e. the ten most recent).
      await conversation.getHistoryPage(10);
      const messages: Message[] = conversation.getMessages();
      // In this case message.length === 10 

      //A  new call to the var method retrieves the next 30, etc...
      await conversation.getHistoryPage(30);

      console.log("Messages", messages);
    }
  }
}
