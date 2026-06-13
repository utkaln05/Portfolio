"use client"

import Link from "next/link"
import { Award, ExternalLink, CalendarDays, Building2, ArrowRight } from "lucide-react"
import { usePortfolio } from "@/context/PortfolioContext"

export function Certificates() {
  const { data } = usePortfolio()

  const certs = data.certificates || []
  if (certs.length === 0) return null

  // Show only first 3 on home page
  const featured = certs.slice(0, 3)

  return (
    <section id="certificates" className="py-24 border-t">
      <div className="max-w-5xl mx-auto px-6">

        {/* Section header — same style as Projects */}
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Certificates
          </h2>
          {certs.length > 3 && (
            <Link
              href="/certificates"
              className="text-xs font-bold hover:underline flex items-center gap-1 hover:text-primary transition-colors"
            >
              ALL CERTIFICATES ({certs.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Grid of certificate cards — 3 columns */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featured.map((cert, idx) => {
            const hasLink = cert.link && cert.link !== "#" && cert.link !== ""
            const hasImage = cert.image && cert.image !== ""

            return (
              <div
                key={idx}
                className="group relative flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                {/* Certificate image */}
                {hasImage ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted border-b">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.style.display = "none"
                      }}
                    />
                  </div>
                ) : (
                  /* Placeholder badge when no image */
                  <div className="aspect-video w-full bg-gradient-to-br from-primary/5 to-primary/10 border-b flex items-center justify-center">
                    <Award className="w-12 h-12 text-primary/30" />
                  </div>
                )}

                {/* Card content */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                  </div>

                  <div className="space-y-1.5 pl-11">
                    {cert.issuer && (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        <span>{cert.issuer}</span>
                      </div>
                    )}
                    {cert.date && (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <CalendarDays className="w-3 h-3 flex-shrink-0" />
                        <span>{cert.date}</span>
                      </div>
                    )}
                  </div>

                  {/* Verify link */}
                  {hasLink && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center gap-1 text-xs font-semibold text-primary pt-3 border-t border-border hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Verify Certificate
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* View All button below cards */}
        {certs.length > 3 && (
          <div className="mt-12 text-center">
            <Link
              href="/certificates"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/40 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              View All {certs.length} Certificates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
