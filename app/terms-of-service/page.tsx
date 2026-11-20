import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"

import {
  LegalList,
  LegalPage,
  LegalSection,
  LegalText,
} from "@/components/legal/LegalPage"
import { SUPPORT_EMAIL } from "@/lib/contact"

export const metadata: Metadata = {
  title: "Terms of Service | Book A Fixer",
  description:
    "The terms you agree to when you use Book A Fixer to find or offer repair work.",
}

export default function TermsOfService() {
  return (
    <LegalPage
      icon={<ShieldCheck className="h-8 w-8 text-primary" />}
      title="Terms of Service"
      lastUpdated="November 19, 2026"
    >
      <LegalSection title="1. Acceptance of these terms">
        <LegalText>
          By using Book A Fixer you agree to these terms. If you do not agree to them, please do
          not use the platform. We may update these terms, and we will change the date at the
          top of this page when we do.
        </LegalText>
      </LegalSection>

      <LegalSection title="2. What Book A Fixer is, and what it is not">
        <LegalText>
          Book A Fixer is an introduction service. We list independent tradespeople and small
          trade companies, and we pass your booking request to the one you choose.
        </LegalText>
        <LegalText>
          We do not carry out repair work. Tradespeople on the platform are not our employees,
          agents or subcontractors — they work for themselves. The agreement to do a job, and
          the price of it, is between you and them.
        </LegalText>
      </LegalSection>

      <LegalSection title="3. Your account">
        <LegalText>
          You agree to give accurate information when you register and to keep your password to
          yourself. You are responsible for what happens under your account.
        </LegalText>
        <LegalList>
          <li>You must be at least 18 years old to use the platform.</li>
          <li>You agree not to use the platform for any unlawful purpose.</li>
          <li>
            If you are booking work, you agree to give the tradesperson a safe place to work and
            to treat them with respect.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Booking requests">
        <LegalText>
          Sending a booking request is a request, not a confirmed job. The tradesperson can
          accept it or decline it, and nothing is agreed until they accept.
        </LegalText>
        <LegalText>
          You can cancel a request while it is still pending, and you can cancel an accepted job
          up until the tradesperson marks it as started. Once work is in progress, only the
          tradesperson can close it out. If you need to call off a job that has already begun,
          arrange it with them directly.
        </LegalText>
      </LegalSection>

      <LegalSection title="5. Prices and payment">
        <LegalText>
          Hourly rates shown on a listing are set by the tradesperson and are a starting rate,
          not a quote for your job. The final price is whatever you agree with them.
        </LegalText>
        <LegalText>
          Book A Fixer does not process payments. You pay the tradesperson directly, and we take
          no part of what you pay and no commission on the job. If we add payments inside the
          platform in future, we will say so here before it happens.
        </LegalText>
      </LegalSection>

      <LegalSection title="6. Fees for tradespeople">
        <LegalText>
          Listing your business on Book A Fixer is currently free, and so is receiving booking
          requests. We intend to charge a flat monthly fee for a listing once the platform is
          sending tradespeople real work. We will give notice before any charge begins, and
          nobody is billed without agreeing to it first.
        </LegalText>
      </LegalSection>

      <LegalSection title="7. Listings and the Registered Business label">
        <LegalText>
          Tradespeople are responsible for the accuracy of their own listing, including their
          trade, services and rate.
        </LegalText>
        <LegalText>
          A listing marked <strong className="text-foreground">Registered Business</strong> has
          supplied a business registration number. That number is given to us by the
          tradesperson and we do not currently check it against the central registry, so treat
          the label as a declaration they have made and not as verification by us.
        </LegalText>
        <LegalText>
          Some listings are marked <strong className="text-foreground">Example listing</strong>.
          Those are sample businesses we created to show how the marketplace works. They are not
          real companies and cannot be booked as such.
        </LegalText>
      </LegalSection>

      <LegalSection title="8. The repair assistant">
        <LegalText>
          The repair assistant uses AI to suggest which trade your problem needs, how urgent it
          looks, and what to be careful about. It is a starting point, not a professional
          diagnosis, and it does not estimate what a job will cost. It can be wrong, and the
          decision about who to book is yours.
        </LegalText>
        <LegalText>
          Do not rely on it in an emergency. If you smell gas, see fire or smoke, or think
          someone is in danger, contact the emergency services.
        </LegalText>
      </LegalSection>

      <LegalSection title="9. Reviews">
        <LegalText>
          A review can only be written by the customer who requested a job, about that job, and
          only after it has been marked complete. Reviews must describe your own experience. We
          may remove a review that is abusive, discloses someone&apos;s personal details, or is
          not about work actually done.
        </LegalText>
      </LegalSection>

      <LegalSection title="10. Our responsibility">
        <LegalText>
          Because we introduce you to a tradesperson rather than carry out the work, we are not
          responsible for the quality, timeliness or safety of what they do, and we do not
          guarantee that any tradesperson will accept your request. Your agreement about the
          work is with them.
        </LegalText>
        <LegalText>
          We also do not promise that the platform will always be available or free of faults.
          Nothing in these terms limits any right you have under the consumer protection law of
          North Macedonia.
        </LegalText>
      </LegalSection>

      <LegalSection title="11. Getting in touch">
        <LegalText>
          {SUPPORT_EMAIL ? (
            <>
              Questions about these terms can go to{" "}
              <a className="text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
              .
            </>
          ) : (
            <>
              We have not published a contact address yet. One will be added here before the
              platform is opened to the public.
            </>
          )}
        </LegalText>
      </LegalSection>
    </LegalPage>
  )
}
