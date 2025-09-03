import { Component, OnInit, ViewChild } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import {
  CallEvents,
  Conversation,
  Call,
  ConversationServiceEvents,
  Message,
  RainbowSDK,
  RBEvent,
  User,
  CallStatus,
} from 'rainbow-web-sdk';
import { NetworkService } from '../../services/network.service';
import { CommonModule } from '@angular/common';
import { ConvService } from '../../services/conv.service';
import { FormsModule } from '@angular/forms';
import { CallingService } from '../../services/calling.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer: any;

  protected connectedUser: User = {} as User;
  protected isConnected: boolean = false;
  protected contacts?: User[];
  protected messages: Message[] = [];
  protected newMessage: string = '';
  protected selectedUser: User = {} as User;

  private rainbowSDK: RainbowSDK;
  protected conversation: Conversation | null = null;

  constructor(
    private connectionService: ConnectionService,
    private networkService: NetworkService,
    private convService: ConvService,
    protected callingService: CallingService
  ) {
    this.rainbowSDK = RainbowSDK.getInstance();
    this.subscribeConvServiceEvent();
  }

  ngOnInit(): void {
    const connectionInfo = this.connectionService.isUserConnected();
    this.isConnected = connectionInfo.connected;
  }

  subscribeConvServiceEvent(): void {
    const conversationCallSubscription =
      this.rainbowSDK.conversationService?.subscribe(
        (event: RBEvent<ConversationServiceEvents>) => {
          try {
            const conversation: Conversation = event.data.conversation;

            switch (event.name) {
              case ConversationServiceEvents.ON_NEW_CALL_IN_CONVERSATION:
                this.onCallConversationCreated(conversation);
                break;

              case ConversationServiceEvents.ON_REMOVE_CALL_IN_CONVERSATION:
                this.onCallConversationRemoved(conversation);
                break;

              default:
                break;
            }
          } catch (error) {
            console.error('Error in conversation event handler:', error);
          }
        },
        [
          ConversationServiceEvents.ON_NEW_CALL_IN_CONVERSATION,
          ConversationServiceEvents.ON_REMOVE_CALL_IN_CONVERSATION,
        ]
      );
  }

  protected onCallConversationCreated(conversation: Conversation): void {
    console.log('Call conversation created:', conversation);
    console.log(conversation.call)
    this.conversation = conversation;
    this.subscribeCallEvent();
    return;
  }

  protected onCallConversationRemoved(conversation: Conversation): void {
    console.log('Call conversation removed:', conversation);
    this.conversation = null;
    return;
  }

  subscribeCallEvent(): void {
    const callConversations: Conversation[] =
      this.rainbowSDK.conversationService?.getCallConversations();
    console.log('Found call conversations:', callConversations);

    if (callConversations) {
      // For each call found, subscribe to the events
      callConversations.forEach(async (conv: any) => {
        if (conv.call) {
          this.addCallEventsListeners(conv.call);
        }
      });
    } else {
      console.error('No call conversations found');
    }
  }

  private addCallEventsListeners(call: Call): void {
    let callSubscription: Subscription = call.subscribe(
      (event: RBEvent<CallEvents>) => {
        switch (event.name) {
          case CallEvents.ON_CALL_STATUS_CHANGE:
            console.log('Call status changed');
            break;
          case CallEvents.ON_CALL_CAPABILITIES_UPDATED:
            console.log('Call capabilities updated');
            break;
          case CallEvents.ON_CALL_MEDIA_UPDATED:
            console.log('Call media updated');
            break;
          case CallEvents.ON_CALL_MUTE_CHANGE:
            console.log('Call mute changed');
            break;
          case CallEvents.ON_CALL_NETWORK_QUALITY_CHANGE:
            console.info(`Network quality: ${event.data}`);
            break;
          default:
            console.log('Other call event:', event.name);
            break;
        }
      }
    );
  }

  protected connect() {
    this.connectionService
      .init()
      .then(() => {
        const connectionInfo = this.connectionService.isUserConnected();
        this.isConnected = connectionInfo.connected;
        this.connectedUser = connectionInfo.user
          ? connectionInfo.user
          : ({} as User);
        this.getContacts();
      })
      .catch((error) => {
        console.error(`[testAppli] ${error.message}`);
      });
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error(err);
    }
  }

  private getContacts(): void {
    this.contacts = this.networkService.getContacts();
  }

  protected getMessages(contact: User): void {
    console.log('Contacts', this.contacts);
    this.selectedUser = contact;
    if (this.contacts && this.contacts.length > 0) {
      this.convService.getMessages(contact).then((messages) => {
        this.messages = messages;
      });
    }
    setTimeout(() => this.scrollToBottom(), 100);
  }

  protected sendMessage(): void {
    if (this.newMessage.trim()) {
      this.convService.sendMessage(this.selectedUser, this.newMessage);
      this.newMessage = '';
    }
  }
}
