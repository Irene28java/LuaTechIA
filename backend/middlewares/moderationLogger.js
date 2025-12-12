export function moderationLogger(req, res, next) {
  const msg = req.body.message;
  console.log(`[LOG] Usuario ${req.user?.id}: ${msg}`);
  next();
}
 
