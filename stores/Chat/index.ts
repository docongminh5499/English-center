import { createHook, createStore } from "react-sweet-state";
import ChatBox from "../../models/chatbox.model";
import Contact from "../../models/contact.model";
import { clearSearchResults, findContacts, getContacts, getMoreMessages, getUnreadMessageCount, receiveMessage, receiveOwnMessage, recevingOwnSeenSignal, recevingSeenSignal, resetData, setUnreadMessageCount, startChatBox, userStatusChange } from "./chat.action";

export type State = {
    unreadMessageCount: number;
    contacts: Contact[] | undefined,
    totalContacts: number,
    searchResults: Contact[],
    totalSearchResults: number,
    currentBox: ChatBox | undefined,
};

const initialState: State = {
    unreadMessageCount: 0,
    contacts: undefined,
    totalContacts: 0,
    searchResults: [],
    totalSearchResults: 0,
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