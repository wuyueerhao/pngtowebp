'use client'

import { useState, useCallback, useRef } from 'react'

interface ConversionSettings {
  quality: number
  resize: boolean
  width?: number
  height?: number
  maintainAspectRatio: boolean
}

interface AdvancedResult {
  originalFile: File
  convertedBlob: Blob
  originalSize: number
  convertedSize: number
  reduction: number
  url: string
  settings: ConversionSettings
}

export default function AdvancedConverter() {
  const [isDragging, setIsDragging] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<AdvancedResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [settings, setSettings] = useState<ConversionSettings>({
    quality: 0.9,
    resize: false,
    maintainAspectRatio: true
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateImageFile = (file: File): boolean => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
    return validTypes.includes(file.type)
  }

  const convertImage = useCallback(async (file: File, settings: ConversionSettings): Promise<AdvancedResult> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new Image()

        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('无法创建画布上下文'))
            return
          }

          let targetWidth = img.width
          let targetHeight = img.height

          // 处理尺寸调整
          if (settings.resize) {
            if (settings.width && settings.height) {
              if (settings.maintainAspectRatio) {
                const ratio = Math.min(settings.width / img.width, settings.height / img.height)
                targetWidth = img.width * ratio
                targetHeight = img.height * ratio
              } else {
                targetWidth = settings.width
                targetHeight = settings.height
              }
            } else if (settings.width) {
              targetWidth = settings.width
              targetHeight = settings.maintainAspectRatio ? (img.height * settings.width / img.width) : img.height
            } else if (settings.height) {
              targetHeight = settings.height
              targetWidth = settings.maintainAspectRatio ? (img.width * settings.height / img.height) : img.width
            }
          }

          canvas.width = targetWidth
          canvas.height = targetHeight

          // 高质量绘制
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

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
                url,
                settings: { ...settings }
              })
            },
            'image/webp',
            settings.quality
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
      setError('请选择有效的图片文件 (PNG, JPG, JPEG, GIF, WebP)')
      return
    }

    setIsConverting(true)
    setProgress(0)

    try {
      const newResults: AdvancedResult[] = []
      const totalFiles = validFiles.length

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        setProgress(((i + 1) / totalFiles) * 100)

        try {
          const result = await convertImage(file, settings)
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
  }, [convertImage, settings])

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

  const downloadFile = (result: AdvancedResult) => {
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
      {/* 设置面板 */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          转换设置
        </h3>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* 质量设置 */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              图片质量: <span style={{ color: '#3b82f6', fontWeight: 600 }}>{Math.round(settings.quality * 100)}%</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={settings.quality * 100}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                quality: parseInt(e.target.value) / 100
              }))}
              style={{ 
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#e2e8f0',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              <span>低质量 (小文件)</span>
              <span>高质量 (大文件)</span>
            </div>
          </div>

          {/* 尺寸调整 */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="checkbox"
                checked={settings.resize}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  resize: e.target.checked
                }))}
              />
              <span style={{ fontWeight: 500 }}>调整尺寸</span>
            </label>

            {settings.resize && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '0.5rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      宽度 (px)
                    </label>
                    <input
                      type="number"
                      placeholder="自动"
                      value={settings.width || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        width: e.target.value ? parseInt(e.target.value) : undefined
                      }))}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      高度 (px)
                    </label>
                    <input
                      type="number"
                      placeholder="自动"
                      value={settings.height || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        height: e.target.value ? parseInt(e.target.value) : undefined
                      }))}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>

                {/* 预设尺寸 */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    常用尺寸预设
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[
                      { name: '1920×1080', width: 1920, height: 1080 },
                      { name: '1280×720', width: 1280, height: 720 },
                      { name: '800×600', width: 800, height: 600 },
                      { name: '500×500', width: 500, height: 500 },
                      { name: '清除', width: undefined, height: undefined }
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          width: preset.width,
                          height: preset.height
                        }))}
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          color: preset.name === '清除' ? '#ef4444' : '#374151'
                        }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={settings.maintainAspectRatio}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      maintainAspectRatio: e.target.checked
                    }))}
                  />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>保持宽高比</span>
                </label>

                <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#eff6ff', borderRadius: '4px', fontSize: '0.75rem', color: '#1e40af' }}>
                  💡 提示: 
                  {settings.maintainAspectRatio 
                    ? ' 启用保持比例时，只需设置宽度或高度，另一个值会自动计算'
                    : ' 关闭保持比例时，可以自由设置宽度和高度，图片可能会变形'
                  }
                </div>
              </div>
            )}
          </div>

          {/* 当前设置摘要 */}
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0369a1' }}>
              📋 当前设置
            </h4>
            <div style={{ fontSize: '0.75rem', color: '#0c4a6e', lineHeight: '1.4' }}>
              <div>• 质量: {Math.round(settings.quality * 100)}%</div>
              {settings.resize ? (
                <>
                  <div>• 尺寸调整: 启用</div>
                  <div>• 目标尺寸: {settings.width || '自动'} × {settings.height || '自动'} px</div>
                  <div>• 保持比例: {settings.maintainAspectRatio ? '是' : '否'}</div>
                </>
              ) : (
                <div>• 尺寸调整: 保持原始尺寸</div>
              )}
            </div>
          </div>
        </div>
      </div>

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
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          拖拽图片到此处或点击上传
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          支持 PNG, JPG, JPEG, GIF, WebP 格式，可批量处理
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>转换结果 ({results.length})</h3>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
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

                {/* 设置信息 */}
                <div style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.5rem', borderRadius: '4px' }}>
                  <div>质量: {Math.round(result.settings.quality * 100)}%</div>
                  {result.settings.resize && (
                    <div>
                      尺寸: {result.settings.width || '自动'}×{result.settings.height || '自动'} {result.settings.maintainAspectRatio ? '(保持比例)' : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#dbeafe', borderRadius: '6px', fontSize: '0.875rem', color: '#1e40af' }}>
            💡 提示: 所有转换在浏览器本地完成，无需上传到服务器，保护您的隐私
          </div>
        </div>
      )}
    </div>
  )
}