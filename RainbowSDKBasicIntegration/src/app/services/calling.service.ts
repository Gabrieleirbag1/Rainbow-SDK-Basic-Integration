import { Injectable } from '@angular/core';
import { CallService, RainbowSDK } from 'rainbow-web-sdk';

@Injectable({
  providedIn: 'root'
})
export class CallingService {
  private rainbowSDK: RainbowSDK;
  callService: CallService = {} as CallService;

  constructor() { 
    this.rainbowSDK = RainbowSDK.getInstance();
    this.callService = this.rainbowSDK.callService ? this.rainbowSDK.callService : {} as CallService;
  }

  getCallService(): CallService {
    return this.callService;
  }
}
