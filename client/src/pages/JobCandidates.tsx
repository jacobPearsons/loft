import { useParams, Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Users, Mail, Star, Loader2, AlertCircle } from 'lucide-react'
import { useCandidates } from '@/lib/api-hooks'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  REVIEWING: 'bg-blue-500/20 text-blue-400',
  SHORTLISTED: 'bg-purple-500/20 text-purple-400',
  INTERVIEW: 'bg-emerald-500/20 text-emerald-400',
  OFFERED: 'bg-green-500/20 text-green-400',
  HIRED: 'bg-emerald-500/20 text-emerald-400',
  REJECTED: 'bg-red-500/20 text-red-400',
}

export default function CandidatesPage() {
  const { id } = useParams<{ id: string }>()
  const { candidates, jobTitle, loading, error } = useCandidates(id)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link to="/employer/dashboard"><Button>Back to Dashboard</Button></Link>
        </div>
      </div>
    )
  }

  return (
      <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/employer/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
            <p className="text-muted-foreground mt-1">
              {jobTitle} &middot; {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 self-start sm:self-auto" variant="outline">
            <Users className="w-4 h-4 mr-1" /> {candidates.length} Total
          </Badge>
        </div>

        {candidates.length === 0 ? (
          <Card className="bg-card border">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Candidates Yet</h3>
              <p className="text-muted-foreground">Applications will appear here once candidates start applying</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="bg-card/50 border hover:border-emerald-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-emerald-400 font-bold text-lg">
                            {candidate.candidate.firstName?.[0]}{candidate.candidate.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {candidate.candidate.firstName} {candidate.candidate.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{candidate.candidate.profile?.jobTitle || 'No title'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`${statusColors[candidate.status] || ''}`}>
                          {candidate.status}
                        </Badge>
                        <Badge variant="outline" className="border text-muted-foreground">
                          <Star className="w-3 h-3 mr-1 text-yellow-400" />
                          Match: {candidate.matchScore}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Applied {new Date(candidate.appliedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Skill Match</span>
                          <span className="text-emerald-400">{candidate.matchedSkills}/{candidate.totalRequired}</span>
                        </div>
                        <Progress value={candidate.matchScore} className="h-2 bg-muted" />
                      </div>

                      {candidate.candidate.profile?.skillsRelation?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {candidate.candidate.profile.skillsRelation.map((s, i) => (
                            <Badge key={i} variant="outline" className="border text-muted-foreground text-xs">{s.skill.name}</Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <a href={`mailto:${candidate.candidate.email}`}>
                        <Button variant="outline" size="sm" className="border">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </a>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Review</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
  )
}
