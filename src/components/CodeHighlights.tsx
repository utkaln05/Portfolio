"use client"

import * as React from "react"
import { usePortfolio } from "@/context/PortfolioContext"

export function CodeHighlights() {
  const { data } = usePortfolio()

  return (
    <section className="py-12 border-t border-b bg-muted/10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest font-bold">
              {data.codeHighlight.filename}
            </span>
          </div>
          <div className="p-6 md:p-8 bg-background border rounded-xl font-mono text-sm md:text-base leading-relaxed overflow-x-auto shadow-sm">
            <pre className="text-foreground">
              <code>{data.codeHighlight.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
