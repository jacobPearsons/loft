"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Loader2 } from "lucide-react"

export default function RoleSelectionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSelectRole = async (role: "JOB_SEEKER" | "EMPLOYER") => {
    setLoading(role)
    try {
      const res = await fetch("/api/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      
      if (res.ok) {
        router.push(role === "EMPLOYER" ? "/employer/dashboard" : "/dashboard")
      } else {
        const data = await res.json()
        alert(data.message || "Error saving role")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Choose Your Role</h1>
          <p className="text-neutral-400 mt-2">Select how you want to use LoftCommunity</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="bg-neutral-900 border-neutral-800 cursor-pointer hover:border-emerald-500 transition-colors"
            onClick={() => handleSelectRole("JOB_SEEKER")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <CardTitle className="text-white">Job Seeker</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-neutral-400">
              Find your dream job, track applications, and connect with employers
            </CardContent>
          </Card>

          <Card 
            className="bg-neutral-900 border-neutral-800 cursor-pointer hover:border-emerald-500 transition-colors"
            onClick={() => handleSelectRole("EMPLOYER")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-emerald-400" />
              </div>
              <CardTitle className="text-white">Employer</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-neutral-400">
              Post jobs, find candidates, and build your team
            </CardContent>
          </Card>
        </div>

        {loading && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        )}
      </div>
    </div>
  )
}