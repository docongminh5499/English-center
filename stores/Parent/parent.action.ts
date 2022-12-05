import { Action } from "react-sweet-state";
import { State } from ".";

export const resetData =
  (): Action<State> =>
  async ({ setState }) => {
    setState({ selectedStudentId: undefined });
  };

export const setSelectedStudent =
  (selectedStudentId: number): Action<State> =>
  async ({ setState }) => {
    setState({ selectedStudentId: selectedStudentId });
  };
