import { createHook, createStore } from "react-sweet-state";
import { resetData, setSelectedStudent } from "./parent.action";

export type State = {
	selectedStudentId?: number;
};

const initialState: State = {
  selectedStudentId: undefined,
};

const actions = {
  setSelectedStudent,
	resetData,
};

export const Store = createStore({
  initialState,
  actions,
  name: "parent",
});

export const useParent = createHook(Store);