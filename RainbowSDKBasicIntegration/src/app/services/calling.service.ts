import { Injectable } from '@angular/core';
import { CallService, MediaType, RainbowSDK, User } from 'rainbow-web-sdk';

@Injectable({
  providedIn: 'root'
})
export class CallingService {
  private rainbowSDK: RainbowSDK;
  private medias: MediaType[] = [MediaType.AUDIO, MediaType.VIDEO];
  callService: CallService = {} as CallService;

  constructor() { 
    this.rainbowSDK = RainbowSDK.getInstance();
    this.callService = this.rainbowSDK.callService ? this.rainbowSDK.callService : {} as CallService;
  }

  getCallService(): CallService {
    return this.callService;
  }

  makeAudioCall(user: User): void {
    this.callService.makeWebCall(user)
  }

  makeVideoCall(user: User): void {
    this.callService.makeWebCall(user, this.medias, "Making some tests")
  }
}
