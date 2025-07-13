import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders the main application structure', () => {
    render(<App />)
    
    // Navbar
    expect(screen.getByText('Favicon Maker')).toBeInTheDocument()
    
    // Upload area
    expect(screen.getByText('画像を選択してください')).toBeInTheDocument()
    
    // Preview grid with all sizes
    expect(screen.getByText('256×256')).toBeInTheDocument()
    expect(screen.getByText('128×128')).toBeInTheDocument()
    expect(screen.getByText('64×64')).toBeInTheDocument()
    expect(screen.getByText('32×32')).toBeInTheDocument()
    expect(screen.getByText('16×16')).toBeInTheDocument()
  })

  it('has proper layout structure', () => {
    render(<App />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    const section = nav.nextElementSibling
    expect(section).toHaveClass('section')
  })

  it('crop modal is initially closed', () => {
    render(<App />)
    
    // モーダルが閉じている状態では、モーダルのタイトルは表示されない
    expect(screen.queryByText('画像をトリミング')).not.toBeInTheDocument()
  })
})