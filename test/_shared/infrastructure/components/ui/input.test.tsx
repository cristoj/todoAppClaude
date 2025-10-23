import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/_shared/infrastructure/components/ui/input'

describe('Input', () => {
  it('should render input with placeholder', () => {
    render(<Input placeholder="Enter text..." />)
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument()
  })

  it('should render input as textbox by default', () => {
    render(<Input aria-label="Text input" />)
    const input = screen.getByRole('textbox', { name: 'Text input' })
    expect(input).toBeInTheDocument()
  })

  it('should render input with custom type', () => {
    render(<Input type="email" aria-label="Email input" />)
    const input = screen.getByLabelText('Email input')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('should accept custom className', () => {
    render(<Input className="custom-class" aria-label="Custom input" />)
    const input = screen.getByRole('textbox', { name: 'Custom input' })
    expect(input).toHaveClass('custom-class')
  })

  it('should apply default styling classes', () => {
    render(<Input aria-label="Styled input" />)
    const input = screen.getByRole('textbox', { name: 'Styled input' })
    expect(input).toHaveClass('rounded-md', 'border', 'bg-background')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled aria-label="Disabled input" />)
    const input = screen.getByRole('textbox', { name: 'Disabled input' })
    expect(input).toBeDisabled()
  })

  it('should handle onChange event', async () => {
    const user = userEvent.setup()
    let value = ''
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value
    }
    render(<Input onChange={handleChange} aria-label="Change input" />)
    const input = screen.getByRole('textbox', { name: 'Change input' })

    await user.type(input, 'Hello')
    expect(value).toBe('Hello')
  })

  it('should display value', () => {
    render(<Input value="Test value" onChange={() => {}} aria-label="Value input" />)
    const input = screen.getByRole('textbox', { name: 'Value input' }) as HTMLInputElement
    expect(input.value).toBe('Test value')
  })

  it('should accept numeric type', () => {
    render(<Input type="number" aria-label="Number input" />)
    const input = screen.getByLabelText('Number input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('should accept password type', () => {
    render(<Input type="password" aria-label="Password input" />)
    const input = screen.getByLabelText('Password input')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input ref={ref} aria-label="Ref input" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('should merge custom classes with default classes', () => {
    render(<Input className="mt-4 text-lg" aria-label="Merged input" />)
    const input = screen.getByRole('textbox', { name: 'Merged input' })
    expect(input).toHaveClass('rounded-md', 'mt-4', 'text-lg')
  })
})
