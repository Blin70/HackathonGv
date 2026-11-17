import type { Metadata } from "next"
import { ProfileWorkspace } from "@/components/profile/ProfileWorkspace"

export const metadata: Metadata = {
  title: "Your profile | Book A Fixer",
  description:
    "Manage your Book A Fixer account, contact details and public listing.",
}

export default function ProfilePage() {
  return <ProfileWorkspace />
}
