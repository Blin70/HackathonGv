import { Lock } from "lucide-react"

export default function PrivacyPolicy() {
    const lastUpdated = "May 17, 2026";

    return (
        <main className="flex-1 bg-background">
            {/* Header Area */}
            <div className="bg-primary/5 py-16 md:py-24 border-b border-border/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
                <div className="container px-4 md:px-8 mx-auto flex flex-col items-center text-center relative z-10">
                    <div className="h-16 w-16 bg-primary/10 flex items-center justify-center rounded-2xl -rotate-3 mb-6 shadow-sm">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-foreground">
                        Privacy Policy
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
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            At FixForce, your privacy is our priority. We collect information to provide better services to our users. This includes:
                        </p>
                        <ul className="list-disc list-outside ml-6 text-muted-foreground text-lg space-y-2">
                            <li><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, and physical address provided during registration or booking.</li>
                            <li><strong className="text-foreground">Job Details:</strong> Descriptions of your home repair issues and photos you upload for AI analysis.</li>
                            <li><strong className="text-foreground">Usage Data:</strong> Information about how you use our platform, device information, and IP addresses.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            We use the information we collect primarily to provide, maintain, and improve our services. Specifically, your data is used to:
                        </p>
                        <ul className="list-disc list-outside ml-6 text-muted-foreground text-lg space-y-2">
                            <li>Match you with the appropriate tradespeople using our AI system.</li>
                            <li>Process your payments securely.</li>
                            <li>Communicate with you regarding bookings, updates, and customer support.</li>
                            <li>Ensure the safety and security of both customers and tradespeople.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Information Sharing</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            We do not sell your personal information to third parties. We only share your information with tradespeople when you confirm a booking, providing them with your address and job details so they can fulfill the service. We may also share data with secure payment processors and legal authorities if required by law.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            We implement a variety of security measures to maintain the safety of your personal information. All sensitive data transmitted between your browser and our servers is encrypted using standard SSL/TLS technology.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            You have the right to access, update, or delete your personal information at any time through your account settings. If you wish to permanently close your account, please contact our support team.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
