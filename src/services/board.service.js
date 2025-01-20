import { updateTask } from "../store/actions/boards.actions.js";
import { storageService } from "./async-storage.service.js";

const imageLinks = [
  "https://images.pexels.com/photos/30061809/pexels-photo-30061809/free-photo-of-fashionable-woman-posing-with-colorful-headscarf.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/30007901/pexels-photo-30007901/free-photo-of-thoughtful-man-in-grey-coat-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/28773362/pexels-photo-28773362/free-photo-of-dynamic-black-and-white-portrait-of-young-man-on-phone.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/30071289/pexels-photo-30071289/free-photo-of-portrait-of-a-bearded-man-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
];

const STORAGE_KEY = 'boards'
const CHAT_KEY = 'chat'

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
  saveTempChatInfo,
  getChatTempInfo,
  getDefaultFilter,
}

async function addBoard() {
  try {
    const newBoard = {
      title: 'New Board',
      groups: [],
    }

    const savedBoard = await storageService.post(STORAGE_KEY, newBoard)

    return savedBoard
  } catch (error) {
    console.error('Error adding board:', error)
    throw error
  }
}

async function query() {
  try {
    let boards = await storageService.query(STORAGE_KEY)
    console.log(boards)
    if (!boards || boards.length === 0) {
      await makeFirstBoard()
      boards = await storageService.query(STORAGE_KEY)
    }
    return boards
  } catch (error) {
    console.log('Error:', error)
    throw error
  }
}

function getById(id) {
  return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
  return storageService.remove(STORAGE_KEY, id)
}

async function save(boardToSave) {
  console.log("this is the board to save: ", boardToSave);
  if (boardToSave.id) {
    return storageService.put(STORAGE_KEY, boardToSave)
  } else {
    return storageService.post(STORAGE_KEY, boardToSave)
  }
}

async function addGroupToBoard(boardId, newGroup) {
  const board = await getById(boardId)
  if (!board) throw new Error('Board not found')

  newGroup.id = `group${Date.now()}`
  const updatedGroups = [...(board.groups || []), { ...newGroup }]

  const updatedBoard = {
    ...board,
    groups: updatedGroups,
  }

  await save(updatedBoard)
  return newGroup
}

async function addItemToGroup(boardId, groupId, newItem) {
  const board = await getById(boardId)
  if (!board) throw new Error('Board not found')

  const groupIndex = board.groups.findIndex((group) => group.id === groupId)
  if (groupIndex === -1) throw new Error('Group not found')

  board.groups[groupIndex].tasks.push(newItem)
  await save(board)
}

