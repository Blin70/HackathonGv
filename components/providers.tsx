import { TooltipProvider } from "./ui/tooltip"
import { Toaster } from "./ui/sonner"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>
            {children}
            {/* The app is light-only: no ThemeProvider is mounted, so `.dark`
                never applies. Sonner's own default is "system", which would
                render dark toasts on a dark OS over an otherwise light page.
                Pin it until dark mode is actually designed. */}
            <Toaster richColors position="top-center" theme="light" />
        </TooltipProvider>
    )
}
