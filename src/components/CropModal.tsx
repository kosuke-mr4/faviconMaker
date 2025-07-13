import { useEffect, useRef, useState } from 'react'

interface CropModalProps {
  isOpen: boolean
  imageData: string
  onCropComplete: (croppedData: string) => void
  onClose: () => void
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

type DragMode = 'none' | 'creating' | 'moving'

const CropModal: React.FC<CropModalProps> = ({ 
  isOpen, 
  imageData, 
  onCropComplete, 
  onClose 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 })
  const [dragMode, setDragMode] = useState<DragMode>('none')
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (isOpen && imageData) {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        const size = Math.min(img.width, img.height)
        const x = (img.width - size) / 2
        const y = (img.height - size) / 2
        setCropArea({ x, y, width: size, height: size })
      }
      img.src = imageData
    }
  }, [isOpen, imageData])

  useEffect(() => {
    if (image && canvasRef.current) {
      drawCanvas()
    }
  }, [image, cropArea])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !image) return

    const maxSize = 400
    const scale = Math.min(maxSize / image.width, maxSize / image.height)
    
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Clear crop area
    ctx.clearRect(
      cropArea.x * scale,
      cropArea.y * scale,
      cropArea.width * scale,
      cropArea.height * scale
    )

    // Redraw image in crop area
    ctx.drawImage(
      image,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      cropArea.x * scale, cropArea.y * scale, cropArea.width * scale, cropArea.height * scale
    )

    // Draw crop border
    ctx.strokeStyle = '#007AFF'
    ctx.lineWidth = 2
    ctx.strokeRect(
      cropArea.x * scale,
      cropArea.y * scale,
      cropArea.width * scale,
      cropArea.height * scale
    )
  }

  const isPointInCropArea = (x: number, y: number) => {
    return x >= cropArea.x && x <= cropArea.x + cropArea.width &&
           y >= cropArea.y && y <= cropArea.y + cropArea.height
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const rect = canvas.getBoundingClientRect()
    const scale = canvas.width / rect.width
    const x = (e.clientX - rect.left) * scale / (canvas.width / image.width)
    const y = (e.clientY - rect.top) * scale / (canvas.height / image.height)

    if (isPointInCropArea(x, y)) {
      // 範囲内をクリック - 移動モード
      setDragMode('moving')
      setCropOffset({
        x: x - cropArea.x,
        y: y - cropArea.y
      })
    } else {
      // 範囲外をクリック - 新規作成モード
      setDragMode('creating')
    }
    
    setDragStart({ x, y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const rect = canvas.getBoundingClientRect()
    const scale = canvas.width / rect.width
    const x = (e.clientX - rect.left) * scale / (canvas.width / image.width)
    const y = (e.clientY - rect.top) * scale / (canvas.height / image.height)

    // カーソルの変更
    if (dragMode === 'none') {
      if (isPointInCropArea(x, y)) {
        canvas.style.cursor = 'move'
      } else {
        canvas.style.cursor = 'crosshair'
      }
    }

    if (dragMode === 'none') return

    if (dragMode === 'creating') {
      // 新規作成モード
      const size = Math.min(
        Math.abs(x - dragStart.x),
        Math.abs(y - dragStart.y)
      )

      const newX = Math.min(dragStart.x, x)
      const newY = Math.min(dragStart.y, y)

      // Ensure crop area stays within image bounds
      const maxSize = Math.min(image.width - newX, image.height - newY)
      const finalSize = Math.min(size, maxSize)

      setCropArea({
        x: newX,
        y: newY,
        width: finalSize,
        height: finalSize
      })
    } else if (dragMode === 'moving') {
      // 移動モード
      const newX = x - cropOffset.x
      const newY = y - cropOffset.y

      // Ensure crop area stays within image bounds
      const boundedX = Math.max(0, Math.min(newX, image.width - cropArea.width))
      const boundedY = Math.max(0, Math.min(newY, image.height - cropArea.height))

      setCropArea(prev => ({
        ...prev,
        x: boundedX,
        y: boundedY
      }))
    }
  }

  const handleMouseUp = () => {
    setDragMode('none')
  }

  const applyCrop = () => {
    if (!image) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = cropArea.width
    canvas.height = cropArea.height

    ctx.drawImage(
      image,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      0, 0, cropArea.width, cropArea.height
    )

    const croppedData = canvas.toDataURL('image/png')
    onCropComplete(croppedData)
  }

  if (!isOpen) return null

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">画像をトリミング</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="crop-container">
            <canvas
              ref={canvasRef}
              id="cropCanvas"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={applyCrop}>
            適用
          </button>
          <button className="button" onClick={onClose}>
            キャンセル
          </button>
        </footer>
      </div>
    </div>
  )
}

export default CropModal