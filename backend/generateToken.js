import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // carga tu .env

const token = jwt.sign(
  { id: 1, name: "Test User" }, 
  process.env.JWT_SECRET, // usa tu JWT_SECRET del .env
  { expiresIn: "1h" }
);

console.log("TOKEN:", token);
