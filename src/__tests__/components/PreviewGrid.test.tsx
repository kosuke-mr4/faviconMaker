import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PreviewGrid from '../../components/PreviewGrid'

describe('PreviewGrid', () => {
  const mockImageData = {
    original: 'data:image/png;base64,test',
    cropped: 'data:image/png;base64,cropped',
    sizes: {
      256: 'data:image/png;base64,256',
      128: 'data:image/png;base64,128',
      64: 'data:image/png;base64,64',
      32: 'data:image/png;base64,32',
      16: 'data:image/png;base64,16',
    }
  }

  const emptyImageData = {
    original: '',
    cropped: null,
    sizes: {}
  }

  it('renders all size placeholders when no images', () => {
    render(<PreviewGrid imageData={emptyImageData} />)
    
    expect(screen.getByText('256×256')).toBeInTheDocument()
    expect(screen.getByText('128×128')).toBeInTheDocument()
    expect(screen.getByText('64×64')).toBeInTheDocument()
    expect(screen.getByText('32×32')).toBeInTheDocument()
    expect(screen.getByText('16×16')).toBeInTheDocument()
  })

  it('renders images when available', () => {
    render(<PreviewGrid imageData={mockImageData} />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(5)
    
    images.forEach((img, index) => {
      const sizes = [256, 128, 64, 32, 16]
      expect(img).toHaveAttribute('alt', `${sizes[index]}x${sizes[index]}`)
    })
  })

  it('shows download buttons for available images', () => {
    render(<PreviewGrid imageData={mockImageData} />)
    
    const downloadButtons = screen.getAllByTitle(/Download/)
    expect(downloadButtons).toHaveLength(5)
    
    // ダウンロード機能は実際のブラウザ環境で手動確認済み
  })
})