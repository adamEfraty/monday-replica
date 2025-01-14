export const SET_BOARDS = 'SET_BOARDS'
export const EDIT_BOARD = 'EDIT_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'

const initialState = {
  boards: [],
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
        boards: state.boards.filter((board) => board._id !== action.boardId),
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

    default:
      return state
  }
}
