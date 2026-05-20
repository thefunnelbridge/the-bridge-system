import { getIndustryRules } from "./industry-rules";
import type { CompanyProfile } from "./types";

export function getPaulaEngineDecisions(company: CompanyProfile): string[] {
  if (company.industry === "Corredores de propiedades / Brokerage inmobiliario") {
    return [
      "Ningún lead comprador puede quedar sin próxima acción.",
      "Todo propietario tasado debe tener seguimiento en 24 horas.",
      "Cada visita debe generar una conversación posterior documentada.",
      "Toda propiedad sin movimiento en 14 días debe entrar a revisión.",
      "Cada líder de oficina debe revisar semanalmente leads dormidos, visitas y ofertas.",
    ];
  }

  return [
    "Definir la fuga principal de esta semana.",
    "Asignar un dueño operativo antes del viernes.",
    "Instalar una métrica de seguimiento visible.",
    "Entrenar al equipo con un caso real.",
    "Automatizar solo después de ordenar el proceso.",
  ];
}

export function getPaulaEngineScripts(company: CompanyProfile): string[] {
  return getIndustryRules(company.industry).recommendedScripts.slice(0, 3);
}
