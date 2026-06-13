"use client"

import { Github, ExternalLink } from "lucide-react"
import { usePortfolio } from "@/context/PortfolioContext"

export function Projects() {
  const { data } = usePortfolio()

  return (
    <section id="projects" className="py-24 border-t">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Featured Projects
          </h2>
          <a href="#" className="text-xs font-bold hover:underline flex items-center gap-1">
            ALL PROJECTS <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {data.projects.map((project, idx) => (
            <div key={idx} className="group space-y-4">
              <div className="aspect-video overflow-hidden rounded-lg bg-muted border">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                  <a href={project.github} className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors">
                    <Github className="w-4 h-4" /> Code
                  </a>
                  <a href={project.link} className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}