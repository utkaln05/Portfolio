"use client"

import * as React from "react"

export interface PortfolioData {
  fullName: string
  primaryRole: string
  profileImage: string
  tagline: string
  introduction: string
  resumeUrl: string
  buttonStyle?: "default" | "glow" | "neoBrutal" | "glass" | "shimmer" | "magnetic"
  aboutMe: {
    title: string
    content: string
    highlights: Array<{ title: string; text: string }>
  }
  skills: Array<{ name: string; proficiency: number }>
  projects: Array<{
    title: string
    description: string
    tech: string[]
    link: string
    github: string
    image: string
  }>
  experience: Array<{
    title: string
    company: string
    period: string
    location: string
    description: string
    achievements: string[]
  }>
  education: Array<{
    degree: string
    university: string
    duration: string
    details: string[]
  }>
  certificates: Array<{
    title: string
    issuer: string
    date: string
    link: string
    image: string
  }>
  contact: {
    email: string
    linkedin: string
    github: string
    leetcode: string
    phone: string
  }
}

export const defaultData: PortfolioData = {
  fullName: "Utkal Nikam",
  primaryRole: "Data Analyst and Python Developer",
  profileImage: "https://picsum.photos/seed/utkal/400/400",
  tagline: "Decoding Data, Powering Insights.",
  introduction: "I'm a Data Analyst and Python Developer passionate about transforming complex datasets into strategic narratives through automation and advanced visualization.",
  resumeUrl: "/resume.pdf",
  buttonStyle: "glow",
  aboutMe: {
    title: "Who I Am",
    content: "I am a results-oriented Data Analyst with a strong foundation in Python development. My approach blends technical rigor with a keen eye for business impact. Whether it's building automated scrapers for real-time market data or designing intuitive dashboards for executive decision-making, I thrive on solving the 'impossible' problems through data-driven strategies.",
    highlights: [
      { title: "Data Extraction", text: "Expert in Selenium and BeautifulSoup for complex web scraping and automation workflows." },
      { title: "Visualization", text: "Crafting impactful Power BI dashboards that turn raw numbers into clear business stories." },
      { title: "AI Integration", text: "Implementing RAG architectures and LLMs to solve modern information retrieval challenges." },
      { title: "Automation", text: "Developing Python scripts to eliminate repetitive tasks and optimize data pipelines." }
    ]
  },
  skills: [
    { name: "Python", proficiency: 95 },
    { name: "SQL", proficiency: 90 },
    { name: "Power BI", proficiency: 85 },
    { name: "Pandas/NumPy", proficiency: 92 },
    { name: "Selenium", proficiency: 95 },
    { name: "Excel", proficiency: 88 },
    { name: "React", proficiency: 75 },
    { name: "Data Analysis", proficiency: 90 },
  ],
  projects: [
    {
      title: "Bus Route Data Scraper",
      description: "High-performance automated tool built with Selenium to collect and structure real-time public transit data.",
      tech: ["Python", "Selenium", "PostgreSQL"],
      link: "#",
      github: "#",
      image: "https://picsum.photos/seed/transit/600/400"
    },
    {
      title: "RAG Chatbot using LLMs",
      description: "An advanced retrieval-augmented generation system for intelligent document processing.",
      tech: ["LLMs", "LangChain", "OpenAI", "Python"],
      link: "#",
      github: "#",
      image: "https://picsum.photos/seed/chatbot/600/400"
    }
  ],
  experience: [
    {
      title: "Freelance Data Analyst",
      company: "Self-Employed",
      period: "2023 - Present",
      location: "Remote",
      description: "Developing custom web scrapers and data visualization dashboards for diverse international clients.",
      achievements: [
        "Built automated competitive pricing scraper saving clients 15 hours weekly.",
        "Developed interactive Power BI dashboards for e-commerce performance tracking."
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Engineering (IT)",
      university: "University of Mumbai",
      duration: "2018 - 2022",
      details: ["Data Mining", "AI/ML", "Database Systems"]
    }
  ],
  certificates: [
    {
      title: "Python for Data Science",
      issuer: "Coursera",
      date: "2023",
      link: "#",
      image: ""
    }
  ],
  contact: {
    email: "utkal.nikam@example.com",
    linkedin: "linkedin.com/in/utkalnikam",
    github: "github.com/utkalnikam",
    leetcode: "leetcode.com/u/utkalnikam",
    phone: "+91 98765 43210"
  }
}

interface PortfolioContextType {
  data: PortfolioData
  updateData: (newData: Partial<PortfolioData>, password?: string) => Promise<boolean>
  resetData: () => Promise<void>
  isSaving: boolean
  isLoading: boolean
}

const PortfolioContext = React.createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<PortfolioData>(defaultData)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Load data from MongoDB on mount
  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/portfolio')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setData({ ...defaultData, ...json.data })
          }
        }
      } catch (err) {
        console.error('Failed to load portfolio data from MongoDB', err)
        // Fallback to localStorage if API fails
        const saved = typeof window !== 'undefined' ? localStorage.getItem('portfolio-data') : null
        if (saved) {
          try { setData(JSON.parse(saved)) } catch {}
        }
      } finally {
        setIsLoaded(true)
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Save data to MongoDB via API
  const updateData = async (newData: Partial<PortfolioData>, password?: string): Promise<boolean> => {
    const updated = { ...data, ...newData }
    setIsSaving(true)
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data: updated })
      })
      if (res.ok) {
        setData(updated)
        // Also cache locally as fallback
        if (typeof window !== 'undefined') {
          localStorage.setItem('portfolio-data', JSON.stringify(updated))
        }
        return true
      } else {
        console.error('Failed to save: unauthorized or server error')
        return false
      }
    } catch (err) {
      console.error('Failed to save portfolio data', err)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const resetData = async () => {
    setData(defaultData)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolio-data')
    }
  }

  if (!isLoaded) return null

  return (
    <PortfolioContext.Provider value={{ data, updateData, resetData, isSaving, isLoading }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = React.useContext(PortfolioContext)
  if (!context) throw new Error("usePortfolio must be used within PortfolioProvider")
  return context
}
