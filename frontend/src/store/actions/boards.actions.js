import { boardService } from '../../services/board'
import { utilService } from '../../services/util.service'
import { store } from '../store'

import {
  EDIT_BOARD,
  REMOVE_BOARD,
  SET_BOARDS,
  OPEN_MODALS,
  SET_FILTER_BY,
  SET_FILTERED_COLUMNS,
  SET_FAVORITES,
} from '../reducer/boards.reducer'

export async function addBoard(boardName) {
  try {
    console.log(boardName, ' from action front')
    const savedBoard = await boardService.addBoard(boardName)
    await setFilteredColumns({ id: savedBoard._id, labels: savedBoard.labels })

    const boards = await boardService.query()

    await store.dispatch({
      type: SET_BOARDS,
      boards,
    })

    return savedBoard
  } catch (error) {
    console.error('Error adding board:', error)
    throw error
  }
}

export async function loadBoards() {
  const boards = await boardService.query()
  const filteredColumns = await boardService.getFilteredColumnsSession()
  !filteredColumns &&
    boardService.setFilteredColumnsSession(
      boards.map((board) => ({ id: board._id, labels: board.labels }))
    )
  // const favorites = await setFavories(); //fix it later
  await store.dispatch({ type: SET_BOARDS, boards })
  await store.dispatch({
    type: SET_FILTERED_COLUMNS,
    newFilteredColumns: filteredColumns
      ? JSON.parse(filteredColumns)
      : boards.map((board) => ({
          id: board._id,
          labels: board.labels,
        })),
  })
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
}

export async function addItem(
  boardId,
  groupId,
  taskTitle,
  isStart = null,
  userId
) {
  const board = await boardService.getById(boardId)
  const labels = [...board.labels]
  const taskId = utilService.makeId()

  // cell: {taskId:xxx, labelId: xxx, value: xxx, type: xxx}
  const newItem = {
    id: taskId,
    cells: labels.map((label) =>
      label.type === 'taskTitle'
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
                  activity: { field: 'taskTitle', type: 'created', groupId },
                },
              ],
            },
            type: label.type,
          }
        : boardService.getDefultCell(label, taskId)
    ),
  }
  await boardService.addItemToGroup(boardId, groupId, newItem, isStart)
  const updatedBoard = await boardService.getById(boardId)

  if (!updatedBoard) return

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })
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
}

export async function updateGroup(boardId, groupId, updatedGroupData) {
  await boardService.updateGroupInBoard(boardId, groupId, updatedGroupData)

  const board = await boardService.getById(boardId)
  if (!board) throw new Error('Board not found')

  const updatedBoard = {
    ...board,
    groups: board.groups.map((group) =>
      group.id === groupId ? { ...group, ...updatedGroupData } : group
    ),
  }

  console.log('updated: ', updatedBoard)

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })
}

export async function removeTasks(boardId, tasksArr) {
  const board = await boardService.removeTasksFromGroup(boardId, tasksArr)
  if (!board) return

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
  }

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })
}
export async function removeTask(boardId, groupId, taskId) {
  // Use the boardService to remove the task from the group in localStorage
  const board = await boardService.removeTaskFromGroup(boardId, groupId, taskId)
  if (!board) throw new Error('Board not found')

  // Now, we need to create the updated board structure with the modified groups
  const updatedBoard = {
    ...board,
    groups: board.groups.map((group) => {
      if (group.id === groupId) {
        // Filter out the task from the group's tasks
        return {
          ...group,
          tasks: group.tasks.filter((task) => task.id !== taskId),
        }
      }
      return group
    }),
  }

  // Save the updated board
  await boardService.save(updatedBoard)

  // Dispatch the updated board to Redux store
  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })

  // Show success message
}

export async function removeBoard(boardId) {
  try {
    await boardService.remove(boardId)
    await boardService.removeBoardFromFilteredColumnsSession(boardId)
    store.dispatch({ type: REMOVE_BOARD, boardId })
  } catch (err) {
    console.error('Failed to remove board:', err)
  }
}

export async function updateTask(boardId, userId, newCell) {
  console.log('It is me you looking for ', boardId, userId, newCell)
  await boardService.updateTaskInGroup(boardId, userId, newCell)

  const board = await boardService.getById(boardId)
  const cellGroup = board.groups.find((group) =>
    group.tasks.some((task) => task.id === newCell.taskId)
  )
  if (!cellGroup) return

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
  }

  console.log(updatedBoard)

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })
}

