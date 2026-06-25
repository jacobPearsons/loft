import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfilePicture from '@/app/(main)/(pages)/settings/_components/profile-picture'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, fill, ...rest } = props
    return <img {...rest} alt={rest.alt as string || ''} /> // eslint-disable-line @next/next/no-img-element, jsx-a11y/alt-text
  },
}))

jest.mock('@/app/(main)/(pages)/settings/_components/uploadcare-button', () => ({
  __esModule: true,
  default: () => <div data-testid="uploadcare-button">Upload</div>,
}))

const mockRouterRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRouterRefresh,
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}))

describe('ProfilePicture', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders placeholder when no image', () => {
    render(<ProfilePicture userImage={null} onDelete={jest.fn()} onUpload={jest.fn()} />)
    expect(screen.getByTestId('uploadcare-button')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders Image when userImage provided', () => {
    render(<ProfilePicture userImage="/test.jpg" onDelete={jest.fn()} onUpload={jest.fn()} />)
    const img = screen.getByAltText('User_Image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.jpg')
  })

  it('renders UploadCareButton', () => {
    render(<ProfilePicture userImage={null} onDelete={jest.fn()} onUpload={jest.fn()} />)
    expect(screen.getByTestId('uploadcare-button')).toBeInTheDocument()
  })

  it('renders Remove button when image exists', () => {
    render(<ProfilePicture userImage="/test.jpg" onDelete={jest.fn()} onUpload={jest.fn()} />)
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  it('calls onDelete on remove click', async () => {
    const onDelete = jest.fn().mockResolvedValue(true)
    const user = userEvent.setup()
    render(<ProfilePicture userImage="/test.jpg" onDelete={onDelete} onUpload={jest.fn()} />)
    await user.click(screen.getByText('Remove'))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('calls router.refresh after delete', async () => {
    const onDelete = jest.fn().mockResolvedValue(true)
    const user = userEvent.setup()
    render(<ProfilePicture userImage="/test.jpg" onDelete={onDelete} onUpload={jest.fn()} />)
    await user.click(screen.getByText('Remove'))
    await waitFor(() => {
      expect(mockRouterRefresh).toHaveBeenCalled()
    })
  })
})
