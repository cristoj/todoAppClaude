import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '@/_shared/infrastructure/components/ui/checkbox'

describe('Checkbox', () => {
  it('should render checkbox', () => {
    render(<Checkbox aria-label="Accept terms" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
    expect(checkbox).toBeInTheDocument()
  })

  it('should be unchecked by default', () => {
    render(<Checkbox aria-label="Checkbox" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Checkbox' })
    expect(checkbox).not.toBeChecked()
  })

  it('should be checked when checked prop is true', () => {
    render(<Checkbox checked aria-label="Checked checkbox" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Checked checkbox' })
    expect(checkbox).toBeChecked()
  })

  it('should handle onCheckedChange event', async () => {
    const user = userEvent.setup()
    let checked = false
    const handleChange = (value: boolean) => {
      checked = value
    }

    render(<Checkbox onCheckedChange={handleChange} aria-label="Interactive checkbox" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Interactive checkbox' })

    await user.click(checkbox)
    expect(checked).toBe(true)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Checkbox disabled aria-label="Disabled checkbox" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Disabled checkbox' })
    expect(checkbox).toBeDisabled()
  })

  it('should apply custom className', () => {
    render(<Checkbox className="custom-checkbox" aria-label="Custom checkbox" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Custom checkbox' })
    expect(checkbox).toHaveClass('custom-checkbox')
  })

  it('should apply default styling classes', () => {
    render(<Checkbox aria-label="Styled checkbox" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Styled checkbox' })
    expect(checkbox).toHaveClass('rounded-sm', 'border', 'h-4', 'w-4')
  })

  it('should toggle state when clicked', async () => {
    const user = userEvent.setup()
    let isChecked = false
    const handleChange = (value: boolean) => {
      isChecked = value
    }

    render(<Checkbox checked={isChecked} onCheckedChange={handleChange} aria-label="Toggle checkbox" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Toggle checkbox' })

    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(isChecked).toBe(true)
  })

  it('should not toggle when disabled', async () => {
    const user = userEvent.setup()
    let checked = false
    const handleChange = (value: boolean) => {
      checked = value
    }

    render(<Checkbox disabled onCheckedChange={handleChange} aria-label="Disabled toggle" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Disabled toggle' })

    await user.click(checkbox)
    expect(checked).toBe(false)
  })

  it('should forward ref correctly', () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Checkbox ref={ref} aria-label="Ref checkbox" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('should merge custom classes with default classes', () => {
    render(<Checkbox className="mt-2 h-6 w-6" aria-label="Merged checkbox" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Merged checkbox' })
    expect(checkbox).toHaveClass('mt-2', 'h-6', 'w-6', 'rounded-sm', 'border')
  })
})
