'use client'

import { useState, useCallback, useRef } from 'react'

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 上传区域 */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={triggerFileInput}
        style={{
          border: `2px dashed ${isDragging ? '#2563eb' : '#cbd5e1'}`,
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center' as const,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          background: isDragging ? 'rgba(37, 99, 235, 0.1)' : 'rgba(255, 255, 255, 0.5)',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          borderColor: isDragging ? '#2563eb' : '#cbd5e1'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          拖拽图片到此处或点击上传
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          支持 PNG, JPG, JPEG 格式
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={onFileInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* 进度条 */}
      {isConverting && (
        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 500 }}>转换中...</span>
            <span style={{ fontWeight: 600 }}>{Math.round(progress)}%</span>
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
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>转换结果</h3>
            <button
              onClick={clearResults}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              清空
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map((result, index) => (
              <div key={index} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem',
                background: '#f8fafc'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                      {result.originalFile.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {result.originalFile.type} → image/webp
                    </div>
                  </div>
                  <button
                    onClick={() => downloadFile(result)}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    下载
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>原始:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{formatSize(result.originalSize)}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>转换后:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{formatSize(result.convertedSize)}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>减少:</span>{' '}
                    <span style={{
                      fontWeight: 600,
                      color: result.reduction > 0 ? '#10b981' : '#ef4444'
                    }}>
                      {result.reduction > 0 ? `-${result.reduction}%` : `+${Math.abs(result.reduction)}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#dbeafe', borderRadius: '6px', fontSize: '0.875rem', color: '#1e40af' }}>
            💡 提示: 点击下载按钮保存转换后的 WebP 图片
          </div>
        </div>
      )}
    </div>
  )
}