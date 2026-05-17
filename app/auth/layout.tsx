import { ArrowLeft } from "lucide-react"
import Link from "next/link"


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#fcfbf9] dark:bg-background relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -ml-48 -mb-48" />

      {/* Top Bar with Back Button */}
      <header className="w-full px-6 py-6 md:px-12 md:py-8 flex items-center justify-between z-10 relative">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all duration-300 bg-white/80 dark:bg-muted/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-8 py-8 md:py-12 z-10 relative">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Simplified Footer for Auth pages */}
      <footer className="w-full py-6 md:py-8 text-center text-xs text-muted-foreground z-10 relative mt-auto border-t border-border/10 bg-transparent">
        <div className="flex items-center justify-center space-x-6">
          <Link href="/terms-of-service" className="hover:text-primary transition-colors font-bold uppercase tracking-wider">
            Terms
          </Link>
          <span className="text-border/40">•</span>
          <Link href="/privacy-policy" className="hover:text-primary transition-colors font-bold uppercase tracking-wider">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  )
}