import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '@/components/ui/command'

describe('Command', () => {
  it('renders Command with CommandInput', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
      </Command>
    )

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('renders CommandList with items', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
          <CommandItem>Item 2</CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('renders CommandEmpty when no results match', async () => {
    const user = userEvent.setup()
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandItem>Apple</CommandItem>
          <CommandItem>Banana</CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'xyz')
    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  it('renders CommandGroup with heading', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem>Apple</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    expect(screen.getByText('Suggestions')).toBeInTheDocument()
  })

  it('renders CommandSeparator', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
          <CommandSeparator />
          <CommandItem>Item 2</CommandItem>
        </CommandList>
      </Command>
    )

    const separators = document.querySelectorAll('[cmdk-separator=""]')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('renders CommandShortcut', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>
            <span>Item</span>
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getByText('⌘K')).toBeInTheDocument()
  })

  it('applies className to Command', () => {
    render(
      <Command className="custom-command">
        <CommandInput placeholder="Search..." />
      </Command>
    )

    expect(screen.getByPlaceholderText('Search...').closest('[cmdk-root]')).toHaveClass('custom-command')
  })

  it('applies className to CommandGroup', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandGroup heading="Group" className="custom-group">
            <CommandItem>Item</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    expect(screen.getByText('Group').closest('[cmdk-group]')).toHaveClass('custom-group')
  })

  it('applies className to CommandItem', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem className="custom-item">Item</CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getByText('Item')).toHaveClass('custom-item')
  })

  it('applies className to CommandShortcut', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>
            <span>Item</span>
            <CommandShortcut className="custom-shortcut">⌘K</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getByText('⌘K')).toHaveClass('custom-shortcut')
  })
})
