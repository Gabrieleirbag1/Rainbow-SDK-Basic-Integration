import { Component, OnInit, ViewChild } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { Message, User } from 'rainbow-web-sdk';
import { NetworkService } from '../../services/network.service';
import { CommonModule } from '@angular/common';
import { ConvService } from '../../services/conv.service';
import { FormsModule } from '@angular/forms';
import { CallingService } from '../../services/calling.service';

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

  constructor(
    private connectionService: ConnectionService,
    private networkService: NetworkService,
    private convService: ConvService,
    protected callingService: CallingService
  ) {}

  ngOnInit(): void {
    const connectionInfo = this.connectionService.isUserConnected();
    this.isConnected = connectionInfo.connected;
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
