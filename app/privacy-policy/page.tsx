import type { Metadata } from "next"
import { Lock } from "lucide-react"

import {
  LegalList,
  LegalPage,
  LegalSection,
  LegalText,
} from "@/components/legal/LegalPage"
import { SUPPORT_EMAIL } from "@/lib/contact"

export const metadata: Metadata = {
  title: "Privacy Policy | Book A Fixer",
  description:
    "What Book A Fixer collects, why, who it is shared with, and what you can do about it.",
}

export default function PrivacyPolicy() {
  return (
    <LegalPage
      icon={<Lock className="h-8 w-8 text-primary" />}
      title="Privacy Policy"
      lastUpdated="November 19, 2026"
    >
      <LegalSection title="1. Who we are">
        <LegalText>
          Book A Fixer is a marketplace that introduces people in North Macedonia to local
          tradespeople. This policy covers the website at bookafixer.vercel.app and describes
          what we do with the information you give us. We are a small team and we are
          responsible for the data described below.
        </LegalText>
      </LegalSection>

      <LegalSection title="2. What we collect">
        <LegalText>
          We only collect what the platform needs in order to work:
        </LegalText>
        <LegalList>
          <li>
            <strong className="text-foreground">Your account:</strong> the name, email address
            and phone number you enter when you register.
          </li>
          <li>
            <strong className="text-foreground">Booking requests:</strong> your description of
            the job, the street address where the work is needed, your phone number, and the
            date and time you asked for.
          </li>
          <li>
            <strong className="text-foreground">Tradesperson listings:</strong> if you register
            as a tradesperson or company, your business name, trade, city, services, available
            days, hourly rate, profile text, banner image, and your business registration
            number if you choose to provide one.
          </li>
          <li>
            <strong className="text-foreground">The repair assistant:</strong> the description
            you type, the city you select, and any photo you attach.
          </li>
          <li>
            <strong className="text-foreground">Reviews:</strong> the rating and text you write
            about a job you booked.
          </li>
          <li>
            <strong className="text-foreground">Server logs:</strong> our hosting provider
            records standard request information, including your IP address. We use it to keep
            the repair assistant from being abused.
          </li>
        </LegalList>
        <LegalText>
          We do not run advertising or analytics trackers on this site, and we do not build a
          profile of your browsing.
        </LegalText>
      </LegalSection>

      <LegalSection title="3. Why we use it">
        <LegalText>Your information is used to:</LegalText>
        <LegalList>
          <li>Show you tradespeople in your area and pass your booking request to the one you chose.</li>
          <li>Let a tradesperson contact you about a job you requested.</li>
          <li>Run the repair assistant when you ask it something.</li>
          <li>Show reviews against the tradesperson they were written about.</li>
          <li>Keep accounts secure and prevent abuse of the platform.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Who it is shared with">
        <LegalText>
          We do not sell your personal information. It reaches four kinds of recipient, and no
          others:
        </LegalText>
        <LegalList>
          <li>
            <strong className="text-foreground">The tradesperson you book.</strong> When you
            send a booking request, they see your name, phone number, the address of the job,
            your description, and the date and time you asked for. They need all of it to turn
            up and do the work.
          </li>
          <li>
            <strong className="text-foreground">Supabase</strong>, which hosts our database and
            handles sign-in.
          </li>
          <li>
            <strong className="text-foreground">Vercel</strong>, which hosts the website.
          </li>
          <li>
            <strong className="text-foreground">OpenAI</strong>, which runs the repair
            assistant. See the next section.
          </li>
        </LegalList>
        <LegalText>
          We may also disclose information where the law requires it.
        </LegalText>
      </LegalSection>

      <LegalSection title="5. The repair assistant">
        <LegalText>
          When you use the repair assistant, the text you write, the city you selected, the rest
          of that conversation and any photo you attach are sent to OpenAI through its API so it
          can produce an assessment. We ask OpenAI not to retain those requests, and we do not
          save your uploaded photos to your account — the conversation lives in your browser
          until you leave the page.
        </LegalText>
        <LegalText>
          Because the photo leaves our systems, please do not attach pictures containing
          documents, faces or anything else you would not want sent to a third-party service.
        </LegalText>
      </LegalSection>

      <LegalSection title="6. How long we keep it">
        <LegalText>
          Your account and listing stay for as long as your account exists. A booking and its
          review are kept as the record of a job that happened, so that ratings continue to
          reflect real work. Server logs are kept for as long as our hosting provider retains
          them.
        </LegalText>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <LegalText>
          You can see and change the information on your account at any time from your profile
          page. You also have the right to ask for a copy of your data, to have it corrected,
          and to have it deleted.
        </LegalText>
        <LegalText>
          Deleting an account is not yet something you can do yourself in the app.{" "}
          {SUPPORT_EMAIL ? (
            <>
              Write to <a className="text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>{" "}
              and we will delete your account and the personal details on it.
            </>
          ) : (
            <>
              We have not published an address for these requests yet, so this is the one right
              on this page we cannot currently act on. We will add one here before the platform
              is opened to the public.
            </>
          )}
        </LegalText>
      </LegalSection>

      <LegalSection title="8. Security">
        <LegalText>
          Traffic between your browser and our servers is encrypted with TLS. Access to the
          database is controlled per-row, so one account cannot read another account&apos;s
          bookings or contact details. We are a young platform and we do not claim our security
          has been independently audited.
        </LegalText>
      </LegalSection>
    </LegalPage>
  )
}
