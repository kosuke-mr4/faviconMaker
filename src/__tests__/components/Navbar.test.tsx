import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from '../../components/Navbar'

describe('Navbar', () => {
  it('renders the application title', () => {
    render(<Navbar />)
    
    expect(screen.getByText('Favicon Maker')).toBeInTheDocument()
  })

  it('has correct navigation role', () => {
    render(<Navbar />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'main navigation')
  })
})