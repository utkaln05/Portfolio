"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePortfolio } from "@/context/PortfolioContext"

const navItems = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { data } = usePortfolio()
  const router = useRouter()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'e') {
        router.push('/dashboard')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-headline font-bold text-lg">
          {data.fullName}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
          {data.contact.leetcode && (
            <a 
              href={data.contact.leetcode.startsWith('http') ? data.contact.leetcode : `https://${data.contact.leetcode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link flex items-center gap-1.5 text-primary font-bold"
            >
              LeetCode <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b bg-background p-6 space-y-4">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium"
            >
              {item.label}
            </Link>
          ))}
          {data.contact.leetcode && (
            <a 
              href={data.contact.leetcode.startsWith('http') ? data.contact.leetcode : `https://${data.contact.leetcode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg font-bold text-primary"
              onClick={() => setIsOpen(false)}
            >
              LeetCode
            </a>
          )}
        </div>
      )}
    </nav>
  )
}
