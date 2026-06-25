import {
  isProfileComplete,
  calculateProfileProgress,
} from '@/features/dashboard/hooks/useDashboardData'

describe('isProfileComplete', () => {
  it('handles null user and null profile', () => {
    const result = isProfileComplete(null, null)
    expect(result).toEqual({
      basicInfo: false,
      resume: false,
      englishTest: false,
      workExperience: false,
    })
  })

  it('handles undefined user and undefined profile', () => {
    const result = isProfileComplete(undefined as any, undefined)
    expect(result).toEqual({
      basicInfo: false,
      resume: false,
      englishTest: false,
      workExperience: false,
    })
  })

  it('handles user with empty strings for name fields', () => {
    const user = { firstName: '', lastName: '' }
    const result = isProfileComplete(user as any)
    expect(result.basicInfo).toBe(false)
  })

  it('handles user with only whitespace names', () => {
    const user = { firstName: '  ', lastName: 'Doe' }
    const result = isProfileComplete(user as any)
    expect(result.basicInfo).toBe(true)
  })

  it('handles resume with only fileUrl', () => {
    const profile = { resume: { fileUrl: '/resume.pdf' } }
    const result = isProfileComplete(null, profile)
    expect(result.resume).toBe(true)
  })

  it('handles resume where resume object exists but is empty', () => {
    const profile = { resume: {} }
    const result = isProfileComplete(null, profile)
    expect(result.resume).toBe(false)
  })

  it('handles nested profile.profile path for workExperience', () => {
    const profile = { profile: { workExperience: undefined } }
    const result = isProfileComplete(null, profile)
    expect(result.workExperience).toBe(false)
  })

  it('handles profile without profile field', () => {
    const profile = {}
    const result = isProfileComplete(null, profile)
    expect(result.workExperience).toBe(false)
  })

  it('handles englishTest with 0 score (falsy)', () => {
    const profile = { englishTestScore: 0 }
    const result = isProfileComplete(null, profile)
    expect(result.englishTest).toBe(false)
  })

  it('handles englishTest with empty string level', () => {
    const profile = { englishTestLevel: '' }
    const result = isProfileComplete(null, profile)
    expect(result.englishTest).toBe(false)
  })
})

describe('calculateProfileProgress', () => {
  it('returns 0 for empty completion', () => {
    const result = calculateProfileProgress({
      basicInfo: false,
      resume: false,
      englishTest: false,
      workExperience: false,
    })
    expect(result).toBe(0)
  })

  it('returns 25 for one field', () => {
    const result = calculateProfileProgress({
      basicInfo: true,
      resume: false,
      englishTest: false,
      workExperience: false,
    })
    expect(result).toBe(25)
  })

  it('returns 100 for all fields', () => {
    const result = calculateProfileProgress({
      basicInfo: true,
      resume: true,
      englishTest: true,
      workExperience: true,
    })
    expect(result).toBe(100)
  })

  it('rounds values correctly with 3 fields (75)', () => {
    const result = calculateProfileProgress({
      basicInfo: true,
      resume: true,
      englishTest: true,
      workExperience: false,
    })
    expect(result).toBe(75)
  })

  it('handles single field fill (25)', () => {
    const result = calculateProfileProgress({
      basicInfo: false,
      resume: true,
      englishTest: false,
      workExperience: false,
    })
    expect(result).toBe(25)
  })

  it('handles non-standard completion object with extra keys', () => {
    const result = calculateProfileProgress({
      basicInfo: true,
      resume: true,
      englishTest: false,
      workExperience: false,
    } as any)
    expect(result).toBe(50)
  })
})
