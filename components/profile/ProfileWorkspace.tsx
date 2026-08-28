"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { LoadingState } from "@/components/LoadingState"
import { StatusBanner } from "@/components/StatusBanner"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/hooks/use-profile"

import { ClientProfileForm } from "./ClientProfileForm"
import { ProfileHeader } from "./ProfileHeader"
import { WorkerCardPreview } from "./WorkerCardPreview"
import { WorkerProfileForm } from "./WorkerProfileForm"

export function ProfileWorkspace() {
  const {
    loading,
    saving,
    status,
    role,
    workerId,
    isVerified,
    activeTab,
    setActiveTab,
    clientForm,
    setClientField,
    saveClientProfile,
    workerForm,
    setWorkerField,
    addService,
    removeService,
    saveWorkerProfile,
  } = useProfile()

  if (loading) {
    return <LoadingState label="Loading profile..." />
  }

  const showLiveProfileAction = activeTab === "worker" && status?.type === "success"

  return (
    <div className="flex-1 container max-w-5xl mx-auto px-4 py-10 md:py-16">
      <ProfileHeader role={role} activeTab={activeTab} onTabChange={setActiveTab} />

      {status && (
        <StatusBanner
          variant={status.type}
          className="mb-8"
          action={
            showLiveProfileAction ? (
              <Button
                asChild
                size="sm"
                className="bg-[#1a7a4a] text-white font-bold rounded-xl gap-1.5 shadow-sm"
              >
                <Link href={`/book/${workerId}`} target="_blank">
                  <ExternalLink size={14} /> View Live Profile
                </Link>
              </Button>
            ) : undefined
          }
        >
          {status.text}
        </StatusBanner>
      )}

      {activeTab === "client" ? (
        <ClientProfileForm
          form={clientForm}
          onChange={setClientField}
          saving={saving}
          onSubmit={saveClientProfile}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <WorkerProfileForm
            form={workerForm}
            onChange={setWorkerField}
            onAddService={addService}
            onRemoveService={removeService}
            saving={saving}
            workerId={workerId}
            onSubmit={saveWorkerProfile}
          />
          <WorkerCardPreview form={workerForm} workerId={workerId} isVerified={isVerified} />
        </div>
      )}
    </div>
  )
}
