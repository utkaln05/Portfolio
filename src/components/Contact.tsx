"use client"

import * as React from "react"
import { Mail, Linkedin, Github, Send, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePortfolio } from "@/context/PortfolioContext"
import { useToast } from "@/hooks/use-toast"

export function Contact() {
  const { data } = usePortfolio()
  const { toast } = useToast()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [isSending, setIsSending] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast({
        title: "⚠️ Incomplete Form",
        description: "Please fill out all fields before sending.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      })

      const result = await res.json()

      if (res.ok) {
        toast({
          title: "🚀 Message Sent",
          description: result.warning || "Your message has been delivered to Utkal's email successfully!",
        })
        // Clear/refresh form fields
        setName("")
        setEmail("")
        setMessage("")
      } else {
        throw new Error(result.error || "Failed to send message.")
      }
    } catch (err: any) {
      toast({
        title: "❌ Error Sending Message",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="contact" className="py-24 border-t">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Let's Connect.</h2>
              <p className="text-muted-foreground leading-relaxed">
                Whether it's a project inquiry or just a technical discussion about Python, feel free to reach out.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                data.contact.email && { label: "Email", val: data.contact.email, icon: <Mail className="w-4 h-4" />, href: `mailto:${data.contact.email}` },
                data.contact.linkedin && { label: "LinkedIn", val: "LinkedIn", icon: <Linkedin className="w-4 h-4" />, href: data.contact.linkedin.startsWith('http') ? data.contact.linkedin : `https://${data.contact.linkedin}` },
                data.contact.github && { label: "GitHub", val: "GitHub", icon: <Github className="w-4 h-4" />, href: data.contact.github.startsWith('http') ? data.contact.github : `https://${data.contact.github}` },
                data.contact.phone && { label: "Phone", val: data.contact.phone, icon: <Phone className="w-4 h-4" />, href: `tel:${data.contact.phone.replace(/\s/g, '')}` },
              ].filter(Boolean).map((item: any, idx) => (
                <a key={idx} href={item.href} target={item.href.startsWith('mailto') || item.href.startsWith('tel') ? undefined : '_blank'} rel="noopener noreferrer" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{item.label}</p>
                    <p className="text-xs font-semibold">{item.val}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Name</label>
                <Input 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Email</label>
                <Input 
                  type="email"
                  placeholder="john@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground">Message</label>
              <Textarea 
                placeholder="How can I help you?" 
                className="min-h-[120px]" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit"
              disabled={isSending}
              variant={data.buttonStyle || "default"} 
              className={`w-full gap-2 transition-all ${
                data.buttonStyle === 'glow' ? 'shadow-lg shadow-pink-500/20' : ''
              }`}
            >
              {isSending ? (
                <>Sending... <Loader2 className="w-4 h-4 animate-spin" /></>
              ) : (
                <>Send Message <Send className="w-4 h-4" /></>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}