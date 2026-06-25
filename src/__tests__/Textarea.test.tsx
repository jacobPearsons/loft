import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea', () => {
  it('renders textarea element', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('forwards placeholder', () => {
    render(<Textarea placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('forwards value', () => {
    render(<Textarea value="test value" readOnly />)
    expect(screen.getByRole('textbox')).toHaveValue('test value')
  })

  it('handles onChange', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    render(<Textarea onChange={handleChange} />)
    await user.type(screen.getByRole('textbox'), 'a')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('forwards className', () => {
    render(<Textarea className="custom-textarea" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-textarea')
  })

  it('applies disabled styles', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('renders defaultValue', () => {
    render(<Textarea defaultValue="default text" />)
    expect(screen.getByRole('textbox')).toHaveValue('default text')
  })
})
