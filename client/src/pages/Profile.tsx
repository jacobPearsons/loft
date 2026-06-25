import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, BookOpen, Award, Save, Loader2, Camera, Briefcase, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton'
import { useAuth } from '@/providers/AuthProvider'
import { useProfile } from '@/lib/api-hooks'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import api from '@/lib/api'
import { toast } from 'sonner'

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
}

const defaultQuestions: QuizQuestion[] = [
  { question: 'What is the correct way to say "I am a student" in English?', options: ['I am student', 'I am a student', 'I am the student', 'Am I student'], correct: 1 },
  { question: 'Which sentence is grammatically correct?', options: ['He go to school', 'He goes to school', 'He going to school', 'He go school'], correct: 1 },
  { question: 'Choose the correct preposition: "I am interested ___ learning English."', options: ['on', 'at', 'in', 'for'], correct: 2 },
  { question: 'What does "quickly" describe in: "She runs quickly"?', options: ['The subject', 'The verb', 'The object', 'The noun'], correct: 1 },
  { question: 'Which is the correct past tense of "to eat"?', options: ['eated', 'ate', 'eat', 'eaten'], correct: 1 },
]

export default function Profile() {
  const { user } = useAuth()
  const reduced = useReducedMotion()
  const { profile, setProfile, loading } = useProfile(user?.email)

  const [saving, setSaving] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [init, setInit] = useState(false)

  const [quizState, setQuizState] = useState<'idle' | 'active' | 'completed'>('idle')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    if (profile && !init) {
      const p = profile.profile || profile
      setFirstName(profile.firstName || p.firstName || '')
      setLastName(profile.lastName || p.lastName || '')
      setPhone(profile.phone || p.phone || '')
      setBio(p.summary || p.bio || '')
      setSkillsInput((p.skills || profile.skills || []).join(', '))
      setInit(true)
    }
  }, [profile, init])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await api.patch('/users/profile', {
        email: user?.email,
        firstName,
        lastName,
        phone,
        summary: bio,
        skills: skillsInput.split(',').map((s: string) => s.trim()).filter(Boolean),
      })
      setProfile(res.data?.user || res.data)
      toast.success('Profile saved')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        await api.patch('/users/profile', {
          email: user?.email,
          profileImage: reader.result as string,
        })
        setProfile((p: any) => ({ ...p, profileImage: reader.result }))
        toast.success('Photo updated')
      } catch {
        toast.error('Failed to upload')
      }
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setProfile((p: any) => ({ ...p, profileImage: null }))
  }

  function startQuiz() {
    setQuizState('active')
    setCurrentQuestion(0)
    setAnswers([])
    setScore(null)
  }

  function answerQuestion(index: number) {
    const next = [...answers, index]
    setAnswers(next)
    if (currentQuestion < defaultQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const correct = next.filter((a, i) => a === defaultQuestions[i].correct).length
      setScore(correct)
      setQuizState('completed')
    }
  }

  if (loading) {
    return (
        <ProfileSkeleton />
    )
  }

  return (
      <div className="container px-4 md:px-6 py-16 sm:py-20 max-w-4xl mx-auto">
        <motion.div initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <User className="h-6 w-6 text-emerald-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">My Profile</h1>
              <p className="text-sm text-neutral-400 mt-1">Manage your personal information and skills</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-4 overflow-hidden">
                    {profile?.profileImage ? (
                      <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-emerald-400" />
                    )}
                  </div>
                  <Label htmlFor="profile-image" className="cursor-pointer">
                    <Button variant="outline" size="sm" className="border-white/10" asChild>
                      <span>Upload Photo</span>
                    </Button>
                    <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </Label>
                  {profile?.profileImage && (
                    <Button variant="ghost" size="sm" className="text-red-400 mt-2" onClick={handleRemoveImage}>
                      <Trash2 className="h-3 w-3 mr-1" /> Remove
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Award className="h-4 w-4 text-emerald-400" />
                    English Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quizState === 'idle' && (
                    <div className="text-center">
                      <p className="text-sm text-neutral-400 mb-4">Take a quick English proficiency test</p>
                      <Button onClick={startQuiz} className="bg-emerald-600 hover:bg-emerald-700">
                        <BookOpen className="h-4 w-4 mr-2" /> Start Quiz
                      </Button>
                    </div>
                  )}
                  {quizState === 'active' && (
                    <div className="space-y-4">
                      <Progress value={(currentQuestion / defaultQuestions.length) * 100} />
                      <p className="text-xs text-neutral-500 text-right">
                        {currentQuestion + 1} of {defaultQuestions.length}
                      </p>
                      <p className="text-sm text-white font-medium">{defaultQuestions[currentQuestion].question}</p>
                      <div className="space-y-2">
                        {defaultQuestions[currentQuestion].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => answerQuestion(i)}
                            className="w-full text-left p-3 rounded-lg border border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-white/10 transition-all text-sm text-neutral-300 min-h-[44px]"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {quizState === 'completed' && score !== null && (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                        {score >= 3 ? (
                          <CheckCircle className="h-8 w-8 text-emerald-400" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-400" />
                        )}
                      </div>
                      <p className="text-2xl font-bold text-white mb-1">{score}/{defaultQuestions.length}</p>
                      <p className="text-sm text-neutral-400 mb-4">
                        {score >= 4 ? 'Excellent English proficiency!' : score >= 3 ? 'Good, keep practicing!' : 'Keep learning, you will improve!'}
                      </p>
                      <Button variant="outline" onClick={startQuiz} className="border-white/10">
                        Retake Quiz
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4 text-emerald-400" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user?.email || ''} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Skills (comma separated)</Label>
                    <Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="React, TypeScript, Node.js" />
                  </div>
                  <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {skillsInput && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Briefcase className="h-4 w-4 text-emerald-400" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skillsInput.split(',').map((s, i) => (
                        <Badge key={i} variant="default">{s.trim()}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
  )
}
