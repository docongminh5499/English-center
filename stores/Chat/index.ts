import { createHook, createStore } from "react-sweet-state";
import { clearSearchResults, findContacts, getContacts, getMoreMessages, receiveMessage, receiveOwnMessage, recevingOwnSeenSignal, recevingSeenSignal, resetData, startChatBox, userStatusChange } from "./chat.action";
import Contact from "../../models/contact.model";
import ChatBox from "../../models/chatbox.model";

export type State = {
    contacts: Contact[] | undefined,
    searchResults: Contact[],
    currentBox: ChatBox | undefined,
};

const initialState: State = {
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
    recevingOwnSeenSignal
};

export const Store = createStore({
    initialState,
    actions,
    name: "chat",
});

export const useChat = createHook(Store);