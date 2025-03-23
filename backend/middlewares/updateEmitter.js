import { io } from "../server.js";

export function updateEmitter(req, res, next) {
  const originalSend = res.send;

  res.send = function (body) {
    const allowedRoutes = [
      { route: "/api/board", methods: ["POST", "PUT", "DELETE"] },
      { route: "/api/user", methods: ["POST", "PUT", "DELETE"] },
      { route: "/api/auth", methods: ["POST", "PUT", "DELETE"] },
    ];

    const isAllowedRoute = allowedRoutes.some(
      ({ route, methods }) =>
        req.originalUrl.startsWith(route) && methods.includes(req.method)
    );

    if (isAllowedRoute) {
      io.emit("api response", {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        response: body,
      });
    }

    return originalSend.call(this, body);
  };

  next();
}
