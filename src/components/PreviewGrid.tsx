import React from 'react'

interface ImageData {
  original: string
  cropped: string | null
  sizes: { [key: number]: string }
}

interface PreviewGridProps {
  imageData: ImageData
}

const PreviewGrid: React.FC<PreviewGridProps> = ({ imageData }) => {
  const sizes = [256, 128, 64, 32, 16]

  const handleDownload = (size: number) => {
    const imageUrl = imageData.sizes[size]
    if (!imageUrl) return

    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `favicon-${size}x${size}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="preview-grid">
      {sizes.map(size => (
        <div key={size} className="preview-item" data-size={size}>
          {imageData.sizes[size] ? (
            <div className="preview-with-image">
              <div className="preview-image-container">
                <img 
                  src={imageData.sizes[size]} 
                  alt={`${size}x${size}`}
                  className="preview-image"
                />
                <button 
                  className="download-button"
                  onClick={() => handleDownload(size)}
                  title={`Download ${size}x${size}`}
                >
                  <i className="fas fa-download"></i>
                </button>
              </div>
              <div className="preview-size-label">
                <span className="preview-size">{size}×{size}</span>
              </div>
            </div>
          ) : (
            <div className="preview-placeholder">
              <span className="preview-size">{size}×{size}</span>
              <span className="icon">
                <i className="fas fa-times"></i>
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PreviewGrid