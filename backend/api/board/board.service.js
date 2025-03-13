import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'

export const boardService = {
  query,
  getById,
  add,
  remove,
  update,
}

async function query() {
  try {
    const collection = await dbService.getCollection('board')
    const boards = await collection.find().toArray()
    return boards
  } catch (err) {
    loggerService.error('cannot find boards', err)
    throw err
  }
}

async function getById(boardId) {
  try {
    const criteria = { _id: ObjectId.createFromHexString(boardId) }
    const collection = await dbService.getCollection('board')
    const board = await collection.findOne(criteria)
    return board
  } catch (err) {
    loggerService.error(`while finding board by id: ${boardId}`, err)
    throw err
  }
}

async function add(board, loggedinUser) {
  if (!loggedinUser) throw new Error('Unauthorized')

  try {
    const collection = await dbService.getCollection('board')
    await collection.insertOne(board)
    return board
  } catch (err) {
    loggerService.error('cannot add board', err)
    throw err
  }
}

async function remove(boardId, loggedinUser) {
  if (!loggedinUser) throw new Error('Unauthorized')
  try {
    const collection = await dbService.getCollection('board')
    const criteria = { _id: ObjectId.createFromHexString(boardId) }
    await collection.deleteOne(criteria)
  } catch (err) {
    loggerService.error(`cannot remove board ${boardId}`, err)
    throw err
  }
}

async function update(board, loggedinUser) {
  if (!loggedinUser) throw new Error('Unauthorized')

  try {
    const collection = await dbService.getCollection('board')
    const boardToSave = {
      ...board,
      _id: ObjectId.createFromHexString(board._id),
    }

    // with update it knows to replace inly the given params
    await collection.updateOne({ _id: boardToSave._id }, { $set: boardToSave })
    return boardToSave
  } catch (err) {
    loggerService.error(`cannot update board ${board._id}`, err)
    throw err
  }
}
