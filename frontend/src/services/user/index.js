import { userService as localService } from './user.service.local'
import { userService as RmoteService } from './user.service.remote'

// take this function outa here
export function getEmptyUser() {
  return {
    email: '',
    password: '',
    fullName: '',
    isAdmin: false,
    imgUrl: '',
  }
}

// const { VITE_LOCAL } = import.meta.env 
// export const userService = VITE_LOCAL === 'true' ? localService : RmoteService 

const local = true
export const userService = local ? localService : RmoteService 