export async function updateBoardName(boardId, newName) {
  try {
    const updatedBoard = await boardService.updateBoardName(boardId, newName)

    store.dispatch({ type: EDIT_BOARD, boardId, updatedBoard })
  } catch (error) {
    console.error('error dispatching board name update:', error)
  }
}

export async function updateBoardFavorite(boardId) {
  try {
    const updatedBoard = await boardService.updateBoardFavorite(boardId)

    store.dispatch({ type: EDIT_BOARD, boardId, updatedBoard })

    return updatedBoard
  } catch (error) {
    console.error('error dispatching board name update:', error)
  }
}

export function openModal(modalId) {
  const currentModals = store.getState().boardModule.openModals
  let newModals = currentModals.includes(modalId)
    ? currentModals
    : [...currentModals, modalId]

  // if the modal you open is chat, close every other chat modal
  newModals = boardService.replaceChats(newModals, modalId)

  store.dispatch({ type: OPEN_MODALS, newModals })
}

export function closeModal(modalId) {
  const currentModals = store.getState().boardModule.openModals
  let newModals = [...currentModals]
  const modalIndex = newModals.findIndex((id) => id === modalId)

  if (modalIndex !== -1) newModals.splice(modalIndex, 1)

  store.dispatch({ type: OPEN_MODALS, newModals })
}

export function handleFilter(filterBy) {
  boardService.setFilterContextSession(filterBy)
  store.dispatch({ type: SET_FILTER_BY, filterBy })
}

export function getFilterContext() {
  const filterBy = boardService.getFilterContextSession()
  store.dispatch({ type: SET_FILTER_BY, filterBy })
  return filterBy
}

export async function addLable(boardId, labelInfo) {
  const newLabel = {
    id: utilService.makeIdForLabel(),
    type: labelInfo.type,
    name: labelInfo.name,
    width: 150,
  }
  const newBoard = await boardService.addLableToBoard(boardId, newLabel)
  if (!newBoard) return
  await setFilteredColumns(newLabel)

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  })
}

export async function deleteLable(boardId, labelId) {
  const newBoard = await boardService.deleteLableFromBoard(boardId, labelId)
  if (!newBoard) return

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  })
}

export async function onChangeLabelName(boardId, labelId, newName) {
  const newBoard = await boardService.changeLabelName(boardId, labelId, newName)
  if (!newBoard) return

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  })
}

export async function replaceGroups(boardId, newGroups) {
  const board = await boardService.getById(boardId)
  if (!board) throw new Error('Board not found')

  const updatedBoard = {
    ...board,
    groups: newGroups,
  }

  await boardService.updateBoard(boardId, updatedBoard)

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })
}

export async function replaceLabels(boardId, newLabels) {
  const board = await boardService.getById(boardId)
  if (!board) throw new Error('Board not found')

  const updatedBoard = {
    ...board,
    labels: newLabels,
  }

  await boardService.updateBoard(boardId, updatedBoard)

  await store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard,
  })
}

export async function setFilteredColumns(filteredColumns) {
  const newFilteredColumns = await boardService.setFilteredColumnsSession(
    filteredColumns
  )
  console.log(newFilteredColumns)
  store.dispatch({ type: SET_FILTERED_COLUMNS, newFilteredColumns })
}

// export async function setFavories(favorite = []) {
//   const serviceFavorites = await boardService.setFavorites(favorite)
//   store.dispatch({ type: SET_FAVORITES, favorites: serviceFavorites })
//   return await serviceFavorites
// }

export function onUpdateReduxLabelWidth(board, boardId, labelId, newWidth) {
  const newLabels = board.labels.map((label) =>
    label.id === labelId ? { ...label, width: newWidth } : label
  )
  const newBoard = { ...board, labels: newLabels }

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  })
}

export async function onUpdateLocalLabelWidth(boardId, labelId, newWidth) {
  const newBoard = await boardService.changeLabelWidth(
    boardId,
    labelId,
    newWidth
  )

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  })
}

export async function duplicateTasks(boardId, tasksToDuplicate) {
  const newBoard = await boardService.addMultipleItemsToGroup(
    boardId,
    tasksToDuplicate
  )

  store.dispatch({
    type: EDIT_BOARD,
    boardId,
    updatedBoard: newBoard,
  })
}
