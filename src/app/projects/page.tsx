"use client"

import Link from "next/link"
import { Github, ExternalLink, ArrowLeft } from "lucide-react"
import { usePortfolio } from "@/context/PortfolioContext"

export default function AllProjectsPage() {
  const { data } = usePortfolio()

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
            All Work
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-3 text-base max-w-xl">
            A complete collection of my projects — from data pipelines and dashboards to AI integrations and web apps.
          </p>
        </div>

        {/* Project count */}
        <p className="text-xs text-muted-foreground mb-8 font-medium">
          {data.projects.length} project{data.projects.length !== 1 ? "s" : ""}
        </p>

        {/* All projects grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-10">
          {data.projects.map((project, idx) => (
            <div key={idx} className="group space-y-4">
              {/* Project image */}
              <div className="aspect-video overflow-hidden rounded-xl bg-muted border relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://picsum.photos/seed/${idx + 10}/600/400`
                  }}
                />
                {/* Number badge */}
                <span className="absolute top-3 left-3 text-[10px] font-black bg-background/80 backdrop-blur-sm border rounded px-2 py-0.5 tabular-nums">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Project info */}
              <div className="space-y-2 px-1">
                <h2 className="text-xl font-bold leading-snug">{project.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tech tags */}
                {project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech.map((t, ti) => (
                      <span
                        key={ti}
                        className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-5 pt-2">
                  {project.github && project.github !== "#" && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Github className="w-4 h-4" /> Source Code
                    </a>
                  )}
                  {project.link && project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back link at bottom */}
        <div className="mt-20 pt-10 border-t">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
        </div>
      </div>
    </main>
  )
}
