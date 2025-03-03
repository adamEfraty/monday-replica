import { boardService as RmoteService } from "./board.service.js"
import { boardService as localService } from "./board.service.local.js"

// const { VITE_LOCAL } = import.meta.env 
// export const bugService = VITE_LOCAL === 'true' ? localService : RmoteService 

const local = true
export const boardService = local ? localService : RmoteService 

