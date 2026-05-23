'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  FileText, 
  MapPin, 
  Briefcase,
  Languages,
  CheckCircle,
  AlertCircle,
  Play,
  Award,
  ArrowLeft,
  Send,
  Loader2,
  Save
} from 'lucide-react'
import Link from 'next/link'
import { submitProfile } from '../profile/_actions/submit-profile'
import { EmailVerificationBanner } from '@/components/global/email-verification-banner'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  country: string
  nationality: string
  jobTitle: string
  summary: string
  skills: string[]
  experienceYears: number
  expectedSalary: string
  remoteWork: boolean
  relocate: boolean
}

interface EnglishTestState {
  hasTakenTest: boolean
  score: number
  level: string
  testDate: Date | null
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const email = session?.user?.email || ''

  const [emailVerified, setEmailVerified] = useState(true)

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    nationality: '',
    jobTitle: '',
    summary: '',
    skills: [],
    experienceYears: 0,
    expectedSalary: '',
    remoteWork: false,
    relocate: false,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const [resume, setResume] = useState<{
    name: string
    size: number
    uploaded: boolean
    url: string | null
  } | null>(null)

  const [englishTest, setEnglishTest] = useState<EnglishTestState>({
    hasTakenTest: false,
    score: 0,
    level: 'Not Taken',
    testDate: null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newSkill, setNewSkill] = useState('')

  const fetchProfile = useCallback(async () => {
    if (!email) return
    try {
      setLoading(true)
      const res = await fetch(`/api/users/profile?email=${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error('Failed to fetch profile')
      const user = await res.json()

      if (typeof user.emailVerified === 'boolean') {
        setEmailVerified(user.emailVerified)
      }

      const dob = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
      const skills = user.profile?.skillsRelation
        ? user.profile.skillsRelation.map((s: { skill: { name: string } }) => s.skill.name)
        : user.profile?.skills || []

      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: dob,
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        nationality: user.nationality || '',
        jobTitle: user.profile?.jobTitle || '',
        summary: user.profile?.summary || '',
        skills,
        experienceYears: user.profile?.experienceYears || 0,
        expectedSalary: user.profile?.expectedSalary || '',
        remoteWork: user.profile?.remoteWork || false,
        relocate: user.profile?.relocate || false,
      })

      if (user.resume) {
        setResume({
          name: user.resume.fileName,
          size: user.resume.fileSize,
          uploaded: user.resume.isUploaded,
          url: user.resume.fileUrl,
        })
      }

      if (user.englishTestScore !== null) {
        const levels = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced']
        setEnglishTest({
          hasTakenTest: true,
          score: user.englishTestScore,
          level: user.englishTestLevel || levels[Math.min(4, Math.floor(user.englishTestScore / 20))],
          testDate: user.englishTestDate ? new Date(user.englishTestDate) : null,
        })
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }, [email])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSaveProfile = async () => {
    if (!email) return
    setSaving(true)
    setSaveMessage('')
    try {
      const payload = {
        ...profileData,
        expectedSalary: profileData.expectedSalary || undefined,
        englishTestScore: englishTest.hasTakenTest ? englishTest.score : undefined,
        englishTestLevel: englishTest.hasTakenTest ? englishTest.level : undefined,
        englishTestDate: englishTest.testDate?.toISOString(),
      }
      const res = await fetch(`/api/users/profile?email=${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaveMessage('Profile saved successfully!')
    } catch (err) {
      setSaveMessage('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !email) return

    setResume({
      name: file.name,
      size: file.size,
      uploaded: false,
      url: null,
    })

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`/api/users/resume?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setResume({
        name: data.resume.fileName,
        size: file.size,
        uploaded: true,
        url: data.resume.fileUrl,
      })
    } catch {
      setResume(null)
    }
  }

  const handleAddSkill = () => {
    if (newSkill && !profileData.skills.includes(newSkill)) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill],
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(s => s !== skill),
    })
  }

  // English proficiency test
  const testQuestions = [
    {
      id: 1,
      question: "What is the correct form of the verb? 'She _____ to the store yesterday.'",
      options: ['go', 'goes', 'went', 'gone'],
      correctAnswer: 'went',
      category: 'Grammar',
    },
    {
      id: 2,
      question: 'Choose the correct spelling:',
      options: ['Accomodate', 'Accommodate', 'Acommodate', 'Acomodate'],
      correctAnswer: 'Accommodate',
      category: 'Vocabulary',
    },
    {
      id: 3,
      question: 'Select the correct sentence:',
      options: [
        'Me and him went to the store.',
        'Him and I went to the store.',
        'He and I went to the store.',
        'Me and he went to the store.',
      ],
      correctAnswer: 'He and I went to the store.',
      category: 'Grammar',
    },
    {
      id: 4,
      question: "What does 'ubiquitous' mean?",
      options: ['Rare', 'Everywhere', 'Important', 'Different'],
      correctAnswer: 'Everywhere',
      category: 'Vocabulary',
    },
    {
      id: 5,
      question: "Complete the sentence: 'If I _____ more money, I would buy a new car.'",
      options: ['have', 'had', 'will have', 'would have'],
      correctAnswer: 'had',
      category: 'Grammar',
    },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [testStarted, setTestStarted] = useState(false)

  const startTest = () => {
    setTestStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer('')
  }

  const submitAnswer = () => {
    if (selectedAnswer === testQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const finishTest = () => {
    const finalScore = score + (selectedAnswer === testQuestions[currentQuestion].correctAnswer ? 1 : 0)
    const percentage = Math.round((finalScore / testQuestions.length) * 100)
    let level = 'Beginner'
    if (percentage >= 90) level = 'Advanced'
    else if (percentage >= 70) level = 'Upper Intermediate'
    else if (percentage >= 50) level = 'Intermediate'
    else if (percentage >= 30) level = 'Elementary'

    setEnglishTest({
      hasTakenTest: true,
      score: percentage,
      level,
      testDate: new Date(),
    })

    // Auto-save english test results
    if (email) {
      fetch(`/api/users/profile?email=${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          englishTestScore: percentage,
          englishTestLevel: level,
          englishTestDate: new Date().toISOString(),
        }),
      }).catch(console.error)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowResult(false)
      setSelectedAnswer('')
    } else {
      finishTest()
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Advanced': return 'bg-emerald-500'
      case 'Upper Intermediate': return 'bg-blue-500'
      case 'Intermediate': return 'bg-yellow-500'
      case 'Elementary': return 'bg-orange-500'
      default: return 'bg-red-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-4xl mx-auto">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-muted-foreground hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <EmailVerificationBanner
          email={email}
          isVerified={emailVerified}
        />
        
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600">Profile</TabsTrigger>
            <TabsTrigger value="resume" className="data-[state=active]:bg-emerald-600">Resume</TabsTrigger>
            <TabsTrigger value="test" className="data-[state=active]:bg-emerald-600">English Test</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-card border">
              <CardHeader>
                <CardTitle className="text-foreground">Personal Information</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Fill in your personal details to help employers find you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {saveMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    saveMessage.includes('success') 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    {saveMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">First Name</label>
                    <Input 
                      placeholder="John"
                      className="bg-muted border text-foreground"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Last Name</label>
                    <Input 
                      placeholder="Doe"
                      className="bg-muted border text-foreground"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                    <Input 
                      type="email"
                      placeholder="john@example.com"
                      className="bg-muted border text-foreground"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Phone</label>
                    <Input 
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="bg-muted border text-foreground"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Date of Birth</label>
                    <Input 
                      type="date"
                      className="bg-muted border text-foreground"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Nationality</label>
                    <Input 
                      placeholder="American"
                      className="bg-muted border text-foreground"
                      value={profileData.nationality}
                      onChange={(e) => setProfileData({...profileData, nationality: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Address</label>
                      <Input 
                        placeholder="123 Main St"
                        className="bg-muted border text-foreground"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">City</label>
                      <Input 
                        placeholder="New York"
                        className="bg-muted border text-foreground"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Country</label>
                      <Input 
                        placeholder="USA"
                        className="bg-muted border text-foreground"
                        value={profileData.country}
                        onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Job Title</label>
                      <Input 
                        placeholder="Software Engineer"
                        className="bg-muted border text-foreground"
                        value={profileData.jobTitle}
                        onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Years of Experience</label>
                      <Input 
                        type="number"
                        placeholder="5"
                        className="bg-muted border text-foreground"
                        value={profileData.experienceYears}
                        onChange={(e) => setProfileData({...profileData, experienceYears: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-muted-foreground mb-2 block">Professional Summary</label>
                      <textarea 
                        placeholder="Tell us about yourself..."
                        className="w-full h-32 bg-muted border text-foreground rounded-md p-3"
                        value={profileData.summary}
                        onChange={(e) => setProfileData({...profileData, summary: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profileData.skills.map((skill) => (
                      <Badge key={skill} className="bg-emerald-500/20 text-emerald-400 px-3 py-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-2 text-xs p-1.5">×</button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a skill"
                      className="bg-muted border text-foreground"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill} className="bg-emerald-600">Add</Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 w-full"
                >
                  {saving ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" /> Save Profile</>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-emerald-500/50 mt-6">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Send className="h-5 w-5 text-emerald-400" />
                  Submit Profile to Company
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Send your complete profile to hiring.pathmatch@gmail.com for review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitMessage && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    submitMessage.includes('success') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {submitMessage}
                  </div>
                )}
                <Button 
                  onClick={async () => {
                    setIsSubmitting(true)
                    setSubmitMessage('')
                    const result = await submitProfile(profileData, englishTest.hasTakenTest ? {
                      score: englishTest.score,
                      level: englishTest.level,
                      completedAt: englishTest.testDate || new Date(),
                    } : undefined)
                    if (result.success) {
                      setSubmitMessage('✓ Profile submitted successfully! The company will review your application.')
                    } else {
                      setSubmitMessage('✗ Failed to submit profile. Please try again.')
                    }
                    setIsSubmitting(false)
                  }}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Profile to Company'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Resume Tab */}
          <TabsContent value="resume">
            <Card className="bg-card border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload Resume
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Upload your resume in PDF format (max 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                
                {!resume ? (
                  <div 
                    className="border-2 border-dashed border rounded-lg p-12 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                    onClick={handleFileUpload}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground mb-2">Click to upload your resume</p>
                    <p className="text-muted-foreground text-sm">PDF only (max 5MB)</p>
                  </div>
                ) : (
                  <div className="border border rounded-lg p-6">
                    <div className="flex items-center gap-4">
                      <FileText className="h-10 w-10 text-emerald-400" />
                      <div className="flex-1">
                        <p className="text-foreground font-medium">{resume.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {(resume.size / 1024).toFixed(2)} KB
                          {!resume.uploaded && ' — uploading...'}
                        </p>
                      </div>
                      {resume.uploaded ? (
                        <CheckCircle className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        className="border"
                        onClick={handleFileUpload}
                      >
                        Replace
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* English Proficiency Test Tab */}
          <TabsContent value="test">
            <Card className="bg-card border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  English Proficiency Test
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Take our English proficiency test to showcase your language skills to employers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {englishTest.hasTakenTest && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Your Results</h3>
                      <Badge className={`${getLevelColor(englishTest.level)} text-white`}>
                        {englishTest.level}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm">Score</p>
                        <p className="text-2xl font-bold text-foreground">{englishTest.score}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Test Date</p>
                        <p className="text-foreground">{englishTest.testDate?.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!testStarted ? (
                  <div className="text-center py-8">
                    <Award className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Test Your English?</h3>
                    <p className="text-muted-foreground mb-6">
                      This test will assess your grammar and vocabulary skills. 
                      It takes about 5 minutes to complete.
                    </p>
                    <Button 
                      onClick={startTest}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Test
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-muted-foreground">
                        Question {currentQuestion + 1} of {testQuestions.length}
                      </p>
                      <Badge variant="outline" className="border">
                        {testQuestions[currentQuestion].category}
                      </Badge>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg text-foreground mb-4">
                        {testQuestions[currentQuestion].question}
                      </h3>
                      <div className="space-y-2">
                        {testQuestions[currentQuestion].options.map((option) => (
                          <button
                            key={option}
                            onClick={() => !showResult && setSelectedAnswer(option)}
                            disabled={showResult}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              showResult 
                                ? option === testQuestions[currentQuestion].correctAnswer
                                  ? 'border-emerald-500 bg-emerald-500/20 text-white'
                                  : selectedAnswer === option
                                    ? 'border-red-500 bg-red-500/20 text-white'
                                    : 'border text-muted-foreground'
                                : selectedAnswer === option
                                  ? 'border-emerald-500 bg-emerald-500/20 text-white'
                                  : 'border text-foreground hover:border-neutral-600'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {showResult && (
                      <div className={`p-4 rounded-lg mb-4 ${
                        selectedAnswer === testQuestions[currentQuestion].correctAnswer 
                          ? 'bg-emerald-500/20 border border-emerald-500' 
                          : 'bg-red-500/20 border border-red-500'
                      }`}>
                        {selectedAnswer === testQuestions[currentQuestion].correctAnswer ? (
                          <p className="text-emerald-400 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Correct!
                          </p>
                        ) : (
                          <p className="text-red-400 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Incorrect. The correct answer is: {testQuestions[currentQuestion].correctAnswer}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      {!showResult ? (
                        <Button 
                          onClick={submitAnswer}
                          disabled={!selectedAnswer}
                          className="bg-emerald-600"
                        >
                          Submit Answer
                        </Button>
                      ) : (
                        <Button 
                          onClick={nextQuestion}
                          className="bg-emerald-600"
                        >
                          {currentQuestion < testQuestions.length - 1 ? 'Next Question' : 'View Results'}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
