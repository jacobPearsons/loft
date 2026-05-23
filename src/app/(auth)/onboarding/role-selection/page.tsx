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
        localStorage.removeItem('pendingOnboarding')
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,150,105,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(5,150,105,0.07)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-neutral-950"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Choose Your Role</h1>
          <p className="text-muted-foreground mt-2">Select how you want to use LoftCommunity</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="bg-card border cursor-pointer hover:border-emerald-500 transition-colors"
            onClick={() => handleSelectRole("JOB_SEEKER")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <CardTitle className="text-foreground">Job Seeker</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Find your dream job, track applications, and connect with employers
            </CardContent>
          </Card>

          <Card 
            className="bg-card border cursor-pointer hover:border-emerald-500 transition-colors"
            onClick={() => handleSelectRole("EMPLOYER")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-emerald-400" />
              </div>
              <CardTitle className="text-foreground">Employer</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
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