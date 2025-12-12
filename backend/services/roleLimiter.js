//backend>services>roleLimiter.js
export function filterButtonsByRole(role) {
  if (role === "padre") {
    return [
      "tareas", "resumenes", "mapas-mentales",
      "fichas", "esquemas", "pizarra"
    ];
  }

  return [
    "examenes","tareas","mapas-mentales","tarjetas",
    "resumenes","esquemas","eval-trimestral","corregir",
    "rubricas","adaptar-textos","explicar","pizarra",
    "fichas","cuestionarios"
  ];
}
