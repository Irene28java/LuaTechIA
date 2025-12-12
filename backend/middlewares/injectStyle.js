//BACKEND/MIDDELEWARES/INJECTSTULE.JS

export function injectStyle(req, res, next) {
  const userStyle = req.body.style;

  // Si el padre/colegio no envía style, usa "mixta"
  req.body.style = userStyle || "mixta";

  next();
}
