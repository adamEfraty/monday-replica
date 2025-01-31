import { updateTask } from "../store/actions/boards.actions.js";
import { storageService } from "./async-storage.service.js";
import { utilService } from "./util.service.js";

const imageLinks = [
  "https://images.pexels.com/photos/30061809/pexels-photo-30061809/free-photo-of-fashionable-woman-posing-with-colorful-headscarf.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/30007901/pexels-photo-30007901/free-photo-of-thoughtful-man-in-grey-coat-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/28773362/pexels-photo-28773362/free-photo-of-dynamic-black-and-white-portrait-of-young-man-on-phone.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/30071289/pexels-photo-30071289/free-photo-of-portrait-of-a-bearded-man-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
];

const STORAGE_KEY = "boards";
const CHAT_KEY = "chat";
const FAVORITES_KEY = "favorites";

export const boardService = {
  query,
  getById,
  remove,
  save,
  addGroupToBoard,
  makeFirstBoard,
  addItemToGroup,
  removeGroupFromBoard,
  removeTaskFromGroup,
  removeTasksFromGroup,
  updateTaskInGroup,
  updateGroupInBoard,
  addBoard,
  updateBoardName,
  updateBoard,
  saveTempChatInfo,
  getChatTempInfo,
  getDefaultFilter,
  openChat,
  getOpenChat,
  replaceChats,
  getFilterState,
  setFilterStateSession,
  getFilterContextSession,
  setFilterContextSession,
  addLableToBoard,
  getDefultCell,
  setFilteredColumnsSession,
  getFilteredColumnsSession,
  removeBoardFromFilteredColumnsSession,
  setFavorites,
};

function setFavorites(favoriteId) {
  const localFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  if (localFavorites && localFavorites[0]) {
    const index = localFavorites.findIndex((id) => id === favoriteId);
    if (index !== -1) {
      localFavorites.splice(index, 1);
    } else {
      localFavorites.push(favoriteId);
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(localFavorites));
  } else {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([favoriteId]));
  }
}

async function addBoard() {
  try {
    const newBoard = {
      title: "New Board",
      labels: [
        { id: utilService.makeIdForLabel(), type: "taskTitle", name: "task" },
        {
          id: utilService.makeIdForLabel(),
          type: "priority",
          name: "priority",
        },
        { id: utilService.makeIdForLabel(), type: "status", name: "status" },
        { id: utilService.makeIdForLabel(), type: "members", name: "members" },
        { id: utilService.makeIdForLabel(), type: "date", name: "date" },
      ],
      groups: [],
    };
    const savedBoard = await storageService.post(STORAGE_KEY, newBoard);

    return savedBoard;
  } catch (error) {
    console.error("Error adding board:", error);
    throw error;
  }
}

async function query() {
  try {
    let boards = await storageService.query(STORAGE_KEY);
    if (!boards || boards.length === 0) {
      await makeFirstBoard();
      boards = await storageService.query(STORAGE_KEY);
    }
    return boards;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
}

function getById(id) {
  return storageService.get(STORAGE_KEY, id);
}

function remove(id) {
  return storageService.remove(STORAGE_KEY, id);
}

async function save(boardToSave) {
  console.log("this is the board to save: ", boardToSave);
  if (boardToSave.id) {
    return storageService.put(STORAGE_KEY, boardToSave);
  } else {
    return storageService.post(STORAGE_KEY, boardToSave);
  }
}

async function addGroupToBoard(boardId, newGroup) {
  const board = await getById(boardId);
  if (!board) throw new Error("Board not found");

  newGroup.id = `group${Date.now()}`;
  const updatedGroups = [...(board.groups || []), { ...newGroup }];

  const updatedBoard = {
    ...board,
    groups: updatedGroups,
  };

  await save(updatedBoard);
  return newGroup;
}

async function addItemToGroup(boardId, groupId, newItem, isStart = null) {
  const board = await getById(boardId);
  if (!board) throw new Error("Board not found");

  const groupIndex = board.groups.findIndex((group) => group.id === groupId);
  if (groupIndex === -1) throw new Error("Group not found");

  isStart
    ? board.groups[groupIndex].tasks.unshift(newItem)
    : board.groups[groupIndex].tasks.push(newItem);
  await save(board);
}

async function removeGroupFromBoard(boardId, groupId) {
  const board = await getById(boardId);
  if (!board) throw new Error("Board not found");

  board.groups = board.groups.filter((group) => group.id !== groupId);
  await save(board);
}

async function removeTasksFromGroup(boardId, tasksToRemove) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    tasksToRemove.forEach((task) => {
      const group = board.groups.find((group) => group.id === task[0]);
      if (!group) throw new Error("Group not found");

      group.tasks = group.tasks.filter((t) => t.id !== task[1]);
    });

    return await save(board);
  } catch (error) {
    console.error("Error removing tasks:", error);
    throw error;
  }
}

function getDefaultFilter() {
  return {
    tasTitle: "",
    priority: "",
    status: "",
    members: "",
  };
}

