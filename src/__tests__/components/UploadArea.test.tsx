import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import UploadArea from '../../components/UploadArea'

describe('UploadArea', () => {
  const mockOnImageUpload = vi.fn()

  beforeEach(() => {
    mockOnImageUpload.mockClear()
  })

  it('renders upload placeholder text', () => {
    render(<UploadArea onImageUpload={mockOnImageUpload} />)
    
    expect(screen.getByText('画像を選択してください')).toBeInTheDocument()
    expect(screen.getByText('クリックまたはドラッグ&ドロップ')).toBeInTheDocument()
  })

  it('triggers file input when clicked', async () => {
    const user = userEvent.setup()
    render(<UploadArea onImageUpload={mockOnImageUpload} />)
    
    const uploadArea = screen.getByText('画像を選択してください').closest('.upload-placeholder')
    expect(uploadArea).toBeInTheDocument()
    
    if (uploadArea) {
      await user.click(uploadArea)
    }
    
    // ファイル入力がトリガーされることを確認（実際のファイル選択はE2Eテストで）
  })

  it('handles file selection', async () => {
    render(<UploadArea onImageUpload={mockOnImageUpload} />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      })
      
      fireEvent.change(input)
      
      expect(mockOnImageUpload).toHaveBeenCalledWith(file)
    }
  })

  it('handles drag and drop', async () => {
    render(<UploadArea onImageUpload={mockOnImageUpload} />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const uploadArea = screen.getByText('画像を選択してください').closest('.upload-placeholder')
    
    if (uploadArea) {
      fireEvent.dragOver(uploadArea)
      expect(uploadArea).toHaveClass('is-drag-over')
      
      fireEvent.drop(uploadArea, {
        dataTransfer: {
          files: [file],
        },
      })
      
      expect(mockOnImageUpload).toHaveBeenCalledWith(file)
    }
  })
})