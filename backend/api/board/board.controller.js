import { loggerService } from "../../services/logger.service.js"
import { boardService } from "./board.service.js"


export async function getBoards(req, res) {
    try {
        const boards = await boardService.query()
        res.send(boards)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't get boards`)
    }
}

export async function getBoard(req, res) {
    const { boardId } = req.params

    try {
        const board = await boardService.getById(boardId)
        res.send(board)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't get board`)
    }
}

export async function addBoard(req, res) {
    const { title, labels, groups } = req.body
    const boardToSave = { title, labels, groups }

    try {
        const savedBoard = await boardService.add(boardToSave)
    	res.send(savedBoard)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't save board`)
    }
}

export async function removeBoard(req, res) {
    const { boardId } = req.params
    try {
        await boardService.remove(boardId)
        res.send('Board Deleted')
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't remove board`)
    }
}

export async function updateBoard(req, res) {
    const {_id, title, labels, groups } = req.body
    const boardToSave = {_id, title, labels, groups}

    try {
        const updatedBoard = await boardService.update(boardToSave)
    	res.send(updatedBoard)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't update board`)
    }
}