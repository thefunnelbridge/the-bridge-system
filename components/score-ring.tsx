"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export function ScoreRing({ score, label = "Bridge Score™" }: { score: number; label?: string }) {
  const data = [
    { name: "score", value: score },
    { name: "rest", value: 100 - score },
  ];

  return (
    <div className="relative h-56 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius="72%" outerRadius="92%" startAngle={90} endAngle={-270} stroke="none">
            <Cell fill="#B87547" />
            <Cell fill="#EFE8DB" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-fog">{label}</p>
          <p className="mt-2 text-5xl font-semibold text-ink">{score}</p>
        </div>
      </div>
    </div>
  );
}
