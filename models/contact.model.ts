import ChatMessage from "./chatMessage.model";
import ChatUser from "./chatUser.model";

export default interface Contact {
    user: ChatUser;
    latestMessage: ChatMessage;
}