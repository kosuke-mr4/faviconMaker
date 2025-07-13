import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from '../../components/Navbar'

describe('Navbar', () => {
  const mockProps = {
    onThemeToggle: () => {},
    isDarkMode: false
  }

  it('renders the application title', () => {
    render(<Navbar {...mockProps} />)
    
    expect(screen.getByText('Favicon Maker')).toBeInTheDocument()
  })

  it('has correct navigation role', () => {
    render(<Navbar {...mockProps} />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'main navigation')
  })
})