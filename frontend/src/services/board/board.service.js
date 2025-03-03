import { httpService } from '../http.service'

export const boardService = {
    query,
    getById,
    save,
    remove,
}

//add so when there is no boards there should be added one
async function query() {
    return await httpService.get(`board`)
}

async function getById(boardId) {
	return await httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
	return await httpService.delete(`board/${boardId}`)
}

async function save(board) {
  console.log('this is the board to save: ', board)
  if (board.id) {
    return await httpService.post('board', board)
  } else {
    return await httpService.put(`board/${board._id}`, board)
  }
}