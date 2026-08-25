import { ShieldCheck } from "lucide-react"

export default function TermsOfService() {
    const lastUpdated = "May 17, 2026"; // Using a fixed recent date to look professional

    return (
        <main className="flex-1 bg-background">
            {/* Header Area */}
            <div className="bg-primary/5 py-16 md:py-24 border-b border-border/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="container px-4 md:px-8 mx-auto flex flex-col items-center text-center relative z-10">
                    <div className="h-16 w-16 bg-primary/10 flex items-center justify-center rounded-2xl rotate-3 mb-6 shadow-sm">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-foreground">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="container px-4 md:px-8 mx-auto py-16 max-w-3xl">
                <div className="space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            By accessing and using the FixForce / Book A Fixer platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to update these terms at any time.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Description of Service</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            FixForce acts as a marketplace that connects users seeking home repair services (&quot;Customers&quot;) with independent professionals (&quot;Tradespeople&quot; or &quot;Fixers&quot;). We do not directly provide the repair services ourselves but facilitate the booking and payment process.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. User Obligations</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            As a user, you agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account.
                        </p>
                        <ul className="list-disc list-outside ml-6 text-muted-foreground text-lg space-y-2">
                            <li>You must be at least 18 years old to use the platform.</li>
                            <li>You agree not to use the platform for any illegal or unauthorized purpose.</li>
                            <li>You agree to treat all tradespeople with respect and provide a safe working environment.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. AI Matching Feature</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Our platform utilizes Artificial Intelligence (AI) to recommend tradespeople based on the problem description you provide. While we strive for accuracy, FixForce does not guarantee that the AI will always provide a perfect match, and the final decision to book a professional rests entirely with you.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Payments and Fees</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            All payments for services booked through FixForce must be processed through our secure payment gateway. We charge a small service fee on each transaction to maintain the platform, which is clearly displayed before you confirm a booking.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
