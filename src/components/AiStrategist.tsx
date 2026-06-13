"use client"

import * as React from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { recruiterQuery } from "@/ai/flows/recruiter-experience-strategist"

export function AiStrategist() {
  const [query, setQuery] = React.useState("")
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'ai', content: string }>>([
    { role: 'ai', content: "Hi, I'm Utkal's portfolio assistant. Ask me anything about his projects, skills, or professional fit." }
  ])
  const [loading, setLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return

    const userMsg = query
    setQuery("")
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const result = await recruiterQuery({ query: userMsg })
      setMessages(prev => [...prev, { role: 'ai', content: result.answer }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I had trouble processing that. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="ai-strategist" className="py-24 border-t bg-muted/30">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              AI Assistant
            </h2>
            <p className="text-sm text-muted-foreground">
              Ask about technical skills or project specifics for instant answers.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="bg-background border rounded-xl overflow-hidden flex flex-col h-[500px] shadow-sm">
              <div className="p-4 border-b bg-muted/50 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-tighter">Strategist Chat</span>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex gap-3 max-w-[90%]", msg.role === 'user' ? "ml-auto flex-row-reverse text-right" : "")}>
                    <div className={cn("w-8 h-8 rounded border flex items-center justify-center shrink-0", msg.role === 'ai' ? "bg-muted" : "bg-primary text-primary-foreground")}>
                      {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={cn("p-3 rounded-lg text-sm", msg.role === 'ai' ? "bg-muted/50 border" : "bg-primary text-primary-foreground")}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded border bg-muted flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="p-3 rounded-lg text-sm bg-muted/50 border italic">Thinking...</div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit} className="p-4 border-t bg-muted/20">
                <div className="relative flex gap-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1"
                  />
                  <Button disabled={loading} type="submit" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}