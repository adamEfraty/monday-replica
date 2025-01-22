import { boardService } from "../../services/board.service";

export const SET_BOARDS = "SET_BOARDS";
export const EDIT_BOARD = "EDIT_BOARD";
export const REMOVE_BOARD = "REMOVE_BOARD";
export const ADD_BOARD = "ADD_BOARD";
export const OPEN_MODALS = "OPEN_MODALS";
export const SET_FILTER_BY = "SET_FILTER";

const initialState = {
  boards: [],
  openModals: [],
  filterBy: "",
  filterState: false,
};

export const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BOARDS:
      console.log('coko melon')
      return {
        ...state,
        boards: action.boards,
      };
    case REMOVE_BOARD:
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.boardId),
      };
    case ADD_BOARD:
      return {
        ...state,
        boards: [...state.boards, action.board],
      };
    case EDIT_BOARD:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.boardId
            ? {
                ...action.updatedBoard,
                groups: [...action.updatedBoard.groups],
              }
            : { ...board }
        ),
      }
    case OPEN_MODALS:
      return {
        ...state,
        openModals: action.newModals,
      };
    case SET_FILTER_BY:
      return {
        ...state,
        filterBy: action.filterBy,
      };

    default:
      return state;
  }
};
