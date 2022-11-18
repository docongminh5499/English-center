import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Store as ChatStore } from "../Chat";
import { Store as NotificationStore } from "../Notification";
import { Store as AuthStore } from "../Auth";
import { defaultRegistry } from "react-sweet-state";
import { toast } from "react-toastify";


const ChatStoreInstance = defaultRegistry.getStore(ChatStore);
const NotificationStoreInstance = defaultRegistry.getStore(NotificationStore);

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
  });

  socket.on("own_message", (json) => {
    ChatStoreInstance.actions.receiveOwnMessage(json);
  });

  socket.on("seen_message", (json) => {
    ChatStoreInstance.actions.recevingSeenSignal(json);
  });

  socket.on("own_seen_message", (json) => {
    ChatStoreInstance.actions.recevingOwnSeenSignal(json);
  });

  socket.on("send_message_failed", () => {
    toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
  });

  socket.on("notification", (json) => {
    const currentCount = NotificationStoreInstance.storeState.getState().unreadNotificationCount;
    const inNotificationScreen = NotificationStoreInstance.storeState.getState().maxNotificationCount !== undefined;
    NotificationStoreInstance.actions.setUnreadNotificationCount(currentCount + 1);
    if (!inNotificationScreen) toast.info("Bạn có thông báo mới");
    NotificationStoreInstance.actions.receiveNotification(json);
  });

  socket.on("send_notification_success", () => {
    toast.success("Gửi thông báo thành công.");
  });

  socket.on("send_notification_failed", () => {
    toast.error("Không thể gửi thông báo. Vui lòng thử lại.");
  });

  socket.on("read_notification", (json) => {
    NotificationStoreInstance.actions.readNotification(json);
  });

  socket.on("modifyAccount", async () => {
    const AuthStoreInstance = defaultRegistry.getStore(AuthStore);
    await AuthStoreInstance.actions.startLoggingOut();
    await AuthStoreInstance.actions.endLoggingOut();
    await AuthStoreInstance.actions.logOut();
  });
}