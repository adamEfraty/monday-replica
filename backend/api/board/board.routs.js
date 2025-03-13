import express from 'express'
import {
  getBoards,
  getBoard,
  addBoard,
  removeBoard,
  updateBoard,
} from './board.controller.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'

const router = express.Router()

router.get('/', getBoards)
router.get('/:boardId', getBoard)
router.post('/', requireAuth, addBoard)
router.put('/:boardId', requireAuth, updateBoard)
router.delete('/:boardId', requireAuth, removeBoard)

export const boardRoutes = router
