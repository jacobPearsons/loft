import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfileForm from '@/components/forms/profile-form'

jest.mock('@/lib/types', () => {
  const { z } = require('zod')
  return {
    EditUserProfileSchema: z.object({
      email: z.string().email('Required'),
      name: z.string().min(1, 'Required'),
    }),
  }
})

describe('ProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders name and email fields', () => {
    render(<ProfileForm user={{ name: 'John', email: 'john@test.com' }} />)
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
  })

  it('pre-fills user data', () => {
    render(<ProfileForm user={{ name: 'John Doe', email: 'john@test.com' }} />)
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@test.com')).toBeInTheDocument()
  })

  it('name field is editable', async () => {
    const user = userEvent.setup()
    render(<ProfileForm user={{ name: 'John', email: 'john@test.com' }} />)
    const nameInput = screen.getByDisplayValue('John')
    await user.clear(nameInput)
    await user.type(nameInput, 'Jane')
    expect(nameInput).toHaveValue('Jane')
  })

  it('email field is disabled', () => {
    render(<ProfileForm user={{ name: 'John', email: 'john@test.com' }} />)
    expect(screen.getByDisplayValue('john@test.com')).toBeDisabled()
  })

  it('shows saving state', async () => {
    const onUpdate = jest.fn().mockImplementation(() => new Promise(() => {}))
    const user = userEvent.setup()
    render(<ProfileForm user={{ name: 'John', email: 'john@test.com' }} onUpdate={onUpdate} />)
    await user.click(screen.getByRole('button', { name: /save changes/i }))
    expect(await screen.findByText(/saving/i)).toBeInTheDocument()
  })

  it('calls onUpdate on submit', async () => {
    const onUpdate = jest.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<ProfileForm user={{ name: 'Alice', email: 'alice@test.com' }} onUpdate={onUpdate} />)
    await user.click(screen.getByRole('button', { name: /save changes/i }))
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('Alice')
    })
  })
})
