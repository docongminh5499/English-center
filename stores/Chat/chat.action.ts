import { Action, defaultRegistry } from "react-sweet-state";
import { State } from ".";
import API from "../../helpers/api";
import { ChatConstants, Url } from "../../helpers/constants";
import ChatBox from "../../models/chatbox.model";
import ChatUser from "../../models/chatUser.model";
import Contact from "../../models/contact.model";
import ChatMessage from "../../models/chatMessage.model";


export const getContacts =
  (token: string): Action<State> =>
    async ({ setState }) => {
      const responses = await API.post(Url.users.getContacts, { token });
      setState({ contacts: responses.contacts });
    };

export const findContacts =
  (token: string, name: string): Action<State> =>
    async ({ setState }) => {
      const responses = await API.post(Url.users.findContacts, { token, name });
      setState({ searchResults: responses.contacts });
    };


export const clearSearchResults =
  (): Action<State> =>
    async ({ setState }) => {
      setState({ searchResults: [] });
    };


const setCurrentBoxUser = (targetUser: ChatUser): Action<State> =>
  async ({ setState }) => {
    setState({
      currentBox: {
        user: targetUser,
        messages: undefined,
        maxMessageCount: undefined,
      }
    });
  }



export const startChatBox =
  (token: string, targetUser: ChatUser): Action<State> =>
    async ({ setState, dispatch }) => {
      await dispatch(setCurrentBoxUser(targetUser));

      const responses = await API.post(Url.users.getMessages, {
        token: token,
        target: { id: targetUser.userId },
        skip: 0,
        limit: ChatConstants.limitMessage
      });

      responses.messages.sort((prev: ChatMessage, next: ChatMessage) => {
        const prevSendingTime = new Date(prev.sendingTime);
        const nextSendingTime = new Date(next.sendingTime);
        if (prevSendingTime > nextSendingTime) return 1;
        else if (prevSendingTime < nextSendingTime) return -1;
        return 0;
      })

      setState({
        currentBox: {
          user: targetUser,
          messages: responses.messages,
          maxMessageCount: responses.total,
        }
      });
    };


export const getMoreMessages =
  (token: string, skip: number, targetUser: ChatUser): Action<State> =>
    async ({ getState, setState }) => {
      const currentMessagesList = getState().currentBox?.messages;
      const responses = await API.post(Url.users.getMessages, {
        token: token,
        target: { id: targetUser.userId },
        skip: skip,
        limit: ChatConstants.limitMessage
      });

      responses.messages.sort((prev: ChatMessage, next: ChatMessage) => {
        const prevSendingTime = new Date(prev.sendingTime);
        const nextSendingTime = new Date(next.sendingTime);
        if (prevSendingTime > nextSendingTime) return 1;
        else if (prevSendingTime < nextSendingTime) return -1;
        return 0;
      })

      if (targetUser.userId === getState().currentBox?.user.userId) {
        setState({
          currentBox: {
            user: targetUser,
            messages: responses.messages.concat(currentMessagesList),
            maxMessageCount: responses.total,
          }
        })
      }
    }


export const resetData = (): Action<State> =>
  async ({ setState }) => {
    setState({
      contacts: undefined,
      searchResults: [],
      currentBox: undefined,
    })
  };

export const userStatusChange = (userId: number, isActive: boolean): Action<State> =>
  async ({ getState, setState }) => {
    const contacts = getState().contacts?.map(contact => {
      const updatedContact = contact;
      if (contact.user.userId === userId)
        updatedContact.user.isActive = isActive;
      return updatedContact;
    });

    const searchResults = getState().searchResults?.map(contact => {
      const updatedContact = contact;
      if (contact.user.userId === userId)
        updatedContact.user.isActive = isActive;
      return updatedContact;
    });

    const currentBox = getState().currentBox;
    const updatedCurrentBox: ChatBox | undefined = currentBox === undefined ? undefined : {
      user: {
        ...currentBox.user,
        isActive: currentBox.user.userId === userId ? isActive : currentBox.user.isActive
      },
      messages: currentBox.messages,
      maxMessageCount: currentBox.maxMessageCount,
    };

    setState({ contacts, searchResults, currentBox: updatedCurrentBox });
  };


