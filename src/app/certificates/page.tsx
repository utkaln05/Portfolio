"use client"

import Link from "next/link"
import { Award, ExternalLink, CalendarDays, Building2, ArrowLeft } from "lucide-react"
import { usePortfolio } from "@/context/PortfolioContext"

export default function AllCertificatesPage() {
  const { data } = usePortfolio()
  const certs = data.certificates || []

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {data.fullName}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Page heading */}
        <div className="mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            All Certifications
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Certificates</h1>
          <p className="text-muted-foreground mt-3 text-base max-w-xl">
            A complete list of my professional certifications, courses, and achievements.
          </p>
        </div>

        {/* Count */}
        <p className="text-xs text-muted-foreground mb-8 font-medium">
          {certs.length} certificate{certs.length !== 1 ? "s" : ""}
        </p>

        {certs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border rounded-xl border-dashed">
            <Award className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-semibold">No certificates added yet</p>
            <p className="text-sm mt-1">Add certificates from the dashboard editor.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {certs.map((cert, idx) => {
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
                    <div className="aspect-video w-full bg-gradient-to-br from-primary/5 to-primary/10 border-b flex items-center justify-center relative">
                      <Award className="w-12 h-12 text-primary/30" />
                      {/* Number badge */}
                      <span className="absolute top-3 left-3 text-[10px] font-black bg-background/80 backdrop-blur-sm border rounded px-2 py-0.5 tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}

                  {/* Card content */}
                  <div className="flex flex-col gap-3 p-5 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <h2 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors">
                        {cert.title}
                      </h2>
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

                    {hasLink && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto flex items-center gap-1 text-xs font-semibold text-primary pt-3 border-t border-border hover:underline"
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
        )}

        {/* Back link at bottom */}
        <div className="mt-20 pt-10 border-t">
          <Link
            href="/#certificates"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
        </div>
      </div>
    </main>
  )
}
