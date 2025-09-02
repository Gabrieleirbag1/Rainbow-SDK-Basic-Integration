import { Injectable } from '@angular/core';
import { RainbowSDK, User } from 'rainbow-web-sdk';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor() { }

  public getContacts(): User[] {
    const sdk: RainbowSDK = RainbowSDK.getInstance();
    return sdk.userNetwork.getUsers();
  }
}
