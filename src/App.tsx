import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import UploadArea from './components/UploadArea'
import PreviewGrid from './components/PreviewGrid'
import CropModal from './components/CropModal'

interface ImageData {
  original: string
  cropped: string | null
  sizes: { [key: number]: string }
}

function App() {
  const [imageData, setImageData] = useState<ImageData>({
    original: '',
    cropped: null,
    sizes: {}
  })
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageData({
        original: e.target?.result as string,
        cropped: null,
        sizes: {}
      })
      setIsCropModalOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const generateResizedImage = (sourceImg: HTMLImageElement, targetSize: number): string => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = targetSize
    canvas.height = targetSize
    
    // 高品質な拡大・縮小のための設定
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // 元画像のサイズを取得
    const sourceSize = Math.min(sourceImg.width, sourceImg.height)
    
    if (sourceSize < targetSize) {
      // 元画像が目標サイズより小さい場合は、段階的拡大を行う
      const steps = Math.ceil(Math.log2(targetSize / sourceSize))
      let currentCanvas = document.createElement('canvas')
      let currentCtx = currentCanvas.getContext('2d')!
      
      // 最初のキャンバスに元画像を描画
      currentCanvas.width = sourceSize
      currentCanvas.height = sourceSize
      currentCtx.imageSmoothingEnabled = true
      currentCtx.imageSmoothingQuality = 'high'
      currentCtx.drawImage(sourceImg, 0, 0, sourceSize, sourceSize)
      
      // 段階的に拡大
      for (let i = 0; i < steps; i++) {
        const nextSize = Math.min(currentCanvas.width * 2, targetSize)
        const nextCanvas = document.createElement('canvas')
        const nextCtx = nextCanvas.getContext('2d')!
        
        nextCanvas.width = nextSize
        nextCanvas.height = nextSize
        nextCtx.imageSmoothingEnabled = true
        nextCtx.imageSmoothingQuality = 'high'
        
        nextCtx.drawImage(currentCanvas, 0, 0, nextSize, nextSize)
        currentCanvas = nextCanvas
        currentCtx = nextCtx
      }
      
      // 最終的に目標サイズに調整
      ctx.drawImage(currentCanvas, 0, 0, targetSize, targetSize)
    } else {
      // 元画像が目標サイズ以上の場合は直接リサイズ
      ctx.drawImage(sourceImg, 0, 0, targetSize, targetSize)
    }
    
    return canvas.toDataURL('image/png')
  }

  const handleCropComplete = (croppedImageData: string) => {
    const sizes = [256, 128, 64, 32, 16]
    const newSizes: { [key: number]: string } = {}
    
    const img = new Image()
    img.onload = () => {
      const sourceSize = Math.min(img.width, img.height)
      
      // 小さい画像の場合は通知を表示
      if (sourceSize < 256) {
        setNotification(
          `元画像（${sourceSize}×${sourceSize}）が256×256より小さいため、高品質拡大処理を適用しました。最適な品質のため、256×256以上の画像をお勧めします。`
        )
        setTimeout(() => setNotification(null), 5000) // 5秒後に非表示
      }
      
      sizes.forEach(size => {
        newSizes[size] = generateResizedImage(img, size)
      })
      
      setImageData(prev => ({
        ...prev,
        cropped: croppedImageData,
        sizes: newSizes
      }))
    }
    img.src = croppedImageData
    
    setIsCropModalOpen(false)
  }

  return (
    <div className="App">
      <Navbar onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
      
      {notification && (
        <div className="notification-banner">
          <div className="container">
            <div className="notification-content">
              <span className="icon">
                <i className="fas fa-info-circle"></i>
              </span>
              <span>{notification}</span>
              <button 
                className="delete-notification"
                onClick={() => setNotification(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <section className="section">
        <div className="container">
          <div className="columns is-gapless">
            <div className="column is-half">
              <UploadArea onImageUpload={handleImageUpload} />
            </div>
            
            <div className="column is-half">
              <PreviewGrid imageData={imageData} />
            </div>
          </div>
        </div>
      </section>

      <CropModal
        isOpen={isCropModalOpen}
        imageData={imageData.original}
        onCropComplete={handleCropComplete}
        onClose={() => setIsCropModalOpen(false)}
      />
    </div>
  )
}

export default App