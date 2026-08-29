import { TooltipProvider } from "./ui/tooltip"
import { Toaster } from "./ui/sonner"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>
            {children}
            <Toaster richColors position="top-center" />
        </TooltipProvider>
    )
}
