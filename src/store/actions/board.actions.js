import { boardService } from '../../services/board.service.js'

import { REMOVE_USER, SET_USER, SET_USERS } from '../reducer/user.reducer.js'

import { store } from '../store.js'

export async function loadBoards() {
  try {
    const users = await boardService.getBoards()
    store.dispatch({ type: SET_USERS, users })
  } catch (err) {
    console.log('UserActions: err in loadUsers', err)
  }
}

export async function removeBoard(userId) {
  try {
    await userService.remove(userId)
    store.dispatch({ type: REMOVE_USER, userId })
  } catch (err) {
    console.log('UserActions: err in removeUser', err)
  }
}

export async function updateBoard(user) {
  try {
    await userService.update(user)
    store.dispatch({
      type: SET_USER,
      user,
    })
  } catch (err) {
    console.log('could not update user', err)
  }
}