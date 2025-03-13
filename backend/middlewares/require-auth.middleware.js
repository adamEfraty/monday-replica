import { authService } from '../api/auth/auth.service.js'

export function requireAuth(req, res, next) {
  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Login first!')
  req.loggedinUser = loggedinUser
  next()
}
