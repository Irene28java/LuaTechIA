//BACKEND/MIDDLEWARES//AGELIMITER.JS

const forbiddenByAge = {
  5: ["muerte", "sangre", "violencia"],
  6: ["violencia", "odio"],
  7: ["odio"],
  8: [],
  9: [],
  10: [],
  11: [],
  12: []
};

export function ageLimiter(req, res, next) {
  const age = Number(req.body.age || 10);
  const msg = (req.body.message || "").toLowerCase();

  const forbidden = forbiddenByAge[age] || [];

  if (forbidden.some(w => msg.includes(w))) {
    return res.status(400).json({
      error: "Ese tema no es apto para tu edad."
    });
  }

  next();
}
 
