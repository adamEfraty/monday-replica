import { loggerService } from "../services/logger.service.js";

export function log(req, res, next) {
    loggerService.info('Visited route', req.route.path)
    next()
}