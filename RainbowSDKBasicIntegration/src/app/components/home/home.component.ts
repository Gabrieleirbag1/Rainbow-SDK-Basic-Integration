import { Component } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private connectionService: ConnectionService) {}

  connect() {
    this.connectionService.init();
  }
}