async function removeTaskFromGroup(boardId, groupId, taskId) {
  const board = await getById(boardId);
  if (!board) throw new Error("Board not found");

  const groupIndex = board.groups.findIndex((group) => group.id === groupId);
  if (groupIndex === -1) throw new Error("Group not found");

  const group = board.groups[groupIndex];
  const taskIndex = group.tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) throw new Error("Task not found");

  group.tasks.splice(taskIndex, 1); // Remove the task

  // Save the updated board with the modified group
  await save(board);
  return board; // Returning the updated group (optional, for use in UI or elsewhere)
}
// cell: {taskId:xxx, labelId: xxx, value: xxx, type: xxx}
async function updateTaskInGroup(boardId, newCell) {
  try {
    console.log("cell to update", newCell);
    const board = await getById(boardId); // Call directly without 'this'
    const updatedBoard = {
      ...board,
      groups: board.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) => ({
          ...task,
          cells: task.cells.map((cell) =>
            cell.taskId === newCell.taskId && cell.labelId === newCell.labelId
              ? newCell
              : cell
          ),
        })),
      })),
    };
    await save(updatedBoard).then(() => {
      console.log("updated board", updatedBoard);
    });

    return newCell.value;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

async function updateGroupInBoard(boardId, groupId, updatedGroupData) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    const groupIndex = board.groups.findIndex((group) => group.id === groupId);
    if (groupIndex === -1) throw new Error("Group not found");

    board.groups[groupIndex] = {
      ...board.groups[groupIndex],
      ...updatedGroupData,
    };
    await save(board);

    return board.groups[groupIndex];
  } catch (error) {
    console.error("Error updating group:", error);
    throw error;
  }
}

async function updateBoard(boardId, updatedBoardData) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    const updatedBoard = {
      ...board,
      ...updatedBoardData,
    };

    await save(updatedBoard);

    return updatedBoard;
  } catch (error) {
    console.error("Error updating board:", error);
    throw error;
  }
}

async function updateBoardName(boardId, newName) {
  try {
    // Retrieve the board by ID
    const board = await getById(boardId);
    if (!board) throw new Error(`Board with ID ${boardId} not found`);

    // Update the board's name
    board.title = newName;

    // Save the updated board back to storage
    const updatedBoard = await save(board);
    return updatedBoard;
  } catch (error) {
    console.error("Error updating board name:", error);
    throw error;
  }
}

async function makeFirstBoard() {
  const imageLinks = [
    "https://images.pexels.com/photos/30061809/pexels-photo-30061809/free-photo-of-fashionable-woman-posing-with-colorful-headscarf.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/30007901/pexels-photo-30007901/free-photo-of-thoughtful-man-in-grey-coat-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/28773362/pexels-photo-28773362/free-photo-of-dynamic-black-and-white-portrait-of-young-man-on-phone.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/30071289/pexels-photo-30071289/free-photo-of-portrait-of-a-bearded-man-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  const usersInBoard = [
    { id: "userid0", fullName: "tal", color: "red", imgUrl: imageLinks[0] },
    { id: "userid1", fullName: "shal", color: "green", imgUrl: imageLinks[1] },
    { id: "userid2", fullName: "bal", color: "black", imgUrl: imageLinks[2] },
    { id: "userid3", fullName: "shal", color: "green", imgUrl: imageLinks[3] },
  ];

  const board = {
    title: "SAR default board",
    members: usersInBoard,
    labels: [
      { id: utilService.makeIdForLabel(), type: "taskTitle", name: "task" },
      { id: utilService.makeIdForLabel(), type: "priority", name: "priority" },
      { id: utilService.makeIdForLabel(), type: "status", name: "status" },
      { id: utilService.makeIdForLabel(), type: "members", name: "members" },
      { id: utilService.makeIdForLabel(), type: "date", name: "date" },
    ],
    groups: [],
  };

  const boardsFromStorage = await storageService.query(STORAGE_KEY);
  if (!boardsFromStorage || boardsFromStorage.length < 2) {
    const savedBoard = await storageService.post(STORAGE_KEY, board);
    setFilteredColumnsSession([
      { id: savedBoard.id, labels: savedBoard.labels },
    ]);
    console.log("First board created successfully");
  }
}

// newComments = [width: xxx, scroll: xxx, open: xxx, comments: [{id: xxx, comment: xxx}, ...]]
function saveTempChatInfo(id, width, scroll, newComment) {
  const newCommentsStr = sessionStorage.getItem(CHAT_KEY);

  // in case no newComments exists
  if (!newCommentsStr)
    return sessionStorage.setItem(
      CHAT_KEY,
      JSON.stringify({
        width,
        scroll,
        open: id,
        comments: [{ id, comment: newComment }],
      })
    );

  const newComments = JSON.parse(newCommentsStr);
  newComments.width = width;
  newComments.scroll = scroll;
  const commentIndex = newComments.comments.findIndex(
    (comment) => comment.id === id
  );

  // if comment already in commends array
  if (commentIndex !== -1)
    newComments.comments[commentIndex].comment = newComment;
  // if not
  else newComments.comments.push({ id, comment: newComment });

  sessionStorage.setItem(CHAT_KEY, JSON.stringify(newComments));
}

