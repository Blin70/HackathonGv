"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Send, Bot, User, ArrowLeft, RefreshCw, Hammer, Zap, Droplets, ShieldAlert, BookOpen, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Types
type Message = {
  role: "user" | "assistant"
  text: string
  timestamp: Date
}

// Custom simple markdown formatter to output beautiful, structured HTML
function formatResponse(text: string) {
  // Replace double asterisks for bolding
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-white text-emerald-300">$1</strong>')
  
  // Format line breaks and lists
  const lines = formatted.split("\n")
  const htmlLines = lines.map((line) => {
    const trimmed = line.trim()
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return `<li class="ml-4 list-disc pl-1 text-emerald-100/90 my-1">${trimmed.substring(2)}</li>`
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)/)
      return `<li class="ml-4 list-decimal pl-1 text-emerald-100/90 my-1">${match ? match[2] : trimmed}</li>`
    }
    if (trimmed === "") {
      return '<div class="h-2"></div>'
    }
    return `<p class="leading-relaxed my-1.5">${line}</p>`
  })

  return `<div class="space-y-1">${htmlLines.join("")}</div>`
}

const SUGGESTED_PROMPTS = [
  {
    title: "Sink is Leaking",
    desc: "Emergency kitchen drain leaks",
    icon: <Droplets className="h-5 w-5 text-blue-400" />,
    prompt: "My kitchen sink is leaking heavily from the drain pipe underneath. What immediate steps should I take, and what kind of tradesman do I need?"
  },
  {
    title: "Electrical Sparking",
    desc: "Wall outlets sparking on plug-in",
    icon: <Zap className="h-5 w-5 text-yellow-400" />,
    prompt: "One of my kitchen wall outlets sparked when I plugged in the toaster, and now none of the kitchen sockets work. What is the likely issue and who should I book?"
  },
  {
    title: "Estimate Painting",
    desc: "Standard 3-bedroom interior costs",
    icon: <Hammer className="h-5 w-5 text-pink-400" />,
    prompt: "Can you give me a rough cost estimation and timeline for hiring a professional painter to paint the interior walls of a standard 3-bedroom house?"
  }
]

