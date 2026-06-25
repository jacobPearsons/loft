jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <section {...props}>{children}</section>,
    span: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <button {...props}>{children}</button>,
    h1: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}))

jest.mock('@/components/ui/multiple-selector', () => {
  return {
    __esModule: true,
    default: ({ value, onChange, placeholder }: any) => (
      <div data-testid="multiple-selector">
        <input
          data-testid="skill-input"
          placeholder={placeholder}
          onChange={(e) => {
            if (e.target.value && onChange) {
              onChange([{ value: e.target.value, label: e.target.value }])
            }
          }}
        />
        {value?.map((opt: any) => (
          <span key={opt.value} data-testid="skill-badge">{opt.label}</span>
        ))}
      </div>
    ),
  }
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JobForm } from '@/features/job-management/components/JobForm'
import type { CreateJobPayload } from '@/features/job-management/types'

describe('JobForm', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined)
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all section headings', () => {
    render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    expect(screen.getByText('Basic Information')).toBeInTheDocument()
    expect(screen.getByText('Job Details')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('Compensation')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
  })

  it('renders form fields', () => {
    render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    expect(screen.getByLabelText('Job Title *')).toBeInTheDocument()
    expect(screen.getByLabelText('Job Description *')).toBeInTheDocument()
    expect(screen.getByLabelText('Requirements')).toBeInTheDocument()
    expect(screen.getByLabelText('Benefits')).toBeInTheDocument()
    expect(screen.getByLabelText('City')).toBeInTheDocument()
    expect(screen.getByLabelText('Country')).toBeInTheDocument()
    expect(screen.getByLabelText('Address')).toBeInTheDocument()
  })

  it('renders submit and cancel buttons', () => {
    render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    expect(screen.getByText('Create Job')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onCancel when cancel button clicked', async () => {
    const user = userEvent.setup()
    render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    await user.click(screen.getByText('Cancel'))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('calls onSubmit with form data when submitted', async () => {
    const user = userEvent.setup()
    render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const titleInput = screen.getByLabelText('Job Title *')
    await user.clear(titleInput)
    await user.type(titleInput, 'Senior Engineer')

    const descInput = screen.getByLabelText('Job Description *')
    await user.clear(descInput)
    await user.type(descInput, 'Great job description')

    const submitButton = screen.getByText('Create Job')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    const submittedData = mockOnSubmit.mock.calls[0][0] as CreateJobPayload
    expect(submittedData.title).toBe('Senior Engineer')
    expect(submittedData.description).toBe('Great job description')
    expect(submittedData.jobType).toBe('FULL_TIME')
    expect(submittedData.experienceLevel).toBe('MID')
    expect(submittedData.workMode).toBe('REMOTE')
  })

  it('disables submit button when loading', () => {
    const { container } = render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={true} />)
    const buttons = container.querySelectorAll('button')
    const submitBtn = Array.from(buttons).find(btn => btn.getAttribute('type') === 'submit')
    expect(submitBtn).toBeDisabled()
  })

  it('shows Update Job label when initialData is provided', () => {
    render(
      <JobForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={{ id: 1, title: 'Test', slug: 'test', description: 'Desc' } as any}
      />
    )
    expect(screen.getByText('Update Job')).toBeInTheDocument()
  })

  it('renders required skills section', () => {
    render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    expect(screen.getByText('Required Skills')).toBeInTheDocument()
    expect(screen.getByText('Preferred Skills')).toBeInTheDocument()
  })

  it('renders job type, experience, and work mode selects', () => {
    render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    expect(screen.getByText('Full Time')).toBeInTheDocument()
    expect(screen.getByText('Mid-Level')).toBeInTheDocument()
    expect(screen.getByText('Remote')).toBeInTheDocument()
  })

  it('renders salary fields by default', () => {
    render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    expect(screen.getByLabelText('Minimum')).toBeInTheDocument()
    expect(screen.getByLabelText('Maximum')).toBeInTheDocument()
  })

  it('has required html attributes on title and description fields', () => {
    render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    expect(screen.getByLabelText('Job Title *')).toBeRequired()
    expect(screen.getByLabelText('Job Description *')).toBeRequired()
  })

  it('shows application URL and email fields', () => {
    render(<JobForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    expect(screen.getByLabelText('Application URL')).toBeInTheDocument()
    expect(screen.getByLabelText('Application Email')).toBeInTheDocument()
  })
})
