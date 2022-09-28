import { createHook, createStore } from "react-sweet-state";
import Notification from "../../models/notification.model";
import { getNotification, getUnreadNotificationCount, readNotification, receiveNotification, resetData, setUnreadNotificationCount } from "./notification.action";

export type State = {
    notifications: Notification[];
    unreadNotificationCount: number;
    maxNotificationCount: number | undefined;
};

const initialState: State = {
    notifications: [],
    unreadNotificationCount: 0,
    maxNotificationCount: undefined,
};

const actions = {
    getNotification,
    resetData,
    readNotification,
    receiveNotification,
    getUnreadNotificationCount,
    setUnreadNotificationCount,
};

export const Store = createStore({
    initialState,
    actions,
    name: "notification",
});

export const useNotification = createHook(Store);