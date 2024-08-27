import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  //   MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatMessageService } from 'src/chat-message/chat-message.service';
// import { AddMessageDto } from 'src/chat-message/dto/add-message.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5500', // Add your client URL here
    credentials: true,
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatMessageService: ChatMessageService) {
    // Đăng ký Gateway này để có thể sử dụng từ service
    (global as any).chatGateway = this;
  }

  @WebSocketServer() server: Server;

  @MessagePattern('chat-topic')
  async handleChatMessage(
    @Payload() message: any,
    // @Ctx() context: KafkaContext,
  ): Promise<any> {
    console.log('Received message 1 from Kafka:', message);
    // const mess = context.getConsumer();
    // console.log('mess', mess);
    return message;
  }
  @MessagePattern('chat-topic-second')
  async handleChatSecondMessage(
    @Payload() message: any,
    // @Ctx() context: KafkaContext,
  ): Promise<any> {
    console.log('Received message 2 from Kafka:', message);
    // const mess = context.getConsumer();
    // console.log('mess', mess);
    // const createdMessage = new this.chatMessageModel(message);
    // await createdMessage.save();
    return message;
  }
  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    @MessageBody() message: { sender: string; content: string },
  ): Promise<void> {
    console.log('Received message from client:', message);
    await this.chatMessageService.sendMessage(message);
  }

  @MessagePattern('message')
  async receiveMessage(
    @Payload() message: { sender: string; content: string },
  ) {
    console.log('Received message from Kafka', message);
    // Phát lại tin nhắn qua Socket.IO
    (global as any).chatGateway.server.emit('message', message);
  }

  // @SubscribeMessage('message')
  // async handleSendMessage(
  //   client: Socket,
  //   payload: AddMessageDto,
  // ): Promise<void> {
  //   console.log('Received message:', payload);
  //   await this.chatMesageService.addNewChatMessage(payload);
  //   this.server.emit('recMessage', payload);
  // }
  //   @SubscribeMessage('sendMessage')
  //   async handleSendMessage(@MessageBody() message: any) {
  //     console.log('Received message:', message);
  //     // await this.appService.addNewChatMessage(payload);
  //     // this.server.emit('recMessage', payload);
  //   }

  afterInit(server: Server) {
    console.log(server);
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
    //Do stuffs
  }
}
