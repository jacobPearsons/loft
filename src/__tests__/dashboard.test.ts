import { isProfileComplete, calculateProfileProgress } from '@/features/dashboard/hooks/useDashboardData'

describe('isProfileComplete', () => {
  it('returns all false when user is null', () => {
    const result = isProfileComplete(null)
    expect(result).toEqual({
      basicInfo: false,
      resume: false,
      englishTest: false,
      workExperience: false,
    })
  })

  it('returns basicInfo true when firstName and lastName exist', () => {
    const user = { firstName: 'John', lastName: 'Doe' }
    const result = isProfileComplete(user as any)
    expect(result.basicInfo).toBe(true)
  })

  it('returns basicInfo false when firstName is missing', () => {
    const user = { lastName: 'Doe' }
    const result = isProfileComplete(user as any)
    expect(result.basicInfo).toBe(false)
  })

  it('returns basicInfo false when lastName is missing', () => {
    const user = { firstName: 'John' }
    const result = isProfileComplete(user as any)
    expect(result.basicInfo).toBe(false)
  })

  it('returns resume true when profile has resume fileUrl', () => {
    const profile = { resume: { fileUrl: 'https://example.com/resume.pdf', isUploaded: true } }
    const result = isProfileComplete(null, profile)
    expect(result.resume).toBe(true)
  })

  it('returns resume true when profile has resume isUploaded', () => {
    const profile = { resume: { isUploaded: true } }
    const result = isProfileComplete(null, profile)
    expect(result.resume).toBe(true)
  })

  it('returns resume false when profile has no resume', () => {
    const profile = {}
    const result = isProfileComplete(null, profile)
    expect(result.resume).toBe(false)
  })

  it('returns resume false when resume has no fileUrl and isUploaded is false', () => {
    const profile = { resume: { isUploaded: false } }
    const result = isProfileComplete(null, profile)
    expect(result.resume).toBe(false)
  })

  it('returns englishTest true when score exists', () => {
    const profile = { englishTestScore: 85 }
    const result = isProfileComplete(null, profile)
    expect(result.englishTest).toBe(true)
  })

  it('returns englishTest true when level exists', () => {
    const profile = { englishTestLevel: 'Advanced' }
    const result = isProfileComplete(null, profile)
    expect(result.englishTest).toBe(true)
  })

  it('returns englishTest false when no test data', () => {
    const profile = {}
    const result = isProfileComplete(null, profile)
    expect(result.englishTest).toBe(false)
  })

  it('returns workExperience true when profile has experience entries', () => {
    const profile = { profile: { workExperience: [{ title: 'Engineer' }] } }
    const result = isProfileComplete(null, profile)
    expect(result.workExperience).toBe(true)
  })

  it('returns workExperience false when no work experience', () => {
    const profile = { profile: { workExperience: [] } }
    const result = isProfileComplete(null, profile)
    expect(result.workExperience).toBe(false)
  })

  it('returns workExperience false when profile missing workExperience field', () => {
    const profile = { profile: {} }
    const result = isProfileComplete(null, profile)
    expect(result.workExperience).toBe(false)
  })

  it('combines user and profile data correctly', () => {
    const user = { firstName: 'Jane', lastName: 'Smith' }
    const profile = {
      resume: { fileUrl: 'https://example.com/resume.pdf', isUploaded: true },
      englishTestScore: 92,
      profile: { workExperience: [{ title: 'Dev' }, { title: 'Senior Dev' }] },
    }
    const result = isProfileComplete(user as any, profile)
    expect(result).toEqual({
      basicInfo: true,
      resume: true,
      englishTest: true,
      workExperience: true,
    })
  })
})

describe('calculateProfileProgress', () => {
  it('returns 0 when no fields are complete', () => {
    const result = calculateProfileProgress({
      basicInfo: false,
      resume: false,
      englishTest: false,
      workExperience: false,
    })
    expect(result).toBe(0)
  })

  it('returns 25 when one field is complete', () => {
    const result = calculateProfileProgress({
      basicInfo: true,
      resume: false,
      englishTest: false,
      workExperience: false,
    })
    expect(result).toBe(25)
  })

  it('returns 50 when two fields are complete', () => {
    const result = calculateProfileProgress({
      basicInfo: true,
      resume: true,
      englishTest: false,
      workExperience: false,
    })
    expect(result).toBe(50)
  })

  it('returns 75 when three fields are complete', () => {
    const result = calculateProfileProgress({
      basicInfo: true,
      resume: true,
      englishTest: true,
      workExperience: false,
    })
    expect(result).toBe(75)
  })

  it('returns 100 when all fields are complete', () => {
    const result = calculateProfileProgress({
      basicInfo: true,
      resume: true,
      englishTest: true,
      workExperience: true,
    })
    expect(result).toBe(100)
  })
})
