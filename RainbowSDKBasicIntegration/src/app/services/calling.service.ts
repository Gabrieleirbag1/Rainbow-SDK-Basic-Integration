import { Injectable } from '@angular/core';
import { CallService, MediaType, RainbowSDK, User } from 'rainbow-web-sdk';

@Injectable({
  providedIn: 'root'
})
export class CallingService {
  private medias: MediaType[] = [MediaType.AUDIO, MediaType.VIDEO];

  constructor() { 
  }

  async getCallService(): Promise<CallService> {
    const rainbowSDK = RainbowSDK.getInstance();
    const callService = rainbowSDK.callService ? rainbowSDK.callService : {} as CallService;
    return callService;
  }

  makeAudioCall(user: User): void {
    this.getCallService().then(callService => {
      callService.makeWebCall(user);
    });
  }

  makeVideoCall(user: User): void {
    this.getCallService().then(callService => {
      callService.makeWebCall(user, this.medias, "Making some tests");
    });
  }
}
