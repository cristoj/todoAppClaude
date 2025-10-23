import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../src/App'

describe('App', () => {
  it('renders with the title "Todo App"', () => {
    render(<App />)
    const titleElement = screen.getByRole('heading', { name: 'Todo App' })
    expect(titleElement).toBeInTheDocument()
  })

  it('displays the app description', () => {
    render(<App />)
    const description = screen.getByText(/Simple minimalist todo web app/i)
    expect(description).toBeInTheDocument()
  })
})
