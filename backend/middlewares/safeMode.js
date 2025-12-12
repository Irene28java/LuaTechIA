//BACKEND/MIDDLEWARES/SAFEMODE.JS

export function safeMode(req, res, next) {
  const role = req.user?.role || "student";
  req.body.safeMode = role !== "teacher"; // safeMode solo para alumnos
  next();
}

