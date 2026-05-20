"use client";

import { demoCompanies, demoCompany, demoDataRooms, demoResponsesByCompany, demoTrackerTasks } from "./demo-data";
import { getDemoInboxConversations, type BridgeInboxConversation } from "./inbox";
import { areaIds } from "./scan-questions";
import type { CompanyProfile, DataRoom, ScanResponses, TrackerTask } from "./types";

const keys = {
  selectedCompanyId: "bridge-system.selectedCompanyId",
  company: "bridge-system.company",
  responses: "bridge-system.responses",
  tasks: "bridge-system.tasks",
  dataRoom: "bridge-system.dataRoom",
  inbox: "bridge-system.inbox",
  liveGoals: "bridge-system.liveGoals",
  workerLesson: "bridge-system.worker.lessonDone",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("bridge-system:storage"));
}

export function getSelectedCompanyId(): string {
  return read(keys.selectedCompanyId, demoCompany.id);
}

export function setSelectedCompanyId(companyId: string) {
  const company = demoCompanies.find((item) => item.id === companyId) ?? demoCompany;
  write(keys.selectedCompanyId, company.id);
  write(keys.company, company);
  write(keys.responses, demoResponsesByCompany[company.id]);
  write(keys.dataRoom, demoDataRooms[company.id]);
  write(keys.inbox, getDemoInboxConversations(company));
}

export function getCompanyProfile(): CompanyProfile {
  const selected = getSelectedCompanyId();
  const fallback = demoCompanies.find((company) => company.id === selected) ?? demoCompany;
  const stored = read(keys.company, fallback) as CompanyProfile;
  if (!stored.id || !stored.metrics || !stored.city || !stored.team) {
    write(keys.company, fallback);
    return fallback;
  }
  return stored;
}

export function saveCompanyProfile(profile: CompanyProfile) {
  write(keys.company, profile);
}

export function getScanResponses(): ScanResponses {
  const company = getCompanyProfile();
  const fallback = demoResponsesByCompany[company.id] ?? demoResponsesByCompany[demoCompany.id];
  const stored = read(keys.responses, fallback) as Partial<ScanResponses>;
  const normalized = Object.fromEntries(areaIds.map((id) => [id, stored[id] ?? fallback[id] ?? [3, 3, 3, 3, 3]])) as ScanResponses;
  if (areaIds.some((id) => !stored[id])) write(keys.responses, normalized);
  return normalized;
}

export function saveScanResponses(responses: ScanResponses) {
  write(keys.responses, responses);
}

export function getDataRoom(): DataRoom {
  const company = getCompanyProfile();
  return read(keys.dataRoom, demoDataRooms[company.id] ?? demoDataRooms[demoCompany.id]);
}

export function saveDataRoom(dataRoom: DataRoom) {
  write(keys.dataRoom, dataRoom);
}

export function getInboxConversations(): BridgeInboxConversation[] {
  const company = getCompanyProfile();
  return read(keys.inbox, getDemoInboxConversations(company));
}

export function saveInboxConversations(conversations: BridgeInboxConversation[]) {
  write(keys.inbox, conversations);
}

export function getTrackerTasks(): TrackerTask[] {
  return read(keys.tasks, demoTrackerTasks);
}

export function saveTrackerTasks(tasks: TrackerTask[]) {
  write(keys.tasks, tasks);
}

export function resetDemo(companyId = getSelectedCompanyId()) {
  const company = demoCompanies.find((item) => item.id === companyId) ?? demoCompany;
  write(keys.selectedCompanyId, company.id);
  write(keys.company, company);
  write(keys.responses, demoResponsesByCompany[company.id]);
  write(keys.dataRoom, demoDataRooms[company.id]);
  write(keys.inbox, getDemoInboxConversations(company));
  write(keys.tasks, demoTrackerTasks);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(keys.liveGoals);
    window.localStorage.removeItem(keys.workerLesson);
  }
}

export function exportDemoData() {
  return {
    company: getCompanyProfile(),
    responses: getScanResponses(),
    dataRoom: getDataRoom(),
    inbox: getInboxConversations(),
    tasks: getTrackerTasks(),
  };
}