function getChatTempInfo(id) {
  const newCommentsStr = sessionStorage.getItem(CHAT_KEY);
  // in case no newComments exists
  if (!newCommentsStr) return null;
  else {
    const newComments = JSON.parse(newCommentsStr);
    const commentIndex = newComments.comments.findIndex(
      (comment) => comment.id === id
    );

    // in case comment exists
    if (commentIndex !== -1)
      return {
        id,
        width: newComments.width,
        scroll: newComments.scroll,
        comment: newComments.comments[commentIndex].comment,
      };
    // in case it's not
    else return null;
  }
}

function openChat(id) {
  const newCommentsStr = sessionStorage.getItem(CHAT_KEY);
  if (newCommentsStr) {
    const newComments = JSON.parse(newCommentsStr);
    newComments.open = id;
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(newComments));
  }
}

function getOpenChat() {
  const newCommentsStr = sessionStorage.getItem(CHAT_KEY);
  if (newCommentsStr) {
    const newComments = JSON.parse(newCommentsStr);
    return newComments.open;
  } else return null;
}

function replaceChats(newModals, modalId) {
  if (modalId.substring(0, 4) === "chat") {
    let result = newModals.filter((id) => id.substring(0, 4) !== "chat");
    return [...result, modalId];
  }
  return newModals;
}

function setFilterStateSession(state) {
  sessionStorage.setItem("filterState", state);
}

function setFilterContextSession(txt) {
  sessionStorage.setItem("filterContext", txt);
}

function setFilteredColumnsSession(newColumn) {
  console.log("columns: ", newColumn);
  const filteredColumnsArr = JSON.parse(
    sessionStorage.getItem("filteredColumns")
  );
  if (filteredColumnsArr && filteredColumnsArr[0]) {
    console.log("filteredColumnsArr: ", filteredColumnsArr);
    const index = filteredColumnsArr.findIndex(
      (column) => column.id === newColumn.id
    );
    index < 0 ? filteredColumnsArr.push(newColumn) : filteredColumnsArr[index] = newColumn;
    console.log("filteredColumnsArr: ", filteredColumnsArr);
    sessionStorage.setItem(
      "filteredColumns",
      JSON.stringify(
        Array.isArray(filteredColumnsArr)
          ? filteredColumnsArr
          : [filteredColumnsArr]
      )
    );
    return filteredColumnsArr;
  } else {
    sessionStorage.setItem(
      "filteredColumns",
      JSON.stringify(Array.isArray(newColumn) ? newColumn : [newColumn])
    );
  }
  sessionStorage.setItem("d", JSON.stringify([{ id: "1", name: "tal" }]));
}

function getFilteredColumnsSession() {
  const filteredColumns = sessionStorage.getItem("filteredColumns");
  return filteredColumns;
}

function removeBoardFromFilteredColumnsSession(boardId) {
  const filteredColumns = sessionStorage.getItem("filteredColumns");
  if (filteredColumns) {
    const filteredColumnsArr = JSON.parse(filteredColumns);
    const newFilteredColumns = filteredColumnsArr.filter(
      (column) => column.id !== boardId
    );
    sessionStorage.setItem(
      "filteredColumns",
      JSON.stringify(newFilteredColumns)
    );
    return newFilteredColumns;
  }
}

function getFilterContextSession() {
  const filterContext = sessionStorage.getItem("filterContext");
  if (filterContext) {
    return filterContext;
  } else {
    setFilterContextSession(false);
    return "";
  }
}

function getFilterState() {
  const filterState = sessionStorage.getItem("filterState");
  if (filterState) {
    const state = JSON.parse(filterState);
    return state;
  } else {
    setFilterStateSession(false);
    return false;
  }
}

async function addLableToBoard(boardId, newLable) {
  const board = await getById(boardId);
  if (board) {
    board.labels.push(newLable);
    const newGroups = board.groups.map((group) => ({
      ...group,
      tasks: group.tasks.map((task) => ({
        ...task,
        cells: [...task.cells, getDefultCell(newLable, task.id)],
      })),
    }));
    board.groups = newGroups;
    save(board);
    return board;
  } else throw new Error("Board not found");
}

function getDefultCell(label, taskId) {
  switch (label.type) {
    case "priority":
      return {
        taskId,
        labelId: label.id,
        value: { text: "", color: "#C4C4C4" },
        type: label.type,
      };

    case "status":
      return {
        taskId,
        labelId: label.id,
        value: { text: "", color: "#C4C4C4" },
        type: label.type,
      };

    case "members":
      return { taskId, labelId: label.id, value: [], type: label.type };

    case "date": {
      const today = new Date();
      const formattedDate = utilService.formatDateToStr(today);

      return {
        taskId,
        labelId: label.id,
        value: formattedDate,
        type: label.type,
      };
    }

    default:
      return null;
  }
}
