import { CheckCircle2, Clock } from "lucide-react"

import type { Company } from "@/lib/data"

interface WorkerDetailsProps {
  company: Company
}

export function WorkerDetails({ company }: WorkerDetailsProps) {
  return (
    <>
      <section>
        <h2 className="text-2xl font-extrabold mb-4 text-foreground">About Us</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">{company.aboutUs}</p>
      </section>

      <div className="h-px w-full bg-border" />

      <section>
        <h2 className="text-2xl font-extrabold mb-4 text-foreground">Services Offered</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {company.services.map((service) => (
            <div
              key={service}
              className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-border shadow-sm"
            >
              <CheckCircle2 className="text-[#1a7a4a] mt-0.5 shrink-0" size={20} />
              <span className="font-semibold text-foreground">{service}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px w-full bg-border" />

      <section>
        <h2 className="text-2xl font-extrabold mb-4 text-foreground">Availability</h2>
        <div className="flex items-center gap-3 text-lg text-muted-foreground bg-white p-5 rounded-2xl border border-border shadow-sm inline-flex">
          <Clock className="text-[#1a7a4a]" size={24} />
          <span className="font-medium">{company.availableDays}</span>
        </div>
      </section>
    </>
  )
}
