//BACKEND/MIDDLEWARES/PLAN.JS

export function requirePremium(req, res, next) {
  if (req.user.subscription_plan !== "premium") {
    return res.status(403).json({
      error: "Necesitas un plan premium para usar esta función."
    });
  }
  next();
}
