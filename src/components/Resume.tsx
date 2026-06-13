"use client"

import { Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePortfolio } from "@/context/PortfolioContext"

export function Resume() {
  const { data } = usePortfolio()

  const linkedinUrl = data.contact.linkedin
    ? data.contact.linkedin.startsWith('http')
      ? data.contact.linkedin
      : `https://${data.contact.linkedin}`
    : '#'

  return (
    <section id="resume" className="py-24 border-t">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
        <h2 className="text-4xl font-bold tracking-tight">Ready for a deeper look?</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Get a copy of my full resume for a detailed breakdown of my technical competencies and career achievements.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant={data.buttonStyle || "default"}
            size="lg"
            className={`gap-2 transition-all ${
              data.buttonStyle === 'glow' ? 'shadow-lg shadow-pink-500/20' : ''
            }`}
            asChild
          >
            <a href="/resume.pdf" download>
              <Download className="w-4 h-4" /> Download PDF
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 hover:bg-accent hover:scale-[1.01] transition-all"
            asChild
          >
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" /> LinkedIn Profile
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}