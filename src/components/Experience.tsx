"use client"

import { usePortfolio } from "@/context/PortfolioContext"

export function Experience() {
  const { data } = usePortfolio()

  return (
    <section id="experience" className="py-24 border-t">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Experience
            </h2>
          </div>
          <div className="md:col-span-2 space-y-12">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-sm font-medium tabular-nums px-2 py-1 bg-muted rounded">
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
                <ul className="space-y-2">
                  {exp.achievements.map((ach, i) => (
                    <li key={i} className="text-sm flex gap-3">
                      <span className="text-muted-foreground font-bold">—</span>
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}