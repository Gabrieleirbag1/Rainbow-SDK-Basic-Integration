import {
  ConnectionState,
  ConnectedUser,
  User,
  ConversationServiceEvents,
  Message,
  Conversation,
  SendMessageData,
  MessageAdditionalContent,
} from "rainbow-web-sdk";
import {
  RBEvent,
  RainbowSDK,
  LogLevelEnum,
  ConnectionServiceEvents,
} from "rainbow-web-sdk";
import config from "../config.json";

class TestRainbowSDK {
  protected rainbowSDK: RainbowSDK;
  private conv: Conversation;

  public async init(): Promise<void> {
    this.rainbowSDK = RainbowSDK.create({
      appConfig: {
        server: config.RAINBOW_SERVER || "demo.openrainbow.org",
        applicationId: config.RAINBOW_APP_ID || "",
        secretKey: config.RAINBOW_SECRET_KEY || "",
      },
      plugins: [],
      autoLogin: true,
      logLevel: LogLevelEnum.WARNING,
    });

    this.rainbowSDK.connectionService.subscribe(
      (event: RBEvent) => this.connectionStateChangeHandler(event),
      ConnectionServiceEvents.RAINBOW_ON_CONNECTION_STATE_CHANGE
    );

    let userConnected: ConnectedUser = await this.rainbowSDK.start();
    const user = config.RAINBOW_USER || "";
    const pwd = config.RAINBOW_PASSWORD || "";

    if (!userConnected) {
      try {
        userConnected = await this.rainbowSDK.connectionService.logon(
          user,
          pwd,
          false
        );
      } catch (error: any) {
        console.error(`[testAppli] ${error.message}`);
        return;
      }
    }
    console.info(
      `[testAppli] connected with user ${userConnected.displayName}`
    );
    this.setupEventListener();
  }

  private connectionStateChangeHandler(event: RBEvent): void {
    const connectionState: ConnectionState = event.data;
    console.info(
      `[testAppli] onConnectionStateChange ${connectionState.state}`
    );
  }

  public async setupEventListener() {
    this.rainbowSDK.conversationService.subscribe(
      (event: RBEvent<ConversationServiceEvents>) => {
        switch (event.name) {
          case ConversationServiceEvents.ON_MESSAGE_ADDED_IN_CONVERSATION:
            console.log("added: ", event)
            break;
          case ConversationServiceEvents.ON_MESSAGE_MODIFIED_IN_CONVERSATION:
            console.log("modified: ", event);
            break;
          default:
            break;
        }
      }
    );
  }

  public async sendAdaptiveCardMessage(
    convId: string,
    card: string,
    alt: string = "1"
  ): Promise<Message> {
    const { conversation, messageData } =
      await this.prepareAdaptiveCardOperation(convId, card);
    return conversation.sendMessage(card, messageData);
  }

  private async prepareAdaptiveCardOperation(
    convId: string,
    card: string
  ): Promise<{
    conversation: Conversation;
    messageData: SendMessageData;
  }> {
    const conversation = await this.rainbowSDK.conversationService.getConversation("66c3ffe31477420ab99f7a137da8ac15@demo-all-in-one-rd-dev-1.opentouch.cloud")
    const additionalContent = MessageAdditionalContent.create(
      "form/json",
      card
    );
    const messageData: SendMessageData = { additionalContent };
    return { conversation, messageData };
  }
}
const testRainbowSDK = new TestRainbowSDK();
testRainbowSDK.init().then(() => {
  const sdk: RainbowSDK = RainbowSDK.getInstance();
  const connectedUser: ConnectedUser = sdk.connectedUser;
  console.log(connectedUser);
  const networkUsers: User[] = sdk.userNetwork.getUsers();
  console.log(networkUsers);
});
