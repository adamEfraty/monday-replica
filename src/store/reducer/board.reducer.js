import { boardService } from "../../services/board.service";

export const SET_BOARDS = "SET_BOARDS";
export const REMOVE_BOARD = "REMOVE_BOARD";
export const REMOVE_GROUP = "REMOVE_GROUP";
export const REMOVE_TASK = "REMOVE_TASK";
export const REMOVE_COLUMN = "REMOVE_COLUMN";
export const ADD_BOARD = "ADD_BOARD";
export const ADD_GROUP = "ADD_GROUP";
export const ADD_TASK = "ADD_TASK";
export const ADD_COLUMN = "ADD_COLUMN";

const initialState = {
    boards: [],
};

export function boardReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_BOARDS:
      return { ...state, board: action.board };
    case REMOVE_BOARD:
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.boardId),
      };
    case SET_BOARDS:
      return { ...state, boards: action.boards };
    default:
      return state;
  }
}
