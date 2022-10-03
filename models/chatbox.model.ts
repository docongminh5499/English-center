import ChatMessage from "./chatMessage.model";
import ChatUser from "./chatUser.model";


export default interface ChatBox {
    user: ChatUser;
    messages?: ChatMessage[];
    maxMessageCount?: number;
}