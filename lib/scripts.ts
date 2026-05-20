import { getIndustryRules } from "./industry-rules";
import type { CompanyProfile } from "./types";

export function getScriptsForCompany(company: CompanyProfile): string[] {
  return getIndustryRules(company.industry).recommendedScripts;
}
