//backend>services>ageAdapter.js

export function adaptByAge(age, text) {
  if (age < 6) return `Explícalo como para infantil:\n${text}`;
  if (age <= 9) return `Explícalo para primaria (6-9 años):\n${text}`;
  return `Explícalo para primaria avanzada (10-13 años):\n${text}`;
}
