import express from 'express'
import { getBoards, getBoard, addBoard, removeBoard, updateBoard } from './board.controller.js'


const router = express.Router()

router.get('/', getBoards)
router.get('/:boardId', getBoard)
router.post('/', addBoard)
router.put('/:boardId', updateBoard)
router.delete('/:boardId', removeBoard)

export const boardRoutes = router