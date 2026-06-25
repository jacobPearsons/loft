import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationCenter } from '@/components/NotificationCenter'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, exit, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}))

jest.mock('@/lib/logger', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  })),
}))

const mockNotifications = [
  {
    id: 1,
    title: 'Application Received',
    message: 'You have a new application for Software Engineer',
    type: 'APPLICATION_RECEIVED',
    link: '/applications/1',
    isRead: false,
    createdAt: new Date().toISOString(),
    data: null,
  },
  {
    id: 2,
    title: 'Job Recommended',
    message: 'A new job matches your profile',
    type: 'JOB_RECOMMENDED',
    link: '/jobs/2',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    data: null,
  },
]

const emptyResponse = {
  notifications: [],
  unreadCount: 0,
}

const defaultResponse = {
  notifications: mockNotifications,
  unreadCount: 1,
}

describe('NotificationCenter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders bell button', () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(emptyResponse),
    }) as jest.Mock
    render(<NotificationCenter />)
    const bellButton = screen.getByRole('button')
    expect(bellButton).toBeInTheDocument()
  })

  it('shows unread count badge', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(defaultResponse),
    }) as jest.Mock
    render(<NotificationCenter />)
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('opens dropdown on bell click', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(defaultResponse),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<NotificationCenter />)
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', async () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock
    const user = userEvent.setup()
    render(<NotificationCenter />)
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('displays fetched notifications', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(defaultResponse),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<NotificationCenter />)
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText('Application Received')).toBeInTheDocument()
    })
  })

  it('shows empty state when no notifications', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(emptyResponse),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<NotificationCenter />)
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText(/no notifications yet/i)).toBeInTheDocument()
    })
  })

  it('marks all as read', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(defaultResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })
    global.fetch = fetchMock as jest.Mock
    const user = userEvent.setup()
    render(<NotificationCenter />)
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText(/mark all read/i)).toBeInTheDocument()
    })
    await user.click(screen.getByText(/mark all read/i))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      })
    })
  })

  it('click outside closes dropdown', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(defaultResponse),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<NotificationCenter />)
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument()
    })
    fireEvent.mouseDown(document.body)
    await waitFor(() => {
      expect(screen.queryByText('Notifications')).not.toBeInTheDocument()
    })
  })

  it('renders notification with type icon', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(defaultResponse),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<NotificationCenter />)
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText('📋')).toBeInTheDocument()
    })
  })
})
