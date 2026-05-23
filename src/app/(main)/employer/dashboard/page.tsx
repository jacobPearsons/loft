"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Users, Building, Plus, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EmployerDashboardPage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<any[]>([])
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      Promise.all([
        fetch(`/api/companies/jobs?email=${session.user.email}`).then(r => r.json()),
        fetch(`/api/companies/profile?email=${session.user.email}`).then(r => r.json()),
      ]).then(([jobsData, companyData]) => {
        setJobs(jobsData || [])
        setCompany(companyData)
        setLoading(false)
      })
    }
  }, [session])

  const totalApplicants = jobs.reduce((acc: number, j: any) => acc + (j.applicationsCount || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Employer Dashboard</h1>
          <Link href="/jobs/create">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" /> Post Job
            </Button>
          </Link>
        </div>

        {!company && (
          <Card className="bg-card border mb-8">
            <CardContent className="p-6 text-center">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Complete your company profile to post jobs</p>
              <Link href="/employer/company">
                <Button>Create Company Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Briefcase className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{jobs.length}</p>
                  <p className="text-muted-foreground">Active Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalApplicants}</p>
                  <p className="text-muted-foreground">Total Applicants</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-muted-foreground">Hired This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs">
          <TabsList className="bg-card">
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="candidates">All Candidates</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-4">
            {jobs.length === 0 ? (
              <Card className="bg-card border">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No jobs posted yet. Post your first job to start receiving applications.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobs.map((job: any) => (
                  <Card key={job.id} className="bg-card border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-foreground font-semibold">{job.title}</h3>
                          <p className="text-muted-foreground">{job.applicationsCount || 0} applicants</p>
                        </div>
                        <Badge variant={job.status === "PUBLISHED" ? "default" : "secondary"}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link href={`/employer/jobs/${job.id}/candidates`}>
                          <Button variant="outline" size="sm">View Candidates</Button>
                        </Link>
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="ghost" size="sm">View Post</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="candidates" className="mt-4">
            <Card className="bg-card border">
              <CardContent className="p-6 text-center text-muted-foreground">
                Select a job to view candidates
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}