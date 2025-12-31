'use client'

import { useState, useCallback, useRef } from 'react'
import JSZip from 'jszip'

interface ConversionResult {
  originalFile: File
  convertedBlob: Blob
  originalSize: number
  convertedSize: number
  reduction: number
  url: string
}

export default function ImageConverter() {
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<ConversionResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateImageFile = (file: File): boolean => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    return validTypes.includes(file.type)
  }

  const convertImage = useCallback(async (file: File): Promise<ConversionResult> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new Image()

        img.onload = () => {
          // 使用 Canvas 进行转换
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('无法创建画布上下文'))
            return
          }

          // 保持原始尺寸
          canvas.width = img.width
          canvas.height = img.height

          // 绘制图像
          ctx.drawImage(img, 0, 0)

          // 转换为 WebP
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('转换失败'))
                return
              }

              const originalSize = file.size
              const convertedSize = blob.size
              const reduction = ((originalSize - convertedSize) / originalSize * 100).toFixed(2)
              const url = URL.createObjectURL(blob)

              resolve({
                originalFile: file,
                convertedBlob: blob,
                originalSize,
                convertedSize,
                reduction: parseFloat(reduction),
                url
              })
            },
            'image/webp',
            0.9 // 质量设置
          )
        }

        img.onerror = () => reject(new Error('无法加载图片'))
        img.src = e.target?.result as string
      }

      reader.onerror = () => reject(new Error('无法读取文件'))
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFiles = useCallback(async (files: FileList) => {
    setError(null)
    setSuccess(null)

    const validFiles = Array.from(files).filter(validateImageFile)

    if (validFiles.length === 0) {
      setError('请选择有效的图片文件 (PNG, JPG, JPEG)')
      return
    }

    setIsConverting(true)
    setProgress(0)

    try {
      const newResults: ConversionResult[] = []
      const totalFiles = validFiles.length

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        setProgress(((i + 1) / totalFiles) * 100)

        try {
          const result = await convertImage(file)
          newResults.push(result)
        } catch (err) {
          console.error(`转换 ${file.name} 失败:`, err)
        }
      }

      if (newResults.length > 0) {
        setResults(prev => [...newResults, ...prev])
        setSuccess(`成功转换 ${newResults.length} 个文件！`)
      } else {
        setError('所有文件转换失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换过程中发生错误')
    } finally {
      setIsConverting(false)
      setProgress(0)
    }
  }, [convertImage])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const downloadFile = (result: ConversionResult) => {
    const link = document.createElement('a')
    link.href = result.url
    const originalName = result.originalFile.name
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
    link.download = `${nameWithoutExt}.webp`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAllAsZip = async () => {
    if (results.length === 0) return

    setIsDownloading(true)
    setError(null)

    try {
      const zip = new JSZip()
      
      // 添加所有转换后的文件到 ZIP
      for (const result of results) {
        const originalName = result.originalFile.name
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
        const fileName = `${nameWithoutExt}.webp`
        
        // 将 Blob 添加到 ZIP
        zip.file(fileName, result.convertedBlob)
      }

      // 生成 ZIP 文件
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      })
      
      // 创建下载链接
      const link = document.createElement('a')
      link.href = URL.createObjectURL(zipBlob)
      link.download = `converted-images-${new Date().toISOString().slice(0, 10)}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 清理 URL
      URL.revokeObjectURL(link.href)
      
      setSuccess(`成功打包下载 ${results.length} 个文件！`)
    } catch (error) {
      console.error('批量下载失败:', error)
      setError('批量下载失败，请重试')
    } finally {
      setIsDownloading(false)
    }
  }

  const clearResults = () => {
    // 清理 URL
    results.forEach(r => URL.revokeObjectURL(r.url))
    setResults([])
    setSuccess(null)
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="converter-container">
      {/* 上传区域 */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={triggerFileInput}
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
      >
        <div className="upload-icon">📸</div>
        <h3 className="upload-title">
          拖拽图片到此处或点击上传
        </h3>
        <p className="upload-description">
          支持 PNG, JPG, JPEG 格式
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={onFileInputChange}
          className="file-input"
        />
      </div>

      {/* 进度条 */}
      {isConverting && (
        <div className="progress-container">
          <div className="progress-header">
            <span className="progress-label">转换中...</span>
            <span className="progress-percentage">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* 消息提示 */}
      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          ✅ {success}
        </div>
      )}

      {/* 结果区域 */}
      {results.length > 0 && (
        <div className="results-container">
          <div className="results-header">
            <h3 className="results-title">转换结果 ({results.length})</h3>
            <div className="results-actions">
              <button
                onClick={downloadAllAsZip}
                disabled={isDownloading}
                className="batch-download-btn"
              >
                {isDownloading ? '📦 打包中...' : '📦 批量下载 ZIP'}
              </button>
              <button
                onClick={clearResults}
                className="clear-btn"
              >
                清空
              </button>
            </div>
          </div>

          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className="result-item">
                <div className="result-header">
                  <div className="result-info">
                    <div className="result-filename">
                      {result.originalFile.name}
                    </div>
                    <div className="result-type">
                      {result.originalFile.type} → image/webp
                    </div>
                  </div>
                  <button
                    onClick={() => downloadFile(result)}
                    className="download-btn"
                  >
                    下载
                  </button>
                </div>

                <div className="result-stats">
                  <div className="stat-item">
                    <span className="stat-label">原始:</span>
                    <span className="stat-value">{formatSize(result.originalSize)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">转换后:</span>
                    <span className="stat-value">{formatSize(result.convertedSize)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">减少:</span>
                    <span className={`stat-value ${result.reduction > 0 ? 'positive' : 'negative'}`}>
                      {result.reduction > 0 ? `-${result.reduction}%` : `+${Math.abs(result.reduction)}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="converter-tip">
            💡 提示: 点击单个下载按钮保存图片，或使用&ldquo;批量下载 ZIP&rdquo;一次性下载所有转换后的 WebP 图片
          </div>
        </div>
      )}
    </div>
  )
}