import { httpService } from '../http.service'

export const boardService = {
    getBoards,
    getById,
    add,
    update,
    remove,
}

async function getBoards() {
    return await httpService.get(`board`)
}

async function getById(boardId) {
	return await httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
	return await httpService.delete(`board/${boardId}`)
}

async function add(boardName) {
    return await httpService.post('board', boardName)
}

async function update(board) {
    return await httpService.put(`board/${board._id}`, board)
}