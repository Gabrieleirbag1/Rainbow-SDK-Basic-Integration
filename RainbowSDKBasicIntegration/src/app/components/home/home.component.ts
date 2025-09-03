import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { User } from 'rainbow-web-sdk';
import { NetworkService } from '../../services/network.service';
import { CommonModule } from '@angular/common';
import { ConvService } from '../../services/conv.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  protected isConnected: boolean = false;
  protected contacts?: User[];

  constructor(private connectionService: ConnectionService, private networkService: NetworkService, private convService: ConvService) {}

  ngOnInit(): void {
    this.isConnected = this.connectionService.isUserConnected();
  }

  connect() {
    this.connectionService.init().then(() => {
      this.isConnected = this.connectionService.isUserConnected();
      this.getContacts();
      this.getConversations();
    }).catch((error) => {
      console.error(`[testAppli] ${error.message}`);
    });
  }

  private getContacts(): void {
    this.contacts = this.networkService.getContacts();
  }

  private getConversations(): void {
    console.log("Contacts", this.contacts);
    if (this.contacts && this.contacts.length > 0) {
      this.convService.getMessages(this.contacts[0]).then(() => {
        // Handle the retrieved messages
      });
    }
  }
}
