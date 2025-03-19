import { boardService } from "../../services/board";
import { utilService } from "../../services/util.service";
import { store } from "../store";
import {
  EDIT_BOARD,
  REMOVE_BOARD,
  SET_BOARDS,
  OPEN_MODALS,
  SET_FILTER_BY,
  SET_FILTERED_COLUMNS,
  SET_FAVORITES,
} from "../reducer/boards.reducer";
import { showSuccessMsg } from "../../services/event-bus.service";

export async function addBoard(boardName) {
  try {
    const savedBoard = await boardService.addBoard(boardName);
    await setFilteredColumns({ id: savedBoard._id, labels: savedBoard.labels });

    const boards = await boardService.query();

    await store.dispatch({
      type: SET_BOARDS,
      boards,
    });

    return savedBoard;
  } catch (error) {
    console.error("Error adding board:", error);
    throw error;
  }
}

export async function loadBoards() {
  const boards = await boardService.query();
  const filteredColumns = await boardService.getFilteredColumnsSession();
  !filteredColumns &&
    boardService.setFilteredColumnsSession(
      boards.map((board) => ({ id: board._id, labels: board.labels }))
    );
  // const favorites = await setFavories(); //fix it later
  await store.dispatch({ type: SET_BOARDS, boards });
  await store.dispatch({
    type: SET_FILTERED_COLUMNS,
    newFilteredColumns: filteredColumns
      ? JSON.parse(filteredColumns)
      : boards.map((board) => ({
          id: board._id,
          labels: board.labels,
        })),
  });
}

export async function addGroup(boardId) {
  const newGroup = {
    id: utilService.makeId(),
    title: "New Group",
    color: utilService.getRandomColor(),
    tasks: [],
  };

  await boardService.addGroupToBoard(boardId, newGroup);

  const board = await boardService.getById(boardId);
  if (!board) return;

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: board,
  });
}

export async function addItem(
  boardId,
  groupId,
  taskTitle = "",
  isStart = null,
  userId
) {
  const board = await boardService.getById(boardId);
  const labels = [...board.labels];
  const taskId = utilService.makeId();

  // cell: {taskId:xxx, labelId: xxx, value: xxx, type: xxx}
  const newItem = {
    id: taskId,
    cells: labels.map((label) =>
      label.type === "taskTitle"
        ? {
            taskId,
            labelId: label.id,
            value: {
              title: taskTitle,
              chat: [],
              activities: [
                {
                  time: Date.now(),
                  taskId,
                  userId,
                  activity: { field: "taskTitle", type: "created", groupId },
                },
              ],
            },
            type: label.type,
          }
        : boardService.getDefultCell(label, taskId)
    ),
  };
  await boardService.addItemToGroup(boardId, groupId, newItem, isStart);
  const updatedBoard = await boardService.getById(boardId);

  if (!updatedBoard) return;

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  });
}

const statusArray = [
  { text: "Done", color: "#00C875" },
  { text: "Working on it", color: "#FDAB3D" },
  { text: "Stuck", color: "#DF2F4A" },
  { text: "Blank", color: "#C4C4C4" },
];

export async function addItemKanban(
  boardId,
  groupId,
  taskTitle = "",
  isStart = null,
  userId,
  status = "Blank"
) {
  const board = await boardService.getById(boardId);
  const labels = [...board.labels];
  const taskId = utilService.makeId();

  // Find the matching status object
  let statusValue = statusArray.find((s) => s.text === status);

  // If status is "Blank", set text to "", but keep the gray color
  if (status === "Blank") {
    statusValue = { text: "", color: "#C4C4C4" };
  }

  const newItem = {
    id: taskId,
    cells: labels.map((label) =>
      label.type === "taskTitle"
        ? {
            taskId,
            labelId: label.id,
            value: {
              title: taskTitle,
              chat: [],
              activities: [
                {
                  time: Date.now(),
                  taskId,
                  userId,
                  activity: { field: "taskTitle", type: "created", groupId },
                },
              ],
            },
            type: label.type,
          }
        : label.type === "status"
        ? {
            taskId,
            labelId: label.id,
            value: statusValue, // Ensures correct format
            type: label.type,
          }
        : boardService.getDefultCell(label, taskId)
    ),
  };

  await boardService.addItemToGroup(boardId, groupId, newItem, isStart);
  const updatedBoard = await boardService.getById(boardId);

  if (!updatedBoard) return;

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  });
}

export async function removeGroup(boardId, groupId) {
  await boardService.removeGroupFromBoard(boardId, groupId);

  const board = await boardService.getById(boardId);
  if (!board) throw new Error("Board not found");

  const updatedBoard = {
    ...board,
    groups: board.groups.filter((group) => group.id !== groupId),
  };

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  });
}

