export const SET_BOARDS = "SET_BOARDS";
export const EDIT_BOARD = "EDIT_BOARD";
export const REMOVE_BOARD = "REMOVE_BOARD";
export const ADD_BOARD = "ADD_BOARD";
export const OPEN_MODALS = "OPEN_MODALS";
export const SET_FILTER_BY = "SET_FILTER";
export const SET_FILTERED_COLUMNS = "SET_FILTERED_COLUMNS";
export const SET_FAVORITES = "SET_FAVORITES";
export const SET_MODAL = "SET_MODAL";
export const SET_CHECKBOX = "SET_CHECKBOX";
export const SET_MASTER_CHECKBOX = "SET_MASTER_CHECKBOX";
export const DELETE_CHECKBOXES = "DELETE_CHECKBOXES";

const initialState = {
  boards: [],
  openModals: [],
  filterBy: "",
  filteredColumns: [],
  filterState: false,
  favorites: [],
  addBoardModalState: false,
  checkedBoxes: [],
  checkedGroups: [],
};

export const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BOARDS:
      return {
        ...state,
        boards: action.boards,
      };
    case REMOVE_BOARD:
      return {
        ...state,
        boards: state.boards.filter((board) => board._id !== action.boardId),
        filteredColumns: state.filteredColumns.filter(
          (board) => board._id !== action.boardId
        ),
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
          board._id === action.boardId
            ? {
                ...action.updatedBoard,
                groups: [...action.updatedBoard.groups],
              }
            : { ...board }
        ),
      };
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

    case SET_FILTERED_COLUMNS:
      return {
        ...state,
        filteredColumns: action.newFilteredColumns,
      };

    case SET_FAVORITES:
      return {
        ...state,
        favorites: action.favorites,
      };

    case SET_MODAL:
      return {
        ...state,
        addBoardModalState: action.value,
      };

    case DELETE_CHECKBOXES:
      return {
        ...state,
        checkedBoxes: [],
        checkedGroups: [],
      };

    case SET_MASTER_CHECKBOX:
      console.log(action);
      return state.checkedGroups.includes(action.group.id)
        ? {
            ...state,
            checkedBoxes: state.checkedBoxes.filter(
              (e) => e[0] !== action.group.id
            ),
            checkedGroups: state.checkedGroups.filter(
              (id) => id !== action.group.id
            ),
          }
        : {
            ...state,
            checkedBoxes: [
              ...state.checkedBoxes,
              ...action.group.tasks
                .filter(
                  (task) => !state.checkedBoxes.some((e) => e[1] === task.id)
                )
                .map((task) => [action.group.id, task.id]),
            ],
            checkedGroups: [...state.checkedGroups, action.group.id],
          };

    case SET_CHECKBOX:
      return state.checkedBoxes.some((e) => e[1] === action.taskId)
        ? {
            ...state,
            checkedGroups: state.checkedGroups.filter(
              (id) => id !== action.groupId
            ),
            checkedBoxes: state.checkedBoxes.filter(
              (e) => e[1] !== action.taskId
            ),
          }
        : {
            ...state,
            checkedBoxes: (state.checkedBoxes = [
              ...state.checkedBoxes,
              [action.groupId, action.taskId],
            ]),
          };

    default:
      return state;
  }
};
