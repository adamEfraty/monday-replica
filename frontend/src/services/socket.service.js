import { io } from 'socket.io-client'
import { loadBoards } from '../store/actions/boards.actions.js'
import { loadUsers } from '../store/actions/user.actions.js'

// const SOCKET_URL = 'https://someday-n1ze.onrender.com/' // Replace with your backend URL if different

const SOCKET_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://someday-n1ze.onrender.com'
    : 'http://localhost:3000'

export const socket = io(SOCKET_URL, {
  withCredentials: true,
})

console.log('Connecting to Socket.IO server...', socket.id)

socket.on('connect', () => {
  console.log('Connected to Socket.IO server:', socket.id)
})

socket.on('api response', (response) => {
  console.error('API response received:', response)
  loadBoardsAndUsers()
})

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server')
})

export function loadBoardsAndUsers() {
  loadBoards()
  loadUsers()
}
