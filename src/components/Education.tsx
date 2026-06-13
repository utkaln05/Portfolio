"use client"

import { usePortfolio } from "@/context/PortfolioContext"

export function Education() {
  const { data } = usePortfolio()

  return (
    <section id="education" className="py-24 border-t">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Education
            </h2>
          </div>
          <div className="md:col-span-2 space-y-12">
            {data.education.map((edu, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{edu.degree}</h3>
                    <p className="text-muted-foreground">{edu.university}</p>
                  </div>
                  <span className="text-sm font-medium tabular-nums">{edu.duration}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {edu.details.map((detail, i) => (
                    <span key={i} className="text-xs bg-muted px-2 py-1 rounded border">
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}