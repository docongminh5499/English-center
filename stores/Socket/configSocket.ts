import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Store as ChatStore } from "../Chat";
import { defaultRegistry } from "react-sweet-state";
import { toast } from "react-toastify";


const ChatStoreInstance = defaultRegistry.getStore(ChatStore);

export default function configureSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
    socket.on("signin", (json) => {
        ChatStoreInstance.actions.userStatusChange(json.userId, true);
    });

    socket.on("signout", (json) => {
        ChatStoreInstance.actions.userStatusChange(json.userId, false);
    });

    socket.on("message", (json) => {
        const currentCount = ChatStoreInstance.storeState.getState().unreadMessageCount;
        const inMessageScreen = ChatStoreInstance.storeState.getState().contacts !== undefined;
        ChatStoreInstance.actions.setUnreadMessageCount(currentCount + 1);
        if (!inMessageScreen) toast.info("Bạn có tin nhắn mới");
        ChatStoreInstance.actions.receiveMessage(json);
    })

    socket.on("own_message", (json) => {
        ChatStoreInstance.actions.receiveOwnMessage(json);
    })

    socket.on("seen_message", (json) => {
        ChatStoreInstance.actions.recevingSeenSignal(json);
    })

    socket.on("own_seen_message", (json) => {
        ChatStoreInstance.actions.recevingOwnSeenSignal(json);
    })
}