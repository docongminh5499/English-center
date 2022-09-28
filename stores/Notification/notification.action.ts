import { Action } from "react-sweet-state";
import { State } from ".";
import API from "../../helpers/api";
import { NotificationConstants, Url } from "../../helpers/constants";
import Notification from "../../models/notification.model";

export const getNotification =
  (token: string): Action<State> =>
    async ({ getState, setState }) => {
      const notifications = getState().notifications;
      const responses = await API.post(Url.users.getNotifcation, {
        token,
        limit: NotificationConstants.limitNotification,
        skip: notifications.length,
      });
      const concatAndSortNotifications = responses.notifications
        .concat(notifications)
        .sort((prev: Notification, next: Notification) => {
          const prevSendingTime = new Date(prev.createdAt);
          const nextSendingTime = new Date(next.createdAt);
          if (prevSendingTime > nextSendingTime) return -1;
          else if (prevSendingTime < nextSendingTime) return 1;
          return 0;
        });

      setState({ notifications: concatAndSortNotifications, maxNotificationCount: responses.total });
    };

export const resetData =
  (): Action<State> =>
    async ({ setState }) => {
      setState({ notifications: [], maxNotificationCount: undefined });
    }


export const readNotification = (incomingNotification: Notification): Action<State> =>
  async ({ getState, setState }) => {
    const notifications = getState().notifications.map(notification => {
      const updatedNotification = notification;
      if (notification.id === incomingNotification.id) updatedNotification.read = true;
      return updatedNotification;
    });
    setState({ notifications: notifications });
  }


export const receiveNotification = (notification: Notification): Action<State> =>
  async ({ getState, setState }) => {
    if (getState().maxNotificationCount !== undefined) {
      const notifications = getState().notifications.concat(notification);

      notifications.sort((prev: Notification, next: Notification) => {
        const prevSendingTime = new Date(prev.createdAt);
        const nextSendingTime = new Date(next.createdAt);
        if (prevSendingTime > nextSendingTime) return -1;
        else if (prevSendingTime < nextSendingTime) return 1;
        return 0;
      });
      setState({
        notifications: notifications,
        maxNotificationCount: (getState().maxNotificationCount || 0) + 1
      });
    }
  }

export const getUnreadNotificationCount =
  (token: string): Action<State> =>
    async ({ setState }) => {
      const responses = await API.post(Url.users.getUnreadNotificationCount, { token });
      setState({ unreadNotificationCount: responses.notificationCount });
    }


export const setUnreadNotificationCount = (count: number): Action<State> =>
  async ({ setState }) => {
    setState({ unreadNotificationCount: count });
  }