"use client"

import * as React from "react"
import { usePortfolio } from "@/context/PortfolioContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RotateCcw, ArrowLeft, Plus, Trash2, Globe, Sparkles, ArrowRight, Check, Lock, Loader2, Database, Inbox, Mail, MailOpen } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface ContactMessage {
  _id: string
  name: string
  email: string
  message: string
  createdAt: string
  read: boolean
}

export default function DashboardPage() {
  const { data, updateData, resetData, isSaving } = usePortfolio()
  const { toast } = useToast()
  const [formData, setFormData] = React.useState(data)
  const [messages, setMessages] = React.useState<ContactMessage[]>([])
  const [isFetchingMessages, setIsFetchingMessages] = React.useState(false)

  // Password gate
  const [password, setPassword] = React.useState("")
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [authError, setAuthError] = React.useState("")
  const [isCheckingPwd, setIsCheckingPwd] = React.useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCheckingPwd(true)
    setAuthError("")
    // Test the password by doing a save attempt
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data })
      })
      if (res.ok) {
        setIsAuthenticated(true)
      } else {
        setAuthError("Incorrect password. Please try again.")
      }
    } catch {
      setAuthError("Unable to connect. Try again.")
    } finally {
      setIsCheckingPwd(false)
    }
  }

  const handleSave = async () => {
    const ok = await updateData(formData, password)
    if (ok) {
      toast({
        title: "✅ Saved to MongoDB",
        description: "Your portfolio is now updated globally for all visitors.",
      })
    } else {
      toast({
        title: "❌ Save Failed",
        description: "Wrong password or server error.",
        variant: "destructive"
      })
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset to defaults? This will erase your current edits.")) {
      resetData()
      window.location.reload()
    }
  }

  const fetchMessages = React.useCallback(async (pwd: string) => {
    setIsFetchingMessages(true)
    try {
      const res = await fetch(`/api/contact?password=${encodeURIComponent(pwd)}`)
      if (res.ok) {
        const json = await res.json()
        setMessages(json.messages || [])
      } else {
        toast({ title: "❌ Failed to load messages", variant: "destructive" })
      }
    } catch {
      toast({ title: "❌ Error loading messages", variant: "destructive" })
    } finally {
      setIsFetchingMessages(false)
    }
  }, [toast])

  // Password gate screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Site Editor</h1>
            <p className="text-muted-foreground text-sm">Enter your dashboard password to continue</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-full px-4 py-1.5 w-fit mx-auto border">
              <Database className="w-3 h-3" />
              Changes sync globally via MongoDB
            </div>
          </div>
          <Card className="border-border/60 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Dashboard Password</label>
                  <Input
                    type="password"
                    placeholder="Enter password..."
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-12 text-base"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs text-destructive font-medium">{authError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full h-12 gap-2" disabled={isCheckingPwd || !password}>
                  {isCheckingPwd ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Unlock Editor</>
                  )}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  Password is set via <code className="bg-muted px-1 rounded">DASHBOARD_PASSWORD</code> environment variable
                </p>
              </form>
            </CardContent>
          </Card>
          <div className="text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 text-foreground">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Portfolio
            </Link>
            <h1 className="text-4xl font-bold font-headline">Site Editor</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm text-muted-foreground">Connected to MongoDB — changes sync globally</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2 group hover:border-destructive hover:text-destructive transition-all duration-300 rounded-xl"
            >
              <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" /> Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="shimmer"
              className="gap-2 bg-emerald-950 text-emerald-200 border-emerald-800 hover:border-emerald-600 hover:bg-emerald-900 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.1)] px-5"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </Button>
          </div>
        </div>

        {/* Button Aesthetics Engine Showcase */}
        <Card className="border border-primary/10 overflow-hidden bg-gradient-to-br from-card to-muted/20 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
              Button Aesthetics Engine
            </CardTitle>
            <CardDescription>
              Select one of the 5 custom-designed, premium Tailwind CSS buttons to apply across all main CTAs on your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {[
                {
                  id: "glow",
                  name: "Neo-Glow",
                  desc: "Vibrant shifting gradient glow",
                  preview: <Button variant="glow" size="sm" className="w-full pointer-events-none">Neo Glow</Button>
                },
                {
                  id: "shimmer",
                  name: "Cyber Shimmer",
                  desc: "Sleek metallic moving beam",
                  preview: <Button variant="shimmer" size="sm" className="w-full pointer-events-none">Shimmer</Button>
                },
                {
                  id: "neoBrutal",
                  name: "Neo-Brutalist",
                  desc: "Tactile retro offset shadow",
                  preview: <Button variant="neoBrutal" size="sm" className="w-full pointer-events-none">Brutalist</Button>
                },
                {
                  id: "glass",
                  name: "Aero Glass",
                  desc: "Translucent high-blur style",
                  preview: <div className="p-2 bg-slate-950 rounded border border-white/5"><Button variant="glass" size="sm" className="w-full pointer-events-none">Aero</Button></div>
                },
                {
                  id: "magnetic",
                  name: "Magnetic Slide",
                  desc: "Micro-slide arrow reveal",
                  preview: <Button variant="magnetic" size="sm" className="w-full pointer-events-none text-left justify-start">Slide <ArrowRight className="absolute right-4 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:right-3 transition-all" /></Button>
                }
              ].map((style) => {
                const isSelected = formData.buttonStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, buttonStyle: style.id as any })}
                    className={`flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-300 relative group/btn ${
                      isSelected
                        ? "border-primary bg-background ring-2 ring-primary/20 shadow-md scale-[1.02]"
                        : "border-border bg-card hover:bg-muted/40 hover:scale-[1.01]"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="mb-3 pr-4">
                      <span className="text-xs font-bold block mb-1 group-hover/btn:text-primary transition-colors">{style.name}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight block">{style.desc}</span>
                    </div>
                    <div className="w-full pt-2 border-t mt-auto">
                      {style.preview}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="general" className="w-full" onValueChange={(val) => {
          if (val === 'messages' && messages.length === 0) fetchMessages(password)
        }}>
          <TabsList className="flex flex-wrap w-full gap-2 mb-8 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
            <TabsTrigger value="about" className="flex-1">About & Skills</TabsTrigger>
            <TabsTrigger value="projects" className="flex-1">Projects</TabsTrigger>
            <TabsTrigger value="experience" className="flex-1">Experience</TabsTrigger>
            <TabsTrigger value="education" className="flex-1">Education</TabsTrigger>
            <TabsTrigger value="certificates" className="flex-1">Certificates</TabsTrigger>
            <TabsTrigger value="contact" className="flex-1">Contact Info</TabsTrigger>
            <TabsTrigger value="messages" className="flex-1 relative gap-2">
              <Inbox className="w-3.5 h-3.5" />
              Messages
              {messages.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {messages.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Identity</CardTitle>
                <CardDescription>Update your basic info and profile picture.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Profile Image URL</label>
                  <Input
                    value={formData.profileImage}
                    onChange={e => setFormData({...formData, profileImage: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Primary Role</label>
                  <Input
                    value={formData.primaryRole}
                    onChange={e => setFormData({...formData, primaryRole: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Short Bio (Hero)</label>
                  <Textarea
                    value={formData.introduction}
                    onChange={e => setFormData({...formData, introduction: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2 border-t pt-4 mt-4">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Globe size={14} className="text-primary" /> LeetCode Profile URL
                  </label>
                  <Input
                    value={formData.contact.leetcode}
                    onChange={e => setFormData({
                      ...formData,
                      contact: { ...formData.contact, leetcode: e.target.value }
                    })}
                    placeholder="leetcode.com/u/yourusername"
                  />
                  <p className="text-[10px] text-muted-foreground">Visible in the main site header.</p>
                </div>
                <div className="space-y-2 border-t pt-4 mt-4">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Globe size={14} className="text-primary" /> Resume / CV URL
                  </label>
                  <Input
                    value={formData.resumeUrl || ''}
                    onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })}
                    placeholder="https://drive.google.com/... or /resume.pdf"
                  />
                  <p className="text-[10px] text-muted-foreground">Paste a Google Drive link, Dropbox link, or a local path like /resume.pdf. This is used for the View Resume button.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">About Title</label>
                  <Input
                    value={formData.aboutMe.title}
                    onChange={e => setFormData({...formData, aboutMe: {...formData.aboutMe, title: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Main Content</label>
                  <Textarea
                    value={formData.aboutMe.content}
                    onChange={e => setFormData({...formData, aboutMe: {...formData.aboutMe, content: e.target.value}})}
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Highlights / Services</CardTitle>
                <CardDescription>Key services or core strengths displayed under the About section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.aboutMe.highlights || []).map((highlight, idx) => (
                  <div key={idx} className="flex gap-4 items-start border p-4 rounded-xl">
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Highlight Title</label>
                        <Input
                          value={highlight.title}
                          onChange={e => {
                            const newHighlights = [...(formData.aboutMe.highlights || [])]
                            newHighlights[idx] = { ...newHighlights[idx], title: e.target.value }
                            setFormData({...formData, aboutMe: {...formData.aboutMe, highlights: newHighlights}})
                          }}
                          placeholder="e.g., Data Extraction"
                          className="font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Description</label>
                        <Textarea
                          value={highlight.text}
                          onChange={e => {
                            const newHighlights = [...(formData.aboutMe.highlights || [])]
                            newHighlights[idx] = { ...newHighlights[idx], text: e.target.value }
                            setFormData({...formData, aboutMe: {...formData.aboutMe, highlights: newHighlights}})
                          }}
                          placeholder="Description of the service or strength..."
                          className="text-sm min-h-[60px]"
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => {
                      const newHighlights = (formData.aboutMe.highlights || []).filter((_, i) => i !== idx)
                      setFormData({...formData, aboutMe: {...formData.aboutMe, highlights: newHighlights}})
                    }} className="mt-6">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" onClick={() => {
                  setFormData({
                    ...formData,
                    aboutMe: {
                      ...formData.aboutMe,
                      highlights: [...(formData.aboutMe.highlights || []), { title: "", text: "" }]
                    }
                  })
                }}>
                  <Plus className="w-4 h-4" /> Add Highlight
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <Input
                      value={skill.name}
                      onChange={e => {
                        const newSkills = [...formData.skills]
                        newSkills[idx] = { ...newSkills[idx], name: e.target.value }
                        setFormData({...formData, skills: newSkills})
                      }}
                      placeholder="Skill Name"
                    />
                    <Button variant="ghost" size="icon" onClick={() => {
                      const newSkills = formData.skills.filter((_, i) => i !== idx)
                      setFormData({...formData, skills: newSkills})
                    }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" onClick={() => {
                  setFormData({...formData, skills: [...formData.skills, { name: "", proficiency: 50 }]})
                }}>
                  <Plus className="w-4 h-4" /> Add Skill
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {formData.projects.map((project, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6 space-y-4">
                    <Input
                      value={project.title}
                      onChange={e => {
                        const newProjects = [...formData.projects]
                        newProjects[idx] = { ...newProjects[idx], title: e.target.value }
                        setFormData({...formData, projects: newProjects})
                      }}
                      placeholder="Project Title"
                      className="font-bold"
                    />
                    <Textarea
                      value={project.description}
                      onChange={e => {
                        const newProjects = [...formData.projects]
                        newProjects[idx] = { ...newProjects[idx], description: e.target.value }
                        setFormData({...formData, projects: newProjects})
                      }}
                      placeholder="Description"
                      className="text-sm"
                    />
                    <Input
                      value={project.tech.join(", ")}
                      onChange={e => {
                        const newProjects = [...formData.projects]
                        newProjects[idx] = { ...newProjects[idx], tech: e.target.value.split(",").map(t => t.trim()) }
                        setFormData({...formData, projects: newProjects})
                      }}
                      placeholder="Tech stack (comma-separated)"
                      className="text-xs"
                    />
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5"><Globe className="w-3 h-3" /> Project Image URL</label>
                      <Input
                        value={project.image}
                        onChange={e => {
                          const newProjects = [...formData.projects]
                          newProjects[idx] = { ...newProjects[idx], image: e.target.value }
                          setFormData({...formData, projects: newProjects})
                        }}
                        placeholder="https://your-image.com/screenshot.png"
                        className="text-xs"
                      />
                      {project.image && project.image !== "" && (
                        <div className="mt-2 rounded-lg overflow-hidden border aspect-video bg-muted">
                          <img
                            src={project.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5"><Globe className="w-3 h-3" /> Live Demo / Project Link</label>
                      <Input
                        value={project.link}
                        onChange={e => {
                          const newProjects = [...formData.projects]
                          newProjects[idx] = { ...newProjects[idx], link: e.target.value }
                          setFormData({...formData, projects: newProjects})
                        }}
                        placeholder="https://your-project.com"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5"><Globe className="w-3 h-3" /> GitHub Repository Link</label>
                      <Input
                        value={project.github}
                        onChange={e => {
                          const newProjects = [...formData.projects]
                          newProjects[idx] = { ...newProjects[idx], github: e.target.value }
                          setFormData({...formData, projects: newProjects})
                        }}
                        placeholder="https://github.com/username/repo"
                        className="text-xs"
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-muted-foreground">{project.tech.join(", ")}</span>
                      <Button variant="ghost" size="icon" onClick={() => {
                        const newProjects = formData.projects.filter((_, i) => i !== idx)
                        setFormData({...formData, projects: newProjects})
                      }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="h-full border-dashed border-2 flex flex-col gap-2 p-12 hover:bg-muted/50" onClick={() => {
                setFormData({...formData, projects: [...formData.projects, { title: "New Project", description: "", tech: [], link: "#", github: "#", image: "https://picsum.photos/600/400" }]})
              }}>
                <Plus className="w-8 h-8" />
                <span>Add New Project</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 border rounded-xl space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input value={exp.title} onChange={e => {
                        const newExp = [...formData.experience]
                        newExp[idx] = { ...newExp[idx], title: e.target.value }
                        setFormData({...formData, experience: newExp})
                      }} placeholder="Role" />
                      <Input value={exp.company} onChange={e => {
                        const newExp = [...formData.experience]
                        newExp[idx] = { ...newExp[idx], company: e.target.value }
                        setFormData({...formData, experience: newExp})
                      }} placeholder="Company" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input value={exp.period} onChange={e => {
                        const newExp = [...formData.experience]
                        newExp[idx] = { ...newExp[idx], period: e.target.value }
                        setFormData({...formData, experience: newExp})
                      }} placeholder="Period (e.g., 2023 - Present)" />
                      <Input value={exp.location} onChange={e => {
                        const newExp = [...formData.experience]
                        newExp[idx] = { ...newExp[idx], location: e.target.value }
                        setFormData({...formData, experience: newExp})
                      }} placeholder="Location (e.g., Remote)" />
                    </div>
                    <Textarea value={exp.description} onChange={e => {
                      const newExp = [...formData.experience]
                      newExp[idx] = { ...newExp[idx], description: e.target.value }
                      setFormData({...formData, experience: newExp})
                    }} placeholder="Summary" className="text-sm" />
                    <Button variant="ghost" className="w-full text-destructive" onClick={() => {
                      const newExp = formData.experience.filter((_, i) => i !== idx)
                      setFormData({...formData, experience: newExp})
                    }}>Remove</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" onClick={() => {
                  setFormData({...formData, experience: [...formData.experience, { title: "", company: "", period: "", location: "", description: "", achievements: [] }]})
                }}>
                  <Plus className="w-4 h-4" /> Add Experience
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.education.map((edu, idx) => (
                  <div key={idx} className="p-4 border rounded-xl space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input value={edu.degree} onChange={e => {
                        const newEdu = [...formData.education]
                        newEdu[idx] = { ...newEdu[idx], degree: e.target.value }
                        setFormData({...formData, education: newEdu})
                      }} placeholder="Degree (e.g., B.E. Information Technology)" />
                      <Input value={edu.university} onChange={e => {
                        const newEdu = [...formData.education]
                        newEdu[idx] = { ...newEdu[idx], university: e.target.value }
                        setFormData({...formData, education: newEdu})
                      }} placeholder="University" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input value={edu.duration} onChange={e => {
                        const newEdu = [...formData.education]
                        newEdu[idx] = { ...newEdu[idx], duration: e.target.value }
                        setFormData({...formData, education: newEdu})
                      }} placeholder="Duration (e.g., 2018 - 2022)" />
                      <Input value={edu.details.join(", ")} onChange={e => {
                        const newEdu = [...formData.education]
                        newEdu[idx] = { ...newEdu[idx], details: e.target.value.split(",").map(d => d.trim()) }
                        setFormData({...formData, education: newEdu})
                      }} placeholder="Details (comma separated, e.g., Data Mining, AI/ML)" />
                    </div>
                    <Button variant="ghost" className="w-full text-destructive" onClick={() => {
                      const newEdu = formData.education.filter((_, i) => i !== idx)
                      setFormData({...formData, education: newEdu})
                    }}>Remove</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" onClick={() => {
                  setFormData({...formData, education: [...formData.education, { degree: "", university: "", duration: "", details: [] }]})
                }}>
                  <Plus className="w-4 h-4" /> Add Education
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Certificates & Achievements</CardTitle>
                <CardDescription>Add your certifications, courses, and achievements here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.certificates || []).map((cert, idx) => (
                  <div key={idx} className="p-4 border rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Certificate Title</label>
                        <Input
                          value={cert.title}
                          onChange={e => {
                            const newCerts = [...(formData.certificates || [])]
                            newCerts[idx] = { ...newCerts[idx], title: e.target.value }
                            setFormData({ ...formData, certificates: newCerts })
                          }}
                          placeholder="e.g. Python for Data Science"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Issuer / Platform</label>
                        <Input
                          value={cert.issuer}
                          onChange={e => {
                            const newCerts = [...(formData.certificates || [])]
                            newCerts[idx] = { ...newCerts[idx], issuer: e.target.value }
                            setFormData({ ...formData, certificates: newCerts })
                          }}
                          placeholder="e.g. Coursera, Udemy, Google"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Date / Year</label>
                        <Input
                          value={cert.date}
                          onChange={e => {
                            const newCerts = [...(formData.certificates || [])]
                            newCerts[idx] = { ...newCerts[idx], date: e.target.value }
                            setFormData({ ...formData, certificates: newCerts })
                          }}
                          placeholder="e.g. 2023 or Jun 2023"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Certificate Link</label>
                        <Input
                          value={cert.link}
                          onChange={e => {
                            const newCerts = [...(formData.certificates || [])]
                            newCerts[idx] = { ...newCerts[idx], link: e.target.value }
                            setFormData({ ...formData, certificates: newCerts })
                          }}
                          placeholder="https://coursera.org/verify/..."
                        />
                      </div>
                    </div>
                    {/* Image URL field with live preview */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                        <Globe className="w-3 h-3" /> Certificate Image / Badge URL
                      </label>
                      <Input
                        value={cert.image || ''}
                        onChange={e => {
                          const newCerts = [...(formData.certificates || [])]
                          newCerts[idx] = { ...newCerts[idx], image: e.target.value }
                          setFormData({ ...formData, certificates: newCerts })
                        }}
                        placeholder="https://your-image.com/certificate.png"
                        className="text-xs"
                      />
                      {cert.image && cert.image !== '' && (
                        <div className="mt-2 rounded-lg overflow-hidden border aspect-video bg-muted">
                          <img
                            src={cert.image}
                            alt="Certificate Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" className="w-full text-destructive" onClick={() => {
                      const newCerts = (formData.certificates || []).filter((_, i) => i !== idx)
                      setFormData({ ...formData, certificates: newCerts })
                    }}>Remove Certificate</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2" onClick={() => {
                  setFormData({
                    ...formData,
                    certificates: [...(formData.certificates || []), { title: "", issuer: "", date: "", link: "", image: "" }]
                  })
                }}>
                  <Plus className="w-4 h-4" /> Add Certificate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update your public contact details. These are shown in the Contact section and footer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold">Email Address</label>
                    <Input
                      value={formData.contact.email}
                      onChange={e => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold">Phone Number</label>
                    <Input
                      value={formData.contact.phone}
                      onChange={e => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold">LinkedIn Profile URL</label>
                  <Input
                    value={formData.contact.linkedin}
                    onChange={e => setFormData({ ...formData, contact: { ...formData.contact, linkedin: e.target.value } })}
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold">GitHub Profile URL</label>
                  <Input
                    value={formData.contact.github}
                    onChange={e => setFormData({ ...formData, contact: { ...formData.contact, github: e.target.value } })}
                    placeholder="github.com/yourusername"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold">LeetCode Profile URL</label>
                  <Input
                    value={formData.contact.leetcode}
                    onChange={e => setFormData({ ...formData, contact: { ...formData.contact, leetcode: e.target.value } })}
                    placeholder="leetcode.com/u/yourusername"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-headline flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-primary" /> Contact Messages
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{messages.length} message{messages.length !== 1 ? 's' : ''} received</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => fetchMessages(password)} disabled={isFetchingMessages}>
                {isFetchingMessages ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                Refresh
              </Button>
            </div>

            {isFetchingMessages ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-xl border-dashed">
                <MailOpen className="w-12 h-12 mb-4 opacity-30" />
                <p className="font-semibold">No messages yet</p>
                <p className="text-sm mt-1">Messages from your contact form will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <Card key={idx} className="border-border/60">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                              {msg.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{msg.name}</p>
                              <a href={`mailto:${msg.email}`} className="text-xs text-primary hover:underline">{msg.email}</a>
                            </div>
                            <span className="ml-auto text-[10px] text-muted-foreground">
                              {new Date(msg.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed pl-12 border-l-2 border-muted ml-4">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
