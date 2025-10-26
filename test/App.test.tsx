import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../src/App'

describe('App', () => {
  it('renders Task Management application', async () => {
    render(<App />)
    const titleElement = await waitFor(() => screen.getByRole('heading', { name: 'Task Management' }))
    expect(titleElement).toBeInTheDocument()
  })

  it('displays New Task button', async () => {
    render(<App />)
    const newTaskButton = await waitFor(() => screen.getByRole('button', { name: /new task/i }))
    expect(newTaskButton).toBeInTheDocument()
  })
})
