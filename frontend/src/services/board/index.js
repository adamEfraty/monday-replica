import { boardService as RmoteService } from "./board.service.js"
import { boardService as localService } from "./board.service.local.js"

// const { VITE_LOCAL } = import.meta.env 
// export const boardService = VITE_LOCAL === 'true' ? localService : RmoteService 

const local = false
export const boardService = local ? localService : RmoteService 

