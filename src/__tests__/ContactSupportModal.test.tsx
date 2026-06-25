import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactSupportModal from '@/components/ContactSupportModal'

describe('ContactSupportModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn() as jest.Mock
  })

  it('renders trigger button', () => {
    render(<ContactSupportModal />)
    expect(screen.getByText(/contact support/i)).toBeInTheDocument()
  })

  it('opens dialog on trigger click', async () => {
    const user = userEvent.setup()
    render(<ContactSupportModal />)
    await user.click(screen.getByText(/contact support/i))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/have a question or need help/i)).toBeInTheDocument()
  })

  it('shows form fields (name, email, subject, message)', async () => {
    const user = userEvent.setup()
    render(<ContactSupportModal />)
    await user.click(screen.getByText(/contact support/i))
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('How can we help?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Describe your issue or question...')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ContactSupportModal />)
    await user.click(screen.getByText(/contact support/i))
    expect(screen.getByPlaceholderText('John Doe')).toBeRequired()
    expect(screen.getByPlaceholderText('john@example.com')).toBeRequired()
    expect(screen.getByPlaceholderText('How can we help?')).toBeRequired()
    expect(screen.getByPlaceholderText('Describe your issue or question...')).toBeRequired()
  })

  it('shows success message after submit', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<ContactSupportModal />)
    await user.click(screen.getByText(/contact support/i))
    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User')
    await user.type(screen.getByPlaceholderText('john@example.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('How can we help?'), 'Test Subject')
    await user.type(screen.getByPlaceholderText('Describe your issue or question...'), 'Test message')
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    })
  })

  it('shows error message on failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Something went wrong' }),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<ContactSupportModal />)
    await user.click(screen.getByText(/contact support/i))
    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User')
    await user.type(screen.getByPlaceholderText('john@example.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('How can we help?'), 'Test Subject')
    await user.type(screen.getByPlaceholderText('Describe your issue or question...'), 'Test message')
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('shows mailto fallback on network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error')) as jest.Mock
    const user = userEvent.setup()
    render(<ContactSupportModal />)
    await user.click(screen.getByText(/contact support/i))
    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User')
    await user.type(screen.getByPlaceholderText('john@example.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('How can we help?'), 'Test Subject')
    await user.type(screen.getByPlaceholderText('Describe your issue or question...'), 'Test message')
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/send via email client/i)).toBeInTheDocument()
  })

  it('resets on close', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<ContactSupportModal />)
    await user.click(screen.getByText(/contact support/i))
    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User')
    await user.type(screen.getByPlaceholderText('john@example.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('How can we help?'), 'Test Subject')
    await user.type(screen.getByPlaceholderText('Describe your issue or question...'), 'Test message')
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    })
    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    await user.click(screen.getByText(/contact support/i))
    await waitFor(() => {
      expect(screen.queryByText(/message sent successfully/i)).not.toBeInTheDocument()
    })
  })
})
