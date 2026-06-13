"use client"

import * as React from "react"
import { usePortfolio } from "@/context/PortfolioContext"

export function Footer() {
  const [year, setYear] = React.useState<number | null>(null)
  const { data } = usePortfolio()

  React.useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  const { linkedin, github, email } = data.contact

  const linkedinUrl = linkedin
    ? linkedin.startsWith('http') ? linkedin : `https://${linkedin}`
    : '#'
  const githubUrl = github
    ? github.startsWith('http') ? github : `https://${github}`
    : '#'
  const emailUrl = email ? `mailto:${email}` : '#'

  return (
    <footer className="py-12 border-t mt-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
              {data.fullName.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold tracking-tight">{data.fullName}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {year || new Date().getFullYear()} {data.fullName} • Built with precision for the data-driven world.
          </p>
          <div className="flex gap-6 text-xs font-medium">
            {linkedin && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline underline-offset-4">
                LinkedIn
              </a>
            )}
            {github && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline underline-offset-4">
                GitHub
              </a>
            )}
            {email && (
              <a href={emailUrl} className="hover:text-primary transition-colors underline underline-offset-4">
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}