import { render, screen } from '@testing-library/react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

describe('Form', () => {
  it('renders Form with FormField, FormItem, FormLabel, FormControl', () => {
    function TestForm() {
      const form = useForm()
      return (
        <Form {...form}>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Label</FormLabel>
                <FormControl>
                  <Input placeholder="test input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      )
    }

    render(<TestForm />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('test input')).toBeInTheDocument()
  })

  it('renders FormDescription', () => {
    function TestForm() {
      const form = useForm()
      return (
        <Form {...form}>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Help text</FormDescription>
              </FormItem>
            )}
          />
        </Form>
      )
    }

    render(<TestForm />)
    expect(screen.getByText('Help text')).toBeInTheDocument()
  })

  it('renders error message from form state', async () => {
    function TestFormWithError() {
      const form = useForm({ defaultValues: { test: '' } })
      React.useEffect(() => {
        form.setError('test', { message: 'This field is required' })
      }, [form])
      return (
        <Form {...form}>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      )
    }

    render(<TestFormWithError />)
    expect(await screen.findByText('This field is required')).toBeInTheDocument()
  })

  it('renders custom children in FormMessage', () => {
    function TestForm() {
      const form = useForm()
      return (
        <Form {...form}>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>Custom message</FormMessage>
              </FormItem>
            )}
          />
        </Form>
      )
    }

    render(<TestForm />)
    expect(screen.getByText('Custom message')).toBeInTheDocument()
  })

  it('applies className to FormItem', () => {
    function TestForm() {
      const form = useForm()
      return (
        <Form {...form}>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem className="custom-item">
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      )
    }

    render(<TestForm />)
    expect(screen.getByText('Label').parentElement).toHaveClass('custom-item')
  })

  it('applies className to FormLabel', () => {
    function TestForm() {
      const form = useForm()
      return (
        <Form {...form}>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="custom-label">Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      )
    }

    render(<TestForm />)
    expect(screen.getByText('Label')).toHaveClass('custom-label')
  })

  it('applies className to FormDescription', () => {
    function TestForm() {
      const form = useForm()
      return (
        <Form {...form}>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="custom-desc">Desc</FormDescription>
              </FormItem>
            )}
          />
        </Form>
      )
    }

    render(<TestForm />)
    expect(screen.getByText('Desc')).toHaveClass('custom-desc')
  })
})