function ChatContainer() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt")

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am your **Book A Fixer AI Concierge**. 🛠️\n\nDescribe your home repair problem, renovation idea, or maintenance project, and I will help you diagnose the issue, estimate typical costs, and recommend the exact tradesman category you need to get the job done right!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  // Handle initial prompt from landing page
  const processedInitial = useRef(false)
  useEffect(() => {
    if (initialPrompt && !processedInitial.current) {
      processedInitial.current = true
      sendMessage(initialPrompt)
    }
  }, [initialPrompt])

  const sendMessage = async (promptText: string) => {
    const userText = promptText.trim()
    if (!userText) return

    // Clear input
    if (promptText === input) setInput("")

    // Add user message
    const userMsg: Message = {
      role: "user",
      text: userText,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local.")
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: userText
                  }
                ]
              }
            ],
            systemInstruction: {
              parts: [
                {
                  text: `You are the Book A Fixer AI Concierge, a helpful assistant built for our website 'Book A Fixer'.
Your goal is to help users diagnose home repair issues, explain options, estimate costs, and suggest the right tradesman category.
The available categories are:
- Plumber (emergency repairs, pipe fitting, bathroom installs)
- Electrician (rewiring, panels, smart home setups)
- Painter (interior & exterior painting)
- Carpenter (custom built-ins, doors, decking, structural woodwork)
- Gardener (landscaping, lawn care, planting)
- Roofer (roof repairs, full replacements, gutters, waterproofing)
- Tiler (bathroom, kitchen & floor tiling)
- HVAC (heating, cooling, ventilation, gas safety)
- Mason (stone walls, concrete, patios, brick restoration)
- Locksmith (emergency lockouts, smart locks)
- Cleaner (deep home cleaning, office cleaning)
- Flooring (laminate, hardwood, luxury vinyl)

When recommending a professional, ALWAYS suggest one of these categories and advise the user to visit our '/book' page to search and book.
Format your responses using clean Markdown structure, bold headers, and bullet points where helpful. Keep responses friendly, structured, concise, and professional.`
                }
              ]
            }
          })
        }
      )

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP Error ${response.status}`);
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to formulate a response. Please try again."

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: aiText,
          timestamp: new Date()
        }
      ])
    } catch (err: any) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `⚠️ **Error Assistant:** ${err.message || "An unexpected error occurred while contacting the AI model. Please ensure the Gemini API key is valid."}`,
          timestamp: new Date()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "Chat reset! Hello again! I am your **Book A Fixer AI Concierge**. Describe your home repair problem, and I'll help you diagnose it and choose the right tradesman category!",
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row max-w-6xl w-full mx-auto gap-6 p-4 md:p-6 select-none">
      
      {/* Sidebar: Suggestions & Platform Features */}
      <div className="w-full lg:w-80 flex flex-col gap-5 shrink-0">
        
        {/* Concierge Info Card */}
        <div className="bg-[#0b1a13] border border-emerald-900/35 rounded-3xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3.5 mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Book A Fixer AI</h2>
              <p className="text-xs text-emerald-400 font-bold">Diagnose & Match</p>
            </div>
          </div>
          <p className="text-xs text-emerald-100/50 leading-relaxed mb-4">
            Welcome to the AI Concierge! Type your home repair problem to diagnose leaks, wiring issues, estimation queries, and more in seconds.
          </p>
          <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/20 p-2.5 rounded-xl">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="h-3.5 w-3.5 fill-emerald-400" /> Powered by Gemini
            </span>
            <button 
              onClick={resetChat} 
              className="hover:rotate-180 transition-transform duration-500 p-1 rounded-md text-emerald-400 hover:bg-emerald-900/30"
              title="Reset Chat"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Suggested Diagnose Templates */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] font-black tracking-widest text-emerald-400/60 uppercase px-1">Common Diagnostics</h4>
          {SUGGESTED_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => sendMessage(item.prompt)}
              className="w-full text-left p-4 rounded-2xl bg-[#0b1a13]/85 border border-emerald-900/20 hover:border-emerald-500/30 hover:bg-[#0f241a]/95 transition-all duration-300 group shadow-md flex items-start gap-3.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-900/20 text-emerald-400 shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">{item.title}</h5>
                <p className="text-[10px] text-emerald-100/40 mt-0.5 truncate">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Navigation Card */}
        <Link 
          href="/book"
          className="mt-auto hidden lg:flex items-center justify-between p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/20 text-emerald-300 font-bold text-xs hover:bg-emerald-900/20 hover:text-white transition-all group"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-400" /> Ready to book? Go to Market
          </span>
          <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Main Chat Interface Panel */}
      <div className="flex-1 flex flex-col bg-[#0b1a13] border border-emerald-900/35 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Glow backdrop overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Chat Window Header */}
        <div className="px-6 py-4 border-b border-emerald-900/30 flex items-center justify-between z-10 bg-[#0c2017]/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 ring-2 ring-emerald-500/20">
              <Bot className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                AI Concierge <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-[10px] text-emerald-100/40">Home repair assistant & diagnostics</p>
            </div>
          </div>
          
          <Link href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/30 text-emerald-300 text-xs font-bold transition-all border border-emerald-900/30">
            <ArrowLeft className="h-3.5 w-3.5" /> Back Home
          </Link>
        </div>

        {/* Message Bubble List */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4 min-h-[400px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-start gap-3.5 max-w-[85%] select-text",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {/* Message Role Icon */}
              <div className={cn(
                "h-8.5 w-8.5 rounded-xl flex items-center justify-center shrink-0 shadow-md",
                msg.role === "user" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-emerald-950 border border-emerald-900/30 text-emerald-400"
              )}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Balloon */}
              <div className="flex flex-col gap-1.5">
                <div 
                  className={cn(
                    "px-4.5 py-3.5 rounded-2xl text-sm shadow-md",
                    msg.role === "user"
                      ? "bg-emerald-600 text-white font-medium rounded-tr-none"
                      : "bg-[#0f281e]/60 border border-emerald-900/30 text-emerald-50 rounded-tl-none leading-relaxed"
                  )}
                  dangerouslySetInnerHTML={{ __html: formatResponse(msg.text) }}
                />
                
                {/* Timestamp */}
                <span className={cn(
                  "text-[9px] text-emerald-100/30 px-1 font-semibold",
                  msg.role === "user" ? "text-right" : "text-left"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3.5 max-w-[80%] mr-auto animate-pulse">
              <div className="h-8.5 w-8.5 rounded-xl bg-emerald-950 border border-emerald-900/30 flex items-center justify-center text-emerald-400 shadow-md">
                <Bot className="h-4 w-4" />
              </div>
              <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-[#0f281e]/60 border border-emerald-900/30 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar Form */}
        <form 
          onSubmit={handleSubmit}
          className="p-4 border-t border-emerald-900/30 bg-[#0c2017]/40 backdrop-blur-md z-10 flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to diagnose plumbing, wiring, or costs..."
              disabled={loading}
              className="w-full h-13 pl-4 pr-14 bg-emerald-950/20 border-emerald-900/30 text-emerald-50 placeholder-emerald-800 focus-visible:ring-emerald-400 focus-visible:border-emerald-400/50 rounded-2xl"
            />
            
            {/* Submit Arrow button */}
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 h-10 w-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl p-0 flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="h-4.5 w-4.5 fill-white text-emerald-600" />
            </Button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default function AiPage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-[#06150f] via-[#081e14] to-[#040a07] flex flex-col py-6">
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center text-emerald-100 gap-3">
          <div className="animate-spin text-emerald-500">
            <RefreshCw className="h-8 w-8" />
          </div>
          <span className="font-extrabold text-sm tracking-wider uppercase text-emerald-500">Loading AI Concierge...</span>
        </div>
      }>
        <ChatContainer />
      </Suspense>
    </div>
  )
}
