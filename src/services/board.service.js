import { storageService } from "./async-storage.service.js";

const imageLinks = [
  "https://images.pexels.com/photos/30061809/pexels-photo-30061809/free-photo-of-fashionable-woman-posing-with-colorful-headscarf.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/30007901/pexels-photo-30007901/free-photo-of-thoughtful-man-in-grey-coat-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/28773362/pexels-photo-28773362/free-photo-of-dynamic-black-and-white-portrait-of-young-man-on-phone.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/30071289/pexels-photo-30071289/free-photo-of-portrait-of-a-bearded-man-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
];

const STORAGE_KEY = "boards";

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
  updateTaskInGroup,
  updateGroupInBoard,
  addBoard,
};

async function addBoard() {
  try {
    const newBoard = {
      title: "New Board",
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
  if (boardToSave._id) {
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

async function addItemToGroup(boardId, groupId, newItem) {
  const board = await getById(boardId);
  if (!board) throw new Error("Board not found");

  const groupIndex = board.groups.findIndex((group) => group.id === groupId);
  if (groupIndex === -1) throw new Error("Group not found");

  board.groups[groupIndex].tasks.push(newItem);
  await save(board);
}

async function removeGroupFromBoard(boardId, groupId) {
  const board = await getById(boardId);
  if (!board) throw new Error("Board not found");

  board.groups = board.groups.filter((group) => group.id !== groupId);
  await save(board);
}

async function removeTaskFromGroup(boardId, groupId, taskId) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");

    const group = board.groups.find((group) => group.id === groupId);
    if (!group) throw new Error("Group not found");

    group.tasks = group.tasks.filter((task) => task.id !== taskId);

    await save(board);

    console.log("Task removed from group and local storage");
  } catch (error) {
    console.error("Error removing task:", error);
    throw error;
  }
}

async function updateTaskInGroup(boardId, groupId, taskId, updatedTask) {
  try {
    const board = await getById(boardId); // Call directly without 'this'
    const group = board.groups.find((group) => group.id === groupId);
    if (!group) throw new Error("Group not found");

    const taskIndex = group.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    group.tasks[taskIndex] = { ...group.tasks[taskIndex], ...updatedTask };

    await save(board);

    return group.tasks[taskIndex];
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

async function makeFirstBoard() {
  const imageLinks = [
    "https://images.pexels.com/photos/30061809/pexels-photo-30061809/free-photo-of-fashionable-woman-posing-with-colorful-headscarf.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/30007901/pexels-photo-30007901/free-photo-of-thoughtful-man-in-grey-coat-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/28773362/pexels-photo-28773362/free-photo-of-dynamic-black-and-white-portrait-of-young-man-on-phone.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/30071289/pexels-photo-30071289/free-photo-of-portrait-of-a-bearded-man-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
];

const usersInBoard = [
  {id: 'userid0', name: "tal", color: "red", image: imageLinks[0]},
  {id: 'userid1', name: "shal", color: "green", image: imageLinks[1] },
  {id: 'userid2', name: "bal", color: "black", image: imageLinks[2] },
  {id: 'userid3', name: "shal", color: "green", image: imageLinks[3]}
]

  const board = {
    title: "SAR default board",
    groups: [
      {
        id: Math.random().toString(36).slice(2),
        title: "SAR",
        color: "red",
        tasks: [
          {
            id: "t101",
            side: "null",
            taskTitle: "learn CSS",
            members: [usersInBoard[1], usersInBoard[2]],
            date: "27-02-2022",
            status: { text: "Working on it", color: "#FDAB3D" },
            priority: { text: "Low", color: "#86B6FB" },
            chat: [
              {
                userId: "userid0",
                sentAt: new Date(),
                text: "comment comment comment...",
                replys: [
                  {
                    userId: "userid1",
                    sentAt: new Date(),
                    text: "reply reply reply...",
                  },
                ],
              },
            ],
          },
          {
            id: "t102",
            side: "null",
            taskTitle: "learn Vue.js",
            members: [usersInBoard[0], usersInBoard[1], usersInBoard[2]],
            date: "28-02-2022",
            status: { text: "Stuck", color: "#DF2F4A" },
            priority: { text: "Medium", color: "#5559DF" },
            chat: [],
          },
          {
            id: "t103",
            side: "null",
            taskTitle: "learn JavaScript",
            members: [usersInBoard[1], usersInBoard[2], usersInBoard[3]],
            date: "01-03-2022",
            status: { text: "Done", color: "#00C875" },
            priority: { text: "Medium", color: "#5559DF" },
            chat: [],
          },
        ],
      },
      {
        id: Math.random().toString(36).slice(2),
        title: "SAR-2",

        color: "blue",
        tasks: [
          {
            id: "t201",
            side: "null",
            taskTitle: "write API documentation",
            members: [
              usersInBoard[0],
              usersInBoard[1],
              usersInBoard[2],
              usersInBoard[3],
            ],
            date: "03-03-2022",
            status: { text: "Working on it", color: "#FDAB3D" },
            priority: { text: "Critical ⚠️", color: "#333333" },
            chat: [],
          },
          {
            id: "t202",
            side: "null",
            taskTitle: "debug front-end code",
            members: [usersInBoard[2], usersInBoard[3]],
            date: "05-03-2022",
            status: { text: "Stuck", color: "#DF2F4A" },
            priority: { text: "Low", color: "#86B6FB" },
            chat: [],
          },
          {
            id: "t203",
            side: "null",
            taskTitle: "deploy application",
            members: [usersInBoard[1], usersInBoard[3]],
            date: "06-03-2022",
            status: { text: "Done", color: "#00C875" },
            priority: { text: "High", color: "#401694" },
            chat: [],
          },
        ],
      },
      {
        id: Math.random().toString(36).slice(2),
        title: "SAR-3",

        color: "green",
        tasks: [
          {
            id: "t301",
            side: "null",
            taskTitle: "set up database schema",
            members: [usersInBoard[0], usersInBoard[3]],
            date: "07-03-2022",
            status: { text: "Not Started", color: "#C4C4C4" },
            priority: { text: "High", color: "#401694" },
            chat: [],
          },
          {
            id: "t302",
            side: "null",
            taskTitle: "optimize queries",
            members: [usersInBoard[0], usersInBoard[1]],
            date: "08-03-2022",
            status: { text: "Working on it", color: "#FDAB3D" },
            priority: { text: "Low", color: "#86B6FB" },
            chat: [],
          },
        ],
      },
    ],
  };

  const boardsFromStorage = await storageService.query(STORAGE_KEY);
  if (!boardsFromStorage || boardsFromStorage.length < 2) {
    await storageService.post(STORAGE_KEY, board);
    console.log("First board created successfully");
  }
}
