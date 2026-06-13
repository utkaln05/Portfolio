"use client"

import { usePortfolio } from "@/context/PortfolioContext"
import { Badge } from "@/components/ui/badge"

export function Skills() {
  const { data } = usePortfolio()

  return (
    <section id="skills" className="py-24 border-t">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-12">
          Expertise & Stack
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {data.skills.map((skill, idx) => (
            <Badge key={idx} variant="secondary" className="text-base py-3 px-8 rounded-2xl font-semibold bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-none">
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
