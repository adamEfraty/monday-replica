import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'

import { boardRoutes } from './api/board/board.routs.js'
import { userRoutes } from './api/user/user.routs.js'
import { authRoutes } from './api/auth/auth.routs.js'

const app = express()

//* App Configuration
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  credentials: true,
}

app.use(cors(corsOptions))

//* Routes
app.use('/api/board', boardRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

// Open Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  loggerService.info('Up and running on ' + `http://localhost:${PORT}`)
})
