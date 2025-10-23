import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/_shared/infrastructure/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with children', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should apply default styling classes', () => {
      render(<Card data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card')
    })

    it('should accept custom className', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class', 'rounded-lg')
    })
  })

  describe('CardHeader', () => {
    it('should render card header with children', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('should apply default styling classes', () => {
      render(<CardHeader data-testid="header">Content</CardHeader>)
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('flex', 'flex-col', 'p-6')
    })

    it('should accept custom className', () => {
      render(<CardHeader className="custom-header" data-testid="header">Content</CardHeader>)
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('custom-header', 'flex')
    })
  })

  describe('CardTitle', () => {
    it('should render card title with text', () => {
      render(<CardTitle>My Title</CardTitle>)
      expect(screen.getByText('My Title')).toBeInTheDocument()
    })

    it('should apply default styling classes', () => {
      render(<CardTitle data-testid="title">Title</CardTitle>)
      const title = screen.getByTestId('title')
      expect(title).toHaveClass('text-2xl', 'font-semibold')
    })

    it('should accept custom className', () => {
      render(<CardTitle className="text-3xl" data-testid="title">Title</CardTitle>)
      const title = screen.getByTestId('title')
      expect(title).toHaveClass('text-3xl', 'font-semibold')
    })
  })

  describe('CardDescription', () => {
    it('should render card description with text', () => {
      render(<CardDescription>Description text</CardDescription>)
      expect(screen.getByText('Description text')).toBeInTheDocument()
    })

    it('should apply default styling classes', () => {
      render(<CardDescription data-testid="description">Text</CardDescription>)
      const description = screen.getByTestId('description')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })

    it('should accept custom className', () => {
      render(<CardDescription className="text-base" data-testid="description">Text</CardDescription>)
      const description = screen.getByTestId('description')
      expect(description).toHaveClass('text-base', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('should render card content with children', () => {
      render(<CardContent>Content text</CardContent>)
      expect(screen.getByText('Content text')).toBeInTheDocument()
    })

    it('should apply default styling classes', () => {
      render(<CardContent data-testid="content">Text</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('p-6', 'pt-0')
    })

    it('should accept custom className', () => {
      render(<CardContent className="px-8" data-testid="content">Text</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('px-8', 'p-6', 'pt-0')
    })
  })

  describe('CardFooter', () => {
    it('should render card footer with children', () => {
      render(<CardFooter>Footer content</CardFooter>)
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('should apply default styling classes', () => {
      render(<CardFooter data-testid="footer">Content</CardFooter>)
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('flex', 'items-center', 'p-6')
    })

    it('should accept custom className', () => {
      render(<CardFooter className="justify-end" data-testid="footer">Content</CardFooter>)
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('justify-end', 'flex')
    })
  })

  describe('Full Card Composition', () => {
    it('should render complete card with all subcomponents', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Main content</CardContent>
          <CardFooter>Footer actions</CardFooter>
        </Card>
      )

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card Description')).toBeInTheDocument()
      expect(screen.getByText('Main content')).toBeInTheDocument()
      expect(screen.getByText('Footer actions')).toBeInTheDocument()
    })
  })
})
