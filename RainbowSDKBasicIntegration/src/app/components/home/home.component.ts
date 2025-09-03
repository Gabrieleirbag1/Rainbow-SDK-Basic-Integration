import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { Message, User } from 'rainbow-web-sdk';
import { NetworkService } from '../../services/network.service';
import { CommonModule } from '@angular/common';
import { ConvService } from '../../services/conv.service';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  protected connectedUser: User = {} as User;
  protected isConnected: boolean = false;
  protected contacts?: User[];
  protected messages: Message[] = [];
  protected newMessage: string = '';
  protected selectedUser: User = {} as User;

  constructor(private connectionService: ConnectionService, private networkService: NetworkService, private convService: ConvService) {}

  ngOnInit(): void {
    const connectionInfo = this.connectionService.isUserConnected();
    this.isConnected = connectionInfo.connected;
  }

  protected connect() {
    this.connectionService.init().then(() => {
      const connectionInfo = this.connectionService.isUserConnected();
      this.isConnected = connectionInfo.connected;
      this.connectedUser = connectionInfo.user ? connectionInfo.user : {} as User;
      this.getContacts();
    }).catch((error) => {
      console.error(`[testAppli] ${error.message}`);
    });
  }

  private getContacts(): void {
    this.contacts = this.networkService.getContacts();
  }

  protected getMessages(contact: User): void {
    console.log("Contacts", this.contacts);
    this.selectedUser = contact;
    if (this.contacts && this.contacts.length > 0) {
      this.convService.getMessages(contact).then((messages) => {
        this.messages = messages;
      });
    }
  }

  protected sendMessage(): void {
    if (this.newMessage.trim()) {
      this.convService.sendMessage(this.selectedUser, this.newMessage);
      this.newMessage = '';
    }
  }
}
