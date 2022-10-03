import { createHook, createStore } from "react-sweet-state";
import { clearSearchResults, findContacts, getContacts, getMoreMessages, getUnreadMessageCount, receiveMessage, receiveOwnMessage, recevingOwnSeenSignal, recevingSeenSignal, resetData, setUnreadMessageCount, startChatBox, userStatusChange } from "./chat.action";
import Contact from "../../models/contact.model";
import ChatBox from "../../models/chatbox.model";

export type State = {
    unreadMessageCount: number;
    contacts: Contact[] | undefined,
    searchResults: Contact[],
    currentBox: ChatBox | undefined,
};

const initialState: State = {
    unreadMessageCount: 0,
    contacts: undefined,
    searchResults: [],
    currentBox: undefined,
};

const actions = {
    getContacts,
    findContacts,
    clearSearchResults,
    startChatBox,
    resetData,
    userStatusChange,
    receiveMessage,
    receiveOwnMessage,
    getMoreMessages,
    recevingSeenSignal,
    recevingOwnSeenSignal,
    getUnreadMessageCount,
    setUnreadMessageCount
};

export const Store = createStore({
    initialState,
    actions,
    name: "chat",
});

export const useChat = createHook(Store);