export async function updateGroup(boardId, groupId, updatedGroupData) {
  await boardService.updateGroupInBoard(boardId, groupId, updatedGroupData);

  const board = await boardService.getById(boardId);
  if (!board) throw new Error("Board not found");

  const updatedBoard = {
    ...board,
    groups: board.groups.map((group) =>
      group.id === groupId ? { ...group, ...updatedGroupData } : group
    ),
  };

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  });
}

export async function removeTasks(boardId, tasksArr) {
  const board = await boardService.removeTasksFromGroup(boardId, tasksArr);
  if (!board) return;

  const updatedBoard = {
    ...board,
    groups: board.groups.map((group) =>
      tasksArr.some((scdArr) => scdArr[0] === group.id)
        ? {
            ...group,
            tasks: group.tasks.filter(
              (task) => !tasksArr.some((scdArr) => scdArr[1] === task.id)
            ),
          }
        : group
    ),
  };

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  });
}
export async function removeTask(boardId, groupId, taskId) {
  const board = await boardService.removeTaskFromGroup(
    boardId,
    groupId,
    taskId
  );
  if (!board) throw new Error("Board not found");

  const updatedBoard = {
    ...board,
    groups: board.groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          tasks: group.tasks.filter((task) => task.id !== taskId),
        };
      }
      return group;
    }),
  };

  // Save the updated board
  await boardService.save(updatedBoard);

  // Dispatch the updated board to Redux store
  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  });

  // Show success message
}

export async function removeBoard(boardId) {
  try {
    await boardService.remove(boardId);
    await boardService.removeBoardFromFilteredColumnsSession(boardId);
    store.dispatch({ type: REMOVE_BOARD, boardId });
  } catch (err) {
    console.error("Failed to remove board:", err);
  }
}

export async function updateTask(boardId, userId, newCell) {
  await boardService.updateTaskInGroup(boardId, userId, newCell);

  const board = await boardService.getById(boardId);
  const cellGroup = board.groups.find((group) =>
    group.tasks.some((task) => task.id === newCell.taskId)
  );
  if (!cellGroup) return;

  const updatedBoard = {
    ...board,
    groups: board.groups.map((group) =>
      group.id === cellGroup.id
        ? {
            ...group,
            tasks: group.tasks.map((task) =>
              task.id === newCell.taskId
                ? {
                    ...task,
                    cells: task.cells.map((cell) =>
                      cell.labelId === newCell.labelId ? newCell : cell
                    ),
                  }
                : task
            ),
          }
        : group
    ),
  };

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  });
}

export async function updateBoardName(boardId, newName) {
  try {
    const updatedBoard = await boardService.updateBoardName(boardId, newName);

    store.dispatch({ type: EDIT_BOARD, boardId, updatedBoard });
  } catch (error) {
    console.error("error dispatching board name update:", error);
  }
}

export async function updateBoardFavorite(boardId) {
  try {
    const updatedBoard = await boardService.updateBoardFavorite(boardId);

    store.dispatch({ type: EDIT_BOARD, boardId, updatedBoard });
  } catch (error) {
    console.error("error dispatching board name update:", error);
  }
}

export function openModal(modalId) {
  const currentModals = store.getState().boardModule.openModals;
  let newModals = currentModals.includes(modalId)
    ? currentModals
    : [...currentModals, modalId];

  // if the modal you open is chat, close every other chat modal
  newModals = boardService.replaceChats(newModals, modalId);

  store.dispatch({ type: OPEN_MODALS, newModals });
}

export function closeModal(modalId) {
  const currentModals = store.getState().boardModule.openModals;
  let newModals = [...currentModals];
  const modalIndex = newModals.findIndex((id) => id === modalId);

  if (modalIndex !== -1) newModals.splice(modalIndex, 1);

  store.dispatch({ type: OPEN_MODALS, newModals });
}

export function handleFilter(filterBy) {
  boardService.setFilterContextSession(filterBy);
  store.dispatch({ type: SET_FILTER_BY, filterBy });
}

export function getFilterContext() {
  const filterBy = boardService.getFilterContextSession();
  store.dispatch({ type: SET_FILTER_BY, filterBy });
  return filterBy;
}

export async function addLable(boardId, labelInfo) {
  const newLabel = {
    id: utilService.makeIdForLabel(),
    type: labelInfo.type,
    name: labelInfo.name,
    width: 150,
  };
  const newBoard = await boardService.addLableToBoard(boardId, newLabel);
  if (!newBoard) return;
  await setFilteredColumns({id:boardId, newLabel});

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  });
}

export async function deleteLable(boardId, labelId) {
  const newBoard = await boardService.deleteLableFromBoard(boardId, labelId);
  if (!newBoard) return;

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  });
}

export async function onChangeLabelName(boardId, labelId, newName) {
  const newBoard = await boardService.changeLabelName(
    boardId,
    labelId,
    newName
  );
  if (!newBoard) return;

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  });
}

