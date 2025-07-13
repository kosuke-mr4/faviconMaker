import { useRef, useState } from 'react'

interface UploadAreaProps {
  onImageUpload: (file: File) => void
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    const file = files[0]
    
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file)
    }
  }

  return (
    <div className="upload-area">
      <div 
        className={`upload-placeholder ${isDragOver ? 'is-drag-over' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="icon is-large">
          <i className="fas fa-cloud-upload-alt fa-2x"></i>
        </span>
        <p className="is-size-5 has-text-grey-dark">画像を選択してください</p>
        <p className="is-size-6 has-text-grey">クリックまたはドラッグ&ドロップ</p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}

export default UploadArea