async function removeGroupFromBoard(boardId, groupId) {
  const board = await getById(boardId)
  if (!board) throw new Error('Board not found')

  board.groups = board.groups.filter((group) => group.id !== groupId)
  await save(board)
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

function getDefaultFilter(){
  return {
    tasTitle: "",
    priority: "",
    status: "",
    members: "",
  }
}

async function removeTaskFromGroup(boardId, groupId, taskId) {
  try {
    const board = await getById(boardId);
    if (!board) throw new Error("Board not found");
    console.log("this is the board: ", board);

    const group = board.groups.find((group) => group.id === groupId)
    if (!group) throw new Error('Group not found')

    group.tasks = group.tasks.filter((task) => task.id !== taskId)

    console.log('Task removed from group and local storage')
    return await save(board);
  } catch (error) {
    console.error('Error removing task:', error)
    throw error
  }
}

async function updateTaskInGroup(boardId, info) {
  try {
    console.log(info)
    console.log(boardId, info.group.id, info.task.id, info.type, info.value)
    const board = await getById(boardId) // Call directly without 'this'
    const group = board.groups.find((group) => group.id === info.group.id)
    if (!group) throw new Error('Group not found')

    const taskIndex = group.tasks.findIndex((task) => task.id === info.task.id)
    if (taskIndex === -1) throw new Error('Task not found')

    group.tasks[taskIndex][info.type] = info.value
    console.log(info.type)
    await save(board).then(() => {
      console.log(
        group.tasks[taskIndex][info.type],
        taskIndex,
        group,
        info.value
      )
    })

    return group.tasks[taskIndex]
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

async function updateGroupInBoard(boardId, groupId, updatedGroupData) {
  try {
    const board = await getById(boardId)
    if (!board) throw new Error('Board not found')

    const groupIndex = board.groups.findIndex((group) => group.id === groupId)
    if (groupIndex === -1) throw new Error('Group not found')

    board.groups[groupIndex] = {
      ...board.groups[groupIndex],
      ...updatedGroupData,
    }
    await save(board)

    return board.groups[groupIndex]
  } catch (error) {
    console.error('Error updating group:', error)
    throw error
  }
}

async function updateBoardName(boardId, newName) {
  try {
    // Retrieve the board by ID
    const board = await getById(boardId)
    if (!board) throw new Error(`Board with ID ${boardId} not found`)

    // Update the board's name
    board.title = newName

    // Save the updated board back to storage
    const updatedBoard = await save(board)
    return updatedBoard
  } catch (error) {
    console.error('Error updating board name:', error)
    throw error
  }
}

async function makeFirstBoard() {
  const imageLinks = [
    'https://images.pexels.com/photos/30061809/pexels-photo-30061809/free-photo-of-fashionable-woman-posing-with-colorful-headscarf.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/30007901/pexels-photo-30007901/free-photo-of-thoughtful-man-in-grey-coat-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/28773362/pexels-photo-28773362/free-photo-of-dynamic-black-and-white-portrait-of-young-man-on-phone.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/30071289/pexels-photo-30071289/free-photo-of-portrait-of-a-bearded-man-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600',
  ]

  const usersInBoard = [
    { id: 'userid0', fullName: 'tal', color: 'red', imgUrl: imageLinks[0] },
    { id: 'userid1', fullName: 'shal', color: 'green', imgUrl: imageLinks[1] },
    { id: 'userid2', fullName: 'bal', color: 'black', imgUrl: imageLinks[2] },
    { id: 'userid3', fullName: 'shal', color: 'green', imgUrl: imageLinks[3] },
  ]

  const board = {
    title: 'SAR default board',
    members: usersInBoard,
    groups: [
      {
        id: Math.random().toString(36).slice(2),
        title: 'SAR',
        color: 'red',
        tasks: [
          {
            id: 't101',
            side: 'null',
            taskTitle: 'learn CSS',
            members: [usersInBoard[1], usersInBoard[2]],
            date: '27-02-2022',
            status: { text: 'Working on it', color: '#FDAB3D' },
            priority: { text: 'Low', color: '#86B6FB' },
            chat: [],
          },
          {
            id: 't102',
            side: 'null',
            taskTitle: 'learn Vue.js',
            members: [usersInBoard[0], usersInBoard[1], usersInBoard[2]],
            date: '28-02-2022',
            status: { text: 'Stuck', color: '#DF2F4A' },
            priority: { text: 'Medium', color: '#5559DF' },
            chat: [],
          },
          {
            id: 't103',
            side: 'null',
            taskTitle: 'learn JavaScript',
            members: [usersInBoard[1], usersInBoard[2], usersInBoard[3]],
            date: '01-03-2022',
            status: { text: 'Done', color: '#00C875' },
            priority: { text: 'Medium', color: '#5559DF' },
            chat: [],
          },
        ],
      },
      {
        id: Math.random().toString(36).slice(2),
        title: 'SAR-2',

        color: 'blue',
        tasks: [
          {
            id: 't201',
            side: 'null',
            taskTitle: 'write API documentation',
            members: [
              usersInBoard[0],
              usersInBoard[1],
              usersInBoard[2],
              usersInBoard[3],
            ],
            date: '03-03-2022',
            status: { text: 'Working on it', color: '#FDAB3D' },
            priority: { text: 'Critical ⚠️', color: '#333333' },
            chat: [],
          },
          {
            id: 't202',
            side: 'null',
            taskTitle: 'debug front-end code',
            members: [usersInBoard[2], usersInBoard[3]],
            date: '05-03-2022',
            status: { text: 'Stuck', color: '#DF2F4A' },
            priority: { text: 'Low', color: '#86B6FB' },
            chat: [],
          },
          {
            id: 't203',
            side: 'null',
            taskTitle: 'deploy application',
            members: [usersInBoard[1], usersInBoard[3]],
            date: '06-03-2022',
            status: { text: 'Done', color: '#00C875' },
            priority: { text: 'High', color: '#401694' },
            chat: [],
          },
        ],
      },
      {
        id: Math.random().toString(36).slice(2),
        title: 'SAR-3',

        color: 'green',
        tasks: [
          {
            id: 't301',
            side: 'null',
            taskTitle: 'set up database schema',
            members: [usersInBoard[0], usersInBoard[3]],
            date: '07-03-2022',
            status: { text: 'Not Started', color: '#C4C4C4' },
            priority: { text: 'High', color: '#401694' },
            chat: [],
          },
          {
            id: 't302',
            side: 'null',
            taskTitle: 'optimize queries',
            members: [usersInBoard[0], usersInBoard[1]],
            date: '08-03-2022',
            status: { text: 'Working on it', color: '#FDAB3D' },
            priority: { text: 'Low', color: '#86B6FB' },
            chat: [],
          },
        ],
      },
    ],
  }

  const boardsFromStorage = await storageService.query(STORAGE_KEY)
  if (!boardsFromStorage || boardsFromStorage.length < 2) {
    await storageService.post(STORAGE_KEY, board)
    console.log('First board created successfully')
  }
}

function saveTempChatInfo(id, width){
  sessionStorage.setItem(CHAT_KEY, JSON.stringify({id, width}))
}

function getChatTempInfo() {
  const chatInfo = sessionStorage.getItem(CHAT_KEY)
  return chatInfo ? JSON.parse(chatInfo) : null
}




