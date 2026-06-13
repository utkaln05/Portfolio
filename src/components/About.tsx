"use client"

import { usePortfolio } from "@/context/PortfolioContext"

export function About() {
  const { data } = usePortfolio()

  return (
    <section id="about" className="py-24 border-t">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              {data.aboutMe.title}
            </h2>
          </div>
          <div className="md:col-span-2 space-y-8">
            <p className="text-2xl leading-snug">
              {data.aboutMe.content}
            </p>
            <div className="grid sm:grid-cols-2 gap-8">
              {data.aboutMe.highlights.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}