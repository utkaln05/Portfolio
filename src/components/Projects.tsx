"use client"

import Link from "next/link"
import { Github, ExternalLink, ArrowRight } from "lucide-react"
import { usePortfolio } from "@/context/PortfolioContext"

export function Projects() {
  const { data } = usePortfolio()

  // Show only the first 2 projects on the home page
  const featured = data.projects.slice(0, 2)

  return (
    <section id="projects" className="py-24 border-t">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Featured Projects
          </h2>
          {data.projects.length > 2 && (
            <Link
              href="/projects"
              className="text-xs font-bold hover:underline flex items-center gap-1 hover:text-primary transition-colors"
            >
              ALL PROJECTS ({data.projects.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {featured.map((project, idx) => (
            <div key={idx} className="group space-y-4">
              <div className="aspect-video overflow-hidden rounded-lg bg-muted border">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/project/600/400"
                  }}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {project.tech.join(" / ")}
                </div>
                <div className="flex gap-4 pt-2">
                  {project.github && project.github !== "#" && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors">
                      <Github className="w-4 h-4" /> Code
                    </a>
                  )}
                  {project.link && project.link !== "#" && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All button below cards */}
        {data.projects.length > 2 && (
          <div className="mt-14 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/40 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              View All {data.projects.length} Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}