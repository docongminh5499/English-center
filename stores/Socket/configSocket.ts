import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Store as ChatStore } from "../Chat";
import { defaultRegistry } from "react-sweet-state";


const ChatStoreInstance = defaultRegistry.getStore(ChatStore);

export default function configureSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
    socket.on("signin", (json) => {
        ChatStoreInstance.actions.userStatusChange(json.userId, true);
    });

    socket.on("signout", (json) => {
        ChatStoreInstance.actions.userStatusChange(json.userId, false);
    });

    socket.on("message", (json) => {
        ChatStoreInstance.actions.receiveMessage(json);
    })

    socket.on("own_message", (json) => {
        ChatStoreInstance.actions.receiveOwnMessage(json);
    })

    socket.on("seen_message", (json) => {
        ChatStoreInstance.actions.recevingSeenSignal(json);
    })

    socket.on("own_seen_message", (json) => {
        console.log(json);
        ChatStoreInstance.actions.recevingOwnSeenSignal(json);
    })
}