import { boardService } from '../../services/board.service'
import { showSuccessMsg } from '../../services/event-bus.service'
import { utilService } from '../../services/util.service'
import { store } from '../store'

import { EDIT_BOARD, SET_BOARDS } from '../reducer/boards.reducer'

export async function addBoard() {
  try {
    const savedBoard = await boardService.addBoard()

    const boards = await boardService.query()

    await store.dispatch({
      type: SET_BOARDS,
      boards,
    })

    showSuccessMsg('Board added successfully')

    return savedBoard
  } catch (error) {
    console.error('Error adding board:', error)
    throw error
  }
}

export async function loadBoards() {
  const boards = await boardService.query()
  await store.dispatch({ type: SET_BOARDS, boards })
  showSuccessMsg('Boards loaded')
}

export async function addGroup(boardId) {
  const newGroup = {
    id: utilService.makeId(),
    title: 'New Group',
    color: utilService.getRandomColor(),
    tasks: [],
  }

  await boardService.addGroupToBoard(boardId, newGroup)

  const board = await boardService.getById(boardId)
  if (!board) return

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: board,
  })

  showSuccessMsg('Group added successfully')
}

export async function addItem(boardId, groupId, itemTitle) {
  const today = new Date()
  const formattedDate = utilService.formatDateToStr(today)

  const newItem = {
    id: utilService.makeId(),
    taskTitle: itemTitle,
    members: [],
    date: formattedDate, // Updated to show the formatted date
    status: 'IN PROGRESS',
    priority: 'LOW',
  }
  await boardService.addItemToGroup(boardId, groupId, newItem)

  const board = await boardService.getById(boardId)
  if (!board) return

  const updatedBoard = {
    ...board,
    groups: board.groups.map((group) =>
      group.id === groupId ? { ...group, tasks: [...group.tasks] } : group
    ),
  }

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })

  showSuccessMsg('Item added successfully')
}

export async function removeGroup(boardId, groupId) {
  await boardService.removeGroupFromBoard(boardId, groupId)

  const board = await boardService.getById(boardId)
  if (!board) throw new Error('Board not found')

  const updatedBoard = {
    ...board,
    groups: board.groups.filter((group) => group.id !== groupId),
  }

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })

  showSuccessMsg('Group removed successfully')
}

export async function updateGroup(boardId, groupId, updatedGroupData) {
  // Update the group in the board service
  await boardService.updateGroupInBoard(boardId, groupId, updatedGroupData)

  const board = await boardService.getById(boardId)
  if (!board) throw new Error('Board not found')

  const updatedBoard = {
    ...board,
    groups: board.groups.map((group) =>
      group.id === groupId ? { ...group, ...updatedGroupData } : group
    ),
  }

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })

  showSuccessMsg('Group updated successfully')
}

export async function removeTask(boardId, groupId, taskId) {
  console.log('been here', groupId, taskId)
  await boardService.removeTaskFromGroup(boardId, groupId, taskId)

  const board = await boardService.getById(boardId)
  if (!board) return

  const updatedBoard = {
    ...board,
    groups: board.groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            tasks: group.tasks.filter((task) => task.id !== taskId),
          }
        : group
    ),
  }

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })

  showSuccessMsg('Task removed successfully')
}

export async function updateTask(boardId, info) {
  await boardService.updateTaskInGroup(boardId, info)

  const board = await boardService.getById(boardId)
  if (!board) return

  console.log('hi im here')

  const updatedBoard = {
    ...board,
    groups: board.groups.map((group) =>
      group.id === info.group.id
        ? {
            ...group,
            tasks: group.tasks.map((task) =>
              task.id === info.task.id ? { ...task, ...info.value } : task
            ),
          }
        : group
    ),
  }

  console.log(updatedBoard)

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })

  showSuccessMsg('Task updated successfully')
}
