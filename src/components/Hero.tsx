"use client"

import { ArrowRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePortfolio } from "@/context/PortfolioContext"

export function Hero() {
  const { data } = usePortfolio()

  return (
    <section id="home" className="pt-32 pb-16 md:pt-48 md:pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="w-56 h-56 md:w-72 md:h-72 shrink-0 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl -rotate-6 scale-95" />
            <div className="absolute inset-0 border border-border rounded-3xl rotate-3 scale-95" />
            <div className="w-full h-full relative overflow-hidden rounded-3xl border-2 border-background shadow-2xl">
              <img 
                src={data.profileImage} 
                alt={data.fullName}
                className="w-full h-full object-cover"
                data-ai-hint="professional portrait"
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="space-y-3">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-headline leading-none">
                {data.fullName}
              </h1>
              <p className="text-xl md:text-2xl text-primary font-medium tracking-tight">
                {data.primaryRole}
              </p>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              {data.introduction}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
              <Button 
                asChild 
                variant={data.buttonStyle || "default"} 
                size="lg" 
                className={`rounded-xl px-8 h-14 text-base font-bold group transition-all ${
                  data.buttonStyle === 'glow' ? 'shadow-xl shadow-pink-500/20' : 
                  data.buttonStyle === 'shimmer' ? 'shadow-lg shadow-white/5' : ''
                }`}
              >
                <a href="#projects" className="gap-2 relative">
                  View Work 
                  <ArrowRight className={`w-4 h-4 transition-all duration-300 ${
                    data.buttonStyle === 'magnetic' 
                      ? 'absolute right-3 opacity-0 group-hover:opacity-100 group-hover:right-1' 
                      : 'group-hover:translate-x-1'
                  }`} />
                </a>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="gap-2 rounded-xl px-8 h-14 text-base font-semibold hover:bg-accent hover:scale-[1.01] transition-all"
              >
                <a href={data.resumeUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4" /> Resume
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
