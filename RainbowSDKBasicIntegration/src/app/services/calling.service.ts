import { Injectable } from '@angular/core';
import { Call, CallService, MediaType, RainbowSDK, User } from 'rainbow-web-sdk';

@Injectable({
  providedIn: 'root'
})
export class CallingService {
  private medias: MediaType[] = [MediaType.AUDIO, MediaType.VIDEO];
  rainbowSDK: RainbowSDK;

  constructor() { 
    this.rainbowSDK = RainbowSDK.getInstance();
  }

  async getCallService(): Promise<CallService> {
    const callService = this.rainbowSDK.callService ? this.rainbowSDK.callService : {} as CallService;
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

  async answerCall(call: Call, doesAnswer: boolean): Promise<void> {
    await call.answer(doesAnswer);
  }

  async releaseCall(call: Call): Promise<void> {
    await call.release();
    await call.addVideo();
  }

}