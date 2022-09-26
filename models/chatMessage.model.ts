export default interface ChatMessage {
    messageContent: string;
    read: boolean;
    sendingTime: Date;
    senderId?: number;
}
