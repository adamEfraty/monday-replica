import { storageService } from '../async-storage.service.js'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY_USER_DB = 'user'

export const userService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  saveLocalUser,
  getUsers,
  getById,
  remove,
  update,
  spendBalance,
  getEmptyUser,
}

window.userService = userService

function getUsers() {
  return storageService.query(STORAGE_KEY_USER_DB)
}

async function getById(userId) {
  const user = await storageService.get(STORAGE_KEY_USER_DB, userId)
  return user
}

function remove(userId) {
  return storageService.remove(STORAGE_KEY_USER_DB, userId)
}

async function update(userToUpdate) {
  const user = await getById(userToUpdate._id)
  const updatedUser = await storageService.put(STORAGE_KEY_USER_DB, {
    ...user,
    ...userToUpdate,
  })
  if (getLoggedinUser()._id === updatedUser._id) saveLocalUser(updatedUser)
  return updatedUser
}

async function login(userCred) {
  const users = await storageService.query(STORAGE_KEY_USER_DB)
  const user = users.find((user) => user.email === userCred.email)
  if (user) {
    if (user.password === userCred.password) {
      return saveLocalUser(user)
    } else {
      throw new Error('Invalid password')
    }
  } else {
    throw new Error('User not found')
  }
}

async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
  const user = await storageService.post('user', userCred)
  return saveLocalUser(user)
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getEmptyUser() {
  return {
    username: '',
    fullname: '',
    password: '',
    imgUrl: '',
  }
}

async function spendBalance(amount) {
  const user = getLoggedinUser()
  if (!user) throw new Error('Not loggedin')
  user.balance = user.balance - amount
  return await update(user)
}

function saveLocalUser(user) {
  user = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    imgUrl: user.imgUrl,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}
