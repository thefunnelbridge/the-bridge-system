import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <Sidebar />
      <div className="md:pl-72">
        <Topbar />
        <main className="px-4 py-8 md:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
