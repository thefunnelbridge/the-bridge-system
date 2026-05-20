"use client";

import { demoCompany, demoResponses, demoTrackerTasks } from "./demo-data";
import type { CompanyProfile, ScanResponses, TrackerTask } from "./types";

const keys = {
  company: "bridge-system.company",
  responses: "bridge-system.responses",
  tasks: "bridge-system.tasks",
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

export function getCompanyProfile(): CompanyProfile {
  return read(keys.company, demoCompany);
}

export function saveCompanyProfile(profile: CompanyProfile) {
  write(keys.company, profile);
}

export function getScanResponses(): ScanResponses {
  return read(keys.responses, demoResponses);
}

export function saveScanResponses(responses: ScanResponses) {
  write(keys.responses, responses);
}

export function getTrackerTasks(): TrackerTask[] {
  return read(keys.tasks, demoTrackerTasks);
}

export function saveTrackerTasks(tasks: TrackerTask[]) {
  write(keys.tasks, tasks);
}

export function resetDemo() {
  saveCompanyProfile(demoCompany);
  saveScanResponses(demoResponses);
  saveTrackerTasks(demoTrackerTasks);
}