export async function replaceGroups(boardId, newGroups) {
  const board = await boardService.getById(boardId);
  if (!board) throw new Error("Board not found");

  const updatedBoard = {
    ...board,
    groups: newGroups,
  };

  await boardService.updateBoard(boardId, updatedBoard);
  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  });
}

export async function replaceLabels(boardId, newLabels) {
  const board = await boardService.getById(boardId);
  if (!board) throw new Error("Board not found");

  const updatedBoard = {
    ...board,
    labels: newLabels,
  };

  await boardService.updateBoard(boardId, updatedBoard);

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  });
}

export async function setFilteredColumns(filteredColumns) {
  const newFilteredColumns = await boardService.setFilteredColumnsSession(
    filteredColumns
  );
  store.dispatch({ type: SET_FILTERED_COLUMNS, newFilteredColumns });
}

export async function setFavories(favorite = []) {
  const serviceFavorites = await boardService.setFavorites(favorite);
  store.dispatch({ type: SET_FAVORITES, favorites: serviceFavorites });
  return await serviceFavorites;
}

export function onUpdateReduxLabelWidth(board, boardId, labelId, newWidth) {
  const newLabels = board.labels.map((label) =>
    label.id === labelId ? { ...label, width: newWidth } : label
  );
  const newBoard = { ...board, labels: newLabels };

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  });
}

export async function onUpdateLocalLabelWidth(boardId, labelId, newWidth) {
  const newBoard = await boardService.changeLabelWidth(
    boardId,
    labelId,
    newWidth
  );

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  });
}

export async function undo(prevBoard){
  const newBoard = await boardService.save(prevBoard)
  console.log(prevBoard, newBoard)
  store.dispatch({
    type: EDIT_BOARD,
    boardId: prevBoard._id,
    updatedBoard: newBoard,
  });
}

export async function duplicateTasks(boardId, tasksToDuplicate) {
  const board = await boardService.getById(boardId)
  const newBoard = await boardService.addMultipleItemsToGroup(
    boardId,
    tasksToDuplicate
  );

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  });
  showSuccessMsg(
    `Duplicated ${tasksToDuplicate.length} task${
      tasksToDuplicate.length > 1 ? "'s" : ""
    }`, board
  );
}
export async function updateTaskStatus(boardId, groupId, taskId, newStatus) {
  if (newStatus === "Blank") newStatus = "";
  try {
    const board = await boardService.getById(boardId);
    if (!board) throw new Error("Board not found");

    const groupIndex = board.groups.findIndex((group) => group.id === groupId);
    if (groupIndex === -1) throw new Error("Group not found");

    const taskIndex = board.groups[groupIndex].tasks.findIndex(
      (task) => task.id === taskId
    );
    if (taskIndex === -1) throw new Error("Task not found");

    const statusCellIndex = board.groups[groupIndex].tasks[
      taskIndex
    ].cells.findIndex((cell) => cell.type === "status");
    if (statusCellIndex === -1) throw new Error("Status cell not found");

    board.groups[groupIndex].tasks[taskIndex].cells[
      statusCellIndex
    ].value.text = newStatus;
    board.groups[groupIndex].tasks[taskIndex].cells[
      statusCellIndex
    ].value.color = getStatusColor(newStatus);

    await boardService.save(board);

    await store.dispatch({
      type: EDIT_BOARD,
      boardId,
      updatedBoard: board,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
  }
}

export async function updateTaskTitle(boardId, groupId, taskId, newTitle) {
  try {
    const board = await boardService.getById(boardId);
    if (!board) throw new Error("Board not found");

    const groupIndex = board.groups.findIndex((group) => group.id === groupId);
    if (groupIndex === -1) throw new Error("Group not found");

    const taskIndex = board.groups[groupIndex].tasks.findIndex(
      (task) => task.id === taskId
    );
    if (taskIndex === -1) throw new Error("Task not found");

    const titleCellIndex = board.groups[groupIndex].tasks[
      taskIndex
    ].cells.findIndex((cell) => cell.type === "taskTitle");
    if (titleCellIndex === -1) throw new Error("Task title cell not found");

    // Update the task title
    board.groups[groupIndex].tasks[taskIndex].cells[
      titleCellIndex
    ].value.title = newTitle;

    await boardService.save(board);

    await store.dispatch({
      type: EDIT_BOARD,
      boardId,
      updatedBoard: board,
    });
  } catch (error) {
    console.error("Error updating task title:", error);
  }
}

export function getStatusColor(status) {
  const statusColors = {
    Done: "#00C875",
    "Working on it": "#FDAB3D",
    Stuck: "#DF2F4A",
    Blank: "#C4C4C4",
  };
  return statusColors[status] || "#C4C4C4";
}