export const receiveMessage = (incomingContact: Contact): Action<State> =>
  async ({ getState, setState }) => {
    let foundContact = false;
    const contacts = getState().contacts?.map(contact => {
      const updatedContact = contact;
      if (contact.user.userId === incomingContact.user.userId) {
        updatedContact.latestMessage = incomingContact.latestMessage;
        foundContact = true;
      }
      return updatedContact;
    });

    if (!foundContact) contacts?.push(incomingContact);
    contacts?.sort((prev: Contact, next: Contact) => {
      const prevSendingTime = new Date(prev.latestMessage.sendingTime);
      const nextSendingTime = new Date(next.latestMessage.sendingTime);

      if (prevSendingTime > nextSendingTime) return -1
      else if (prevSendingTime < nextSendingTime) return 1
      return 0;
    });

    const updatedCurrentBox = getState().currentBox;
    const currentBox = getState().currentBox;

    if (currentBox !== undefined && currentBox.user.userId === incomingContact.user.userId) {
      const currentMaxMessageCount = updatedCurrentBox?.maxMessageCount || 0;
      updatedCurrentBox && (updatedCurrentBox.maxMessageCount = currentMaxMessageCount + 1);
      updatedCurrentBox?.messages?.push(incomingContact.latestMessage);
      updatedCurrentBox?.messages?.sort((prev: ChatMessage, next: ChatMessage) => {
        const prevSendingTime = new Date(prev.sendingTime);
        const nextSendingTime = new Date(next.sendingTime);

        if (prevSendingTime > nextSendingTime) return 1
        else if (prevSendingTime < nextSendingTime) return -1
        return 0;
      });
    }
    setState({ contacts, currentBox: updatedCurrentBox });
  }


export const receiveOwnMessage = (incomingContact: Contact): Action<State> =>
  async ({ getState, setState }) => {
    let foundContact = false;
    const contacts = getState().contacts?.map(contact => {
      const updatedContact = contact;
      if (contact.user.userId === incomingContact.user.userId) {
        updatedContact.latestMessage = incomingContact.latestMessage;
        foundContact = true;
      }
      return updatedContact;
    });

    if (!foundContact) contacts?.push(incomingContact);
    contacts?.sort((prev: Contact, next: Contact) => {
      const prevSendingTime = new Date(prev.latestMessage.sendingTime);
      const nextSendingTime = new Date(next.latestMessage.sendingTime);

      if (prevSendingTime > nextSendingTime) return -1
      else if (prevSendingTime < nextSendingTime) return 1
      return 0;
    });

    const updatedCurrentBox = getState().currentBox;
    const currentBox = getState().currentBox;

    if (currentBox !== undefined && currentBox.user.userId === incomingContact.user.userId) {
      const currentMaxMessageCount = updatedCurrentBox?.maxMessageCount || 0;
      updatedCurrentBox && (updatedCurrentBox.maxMessageCount = currentMaxMessageCount + 1);
      updatedCurrentBox?.messages?.push(incomingContact.latestMessage);
      updatedCurrentBox?.messages?.sort((prev: ChatMessage, next: ChatMessage) => {
        const prevSendingTime = new Date(prev.sendingTime);
        const nextSendingTime = new Date(next.sendingTime);

        if (prevSendingTime > nextSendingTime) return 1
        else if (prevSendingTime < nextSendingTime) return -1
        return 0;
      });
    }
    setState({ currentBox: updatedCurrentBox, contacts: contacts });
  }


export const recevingSeenSignal = (incomingContact: Contact): Action<State> =>
  async ({ getState, setState }) => {
    let updatedCurrentBox = getState().currentBox;
    if (updatedCurrentBox !== undefined && updatedCurrentBox.user.userId === incomingContact.user.userId) {
      const messages = updatedCurrentBox.messages?.map(message => ({ ...message, read: true }));
      updatedCurrentBox = { ...updatedCurrentBox, messages: messages };
    }

    setState({ currentBox: updatedCurrentBox });
  }


export const recevingOwnSeenSignal = (incomingContact: Contact): Action<State> =>
  async ({ getState, setState }) => {
    const contacts = getState().contacts?.map(contact => {
      const updatedContact = contact;
      if (contact.user.userId === incomingContact.user.userId)
        updatedContact.latestMessage.read = true;
      return updatedContact;
    });

    setState({ contacts: contacts });
  }