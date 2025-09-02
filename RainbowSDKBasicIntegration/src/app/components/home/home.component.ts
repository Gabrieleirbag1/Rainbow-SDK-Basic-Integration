import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  protected isConnected: boolean = false;

  constructor(private connectionService: ConnectionService) {}

  ngOnInit(): void {
    this.isConnected = this.connectionService.isUserConnected();
  }

  connect() {
    this.connectionService.init().then(() => {
      this.isConnected = this.connectionService.isUserConnected();
    }).catch((error) => {
      console.error(`[testAppli] ${error.message}`);
    });
  }
}
