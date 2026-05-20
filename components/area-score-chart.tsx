"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AreaScore } from "@/lib/types";

export function AreaScoreChart({ scores }: { scores: AreaScore[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={scores} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(10,10,10,.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#756D64", fontSize: 12 }} tickLine={false} axisLine={false} interval={0} height={58} />
          <YAxis domain={[0, 100]} tick={{ fill: "#756D64", fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: "rgba(184,117,71,.10)" }} contentStyle={{ background: "#F5F1EA", border: "1px solid rgba(10,10,10,.12)", borderRadius: 8 }} />
          <Bar dataKey="score" fill="#B87547" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
