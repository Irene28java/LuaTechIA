// checkCase.js
const { execSync } = require("child_process");

const searchFile = process.argv[2];
if (!searchFile) {
  console.error("Uso: node checkCase.js <filename>");
  process.exit(1);
}

try {
  const result = execSync("git ls-files", { encoding: "utf-8" });
  const files = result.split("\n");
  const matches = files.filter(f => f.toLowerCase() === searchFile.toLowerCase());
  
  if (matches.length === 0) {
    console.log(`No se encontró ningún archivo llamado '${searchFile}'`);
  } else {
    console.log("Coincidencias encontradas:");
    matches.forEach(f => console.log(f));
  }
} catch (err) {
  console.error("Error ejecutando git:", err.message);
  process.exit(1);
}
