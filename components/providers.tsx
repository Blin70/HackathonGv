import { TooltipProvider } from "./ui/tooltip"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>{children}</TooltipProvider>
    )
}