import { boardService } from '../../services/board.service'

export const SET_BOARDS = 'SET_BOARDS'
export const EDIT_BOARD = 'EDIT_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const OPEN_MODALS = 'OPEN_MODALS'
export const SET_FILTER_BY = 'SET_FILTER'
export const SET_FILTERED_COLUMNS = 'SET_FILTERED_COLUMNS'

const initialState = {
  boards: [],
  openModals: [],
  filterBy: '',
  filteredColumns: [],
  filterState: false,
}

export const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BOARDS:
      return {
        ...state,
        boards: action.boards,
      }
    case REMOVE_BOARD:
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.boardId),
        filteredColumns: state.filteredColumns.filter(board => board.id !== action.boardId)
      }
    case ADD_BOARD:
      return {
        ...state,
        boards: [...state.boards, action.board],
      }
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
      }
    case SET_FILTER_BY:
      return {
        ...state,
        filterBy: action.filterBy,
      }

      case SET_FILTERED_COLUMNS:
      return {
        ...state,
        filteredColumns: action.newFilteredColumns,
      }

    default:
      return state
  }
}
