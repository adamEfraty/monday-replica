import express from 'express'

const router = express.Router()

import { getUser, getUsers, deleteUser, updateUser } from './user.controller.js'

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export const userRoutes = router
