'use client'

import { useState, useCallback, useRef } from 'react'
import JSZip from 'jszip'

interface ConversionSettings {
  quality: number
  resize: boolean
  width?: number
  height?: number
  maintainAspectRatio: boolean
  originalAspectRatio?: number
  canvasMode: 'resize' | 'canvas'
  canvasColor: string
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
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<AdvancedResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [settings, setSettings] = useState<ConversionSettings>({
    quality: 0.9,
    resize: false,
    maintainAspectRatio: true,
    originalAspectRatio: 1,
    canvasMode: 'resize',
    canvasColor: 'transparent'
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理宽度变化，自动计算高度
  const handleWidthChange = (width: number | undefined) => {
    if (settings.maintainAspectRatio && width && settings.originalAspectRatio) {
      const calculatedHeight = Math.round(width / settings.originalAspectRatio)
      setSettings(prev => ({
        ...prev,
        width,
        height: calculatedHeight
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        width
      }))
    }
  }

  // 处理高度变化，自动计算宽度
  const handleHeightChange = (height: number | undefined) => {
    if (settings.maintainAspectRatio && height && settings.originalAspectRatio) {
      const calculatedWidth = Math.round(height * settings.originalAspectRatio)
      setSettings(prev => ({
        ...prev,
        height,
        width: calculatedWidth
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        height
      }))
    }
  }

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

          if (settings.resize && settings.width && settings.height) {
            if (settings.canvasMode === 'canvas') {
              // 画布模式：创建指定尺寸的画布
              canvas.width = settings.width
              canvas.height = settings.height

              // 设置背景色
              if (settings.canvasColor !== 'transparent') {
                ctx.fillStyle = settings.canvasColor
                ctx.fillRect(0, 0, canvas.width, canvas.height)
              }

              // 计算图片在画布中的尺寸（90%）
              const maxSize = Math.min(settings.width, settings.height) * 0.9
              const scale = Math.min(maxSize / img.width, maxSize / img.height)
              
              const scaledWidth = img.width * scale
              const scaledHeight = img.height * scale
              
              // 居中绘制
              const x = (canvas.width - scaledWidth) / 2
              const y = (canvas.height - scaledHeight) / 2
              
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
            } else {
              // 直接调整模式
              canvas.width = settings.width
              canvas.height = settings.height
              ctx.drawImage(img, 0, 0, settings.width, settings.height)
            }
          } else if (settings.resize && (settings.width || settings.height)) {
            if (settings.width && !settings.height) {
              targetWidth = settings.width
              targetHeight = settings.maintainAspectRatio 
                ? Math.round(settings.width / (img.width / img.height))
                : img.height
            } else if (settings.height && !settings.width) {
              targetHeight = settings.height
              targetWidth = settings.maintainAspectRatio 
                ? Math.round(settings.height * (img.width / img.height))
                : img.width
            }
            
            canvas.width = targetWidth
            canvas.height = targetHeight
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
          } else {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
          }

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

    // 设置原始宽高比
    if (validFiles.length > 0 && !settings.originalAspectRatio) {
      const firstFile = validFiles[0]
      const img = new Image()
      img.onload = () => {
        setSettings(prev => ({
          ...prev,
          originalAspectRatio: img.width / img.height
        }))
      }
      img.src = URL.createObjectURL(firstFile)
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

  const downloadAllAsZip = async () => {
    if (results.length === 0) return

    setIsDownloading(true)
    setError(null)

    try {
      const zip = new JSZip()
      
      for (const result of results) {
        const originalName = result.originalFile.name
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
        const fileName = `${nameWithoutExt}.webp`
        zip.file(fileName, result.convertedBlob)
      }

      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(zipBlob)
      link.download = `converted-images-${new Date().toISOString().slice(0, 10)}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
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
    <div className="advanced-converter">
      {/* 设置面板 */}
      <div className="advanced-settings">
        <h3 className="settings-title">转换设置</h3>

        <div className="settings-grid">
          {/* 质量设置 */}
          <div className="quality-setting">
            <label className="quality-label">
              图片质量: <span className="quality-value">{Math.round(settings.quality * 100)}%</span>
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
              className="quality-slider"
            />
            <div className="quality-labels">
              <span>低质量 (小文件)</span>
              <span>高质量 (大文件)</span>
            </div>
          </div>

          {/* 尺寸调整 */}
          <div className="size-settings">
            <label className="setting-row">
              <input
                type="checkbox"
                checked={settings.resize}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  resize: e.target.checked
                }))}
                className="setting-checkbox"
              />
              <span className="setting-label">调整尺寸</span>
            </label>

            {settings.resize && (
              <div className="size-settings-panel">
                {/* 调整模式选择 */}
                <div className="canvas-mode-setting">
                  <label className="setting-label">调整模式</label>
                  <div className="canvas-mode-options">
                    <label className="canvas-mode-option">
                      <input
                        type="radio"
                        name="canvasMode"
                        value="resize"
                        checked={settings.canvasMode === 'resize'}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          canvasMode: e.target.value as 'resize' | 'canvas'
                        }))}
                      />
                      <span>直接调整</span>
                    </label>
                    <label className="canvas-mode-option">
                      <input
                        type="radio"
                        name="canvasMode"
                        value="canvas"
                        checked={settings.canvasMode === 'canvas'}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          canvasMode: e.target.value as 'resize' | 'canvas'
                        }))}
                      />
                      <span>自定义画布大小</span>
                    </label>
                  </div>
                  <div className="mode-description">
                    {settings.canvasMode === 'resize' 
                      ? '直接将图片调整到指定尺寸' 
                      : '将图片等比放大并居中放置在指定尺寸的画布上'
                    }
                  </div>
                </div>

                {/* 画布背景色选择 - 仅在画布模式下显示 */}
                {settings.canvasMode === 'canvas' && (
                  <div className="canvas-color-setting">
                    <label className="setting-label">画布背景</label>
                    <div className="color-controls">
                      <select
                        value={settings.canvasColor}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          canvasColor: e.target.value
                        }))}
                        className="color-select"
                      >
                        <option value="transparent">透明</option>
                        <option value="#ffffff">白色</option>
                        <option value="#000000">黑色</option>
                        <option value="#f3f4f6">浅灰</option>
                        <option value="#e5e7eb">中灰</option>
                      </select>
                      {settings.canvasColor !== 'transparent' && (
                        <input
                          type="color"
                          value={settings.canvasColor}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            canvasColor: e.target.value
                          }))}
                          className="color-input"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* 保持宽高比选项 - 仅在直接调整模式下显示 */}
                {settings.canvasMode === 'resize' && (
                  <div className="aspect-ratio-setting">
                    <label className="setting-row">
                      <input
                        type="checkbox"
                        checked={settings.maintainAspectRatio}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          maintainAspectRatio: e.target.checked
                        }))}
                        className="setting-checkbox"
                      />
                      <span className="setting-label">保持宽高比</span>
                    </label>
                    {settings.originalAspectRatio && (
                      <div className="aspect-ratio-info">
                        当前比例: {settings.originalAspectRatio.toFixed(2)}:1
                      </div>
                    )}
                  </div>
                )}

                <div className="size-inputs">
                  <div className="size-input-group">
                    <label className="setting-label">
                      {settings.canvasMode === 'canvas' ? '画布宽度 (px)' : '宽度 (px)'}
                    </label>
                    <input
                      type="number"
                      placeholder="自动"
                      value={settings.width || ''}
                      onChange={(e) => handleWidthChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="size-input"
                    />
                  </div>

                  <div className="size-input-group">
                    <label className="setting-label">
                      {settings.canvasMode === 'canvas' ? '画布高度 (px)' : '高度 (px)'}
                    </label>
                    <input
                      type="number"
                      placeholder="自动"
                      value={settings.height || ''}
                      onChange={(e) => handleHeightChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="size-input"
                    />
                  </div>
                </div>

                {/* 预设尺寸 */}
                <div className="preset-section">
                  <label className="setting-label">常用尺寸预设</label>
                  <div className="preset-sizes">
                    {[
                      { name: '1920×1080', width: 1920, height: 1080 },
                      { name: '1280×720', width: 1280, height: 720 },
                      { name: '800×600', width: 800, height: 600 },
                      { name: '500×500', width: 500, height: 500 },
                      { name: '清除', width: undefined, height: undefined }
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          if (preset.width && preset.height) {
                            setSettings(prev => ({
                              ...prev,
                              width: preset.width,
                              height: preset.height,
                              originalAspectRatio: preset.width / preset.height
                            }))
                          } else {
                            setSettings(prev => ({
                              ...prev,
                              width: preset.width,
                              height: preset.height
                            }))
                          }
                        }}
                        className={`preset-btn ${preset.name === '清除' ? 'clear' : ''}`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-tip">
                  💡 提示: 
                  {settings.canvasMode === 'canvas'
                    ? ' 画布模式会将图片等比放大到画布尺寸的90%，然后居中放置，适合制作固定尺寸的图片'
                    : settings.maintainAspectRatio 
                      ? ' 启用保持比例时，修改宽度或高度会自动计算另一个值'
                      : ' 关闭保持比例时，可以自由设置宽度和高度，图片可能会变形'
                  }
                </div>
              </div>
            )}
          </div>

          {/* 当前设置摘要 */}
          <div className="settings-summary">
            <h4 className="summary-title">📋 当前设置</h4>
            <div className="summary-content">
              <div>• 质量: {Math.round(settings.quality * 100)}%</div>
              {settings.resize ? (
                <>
                  <div>• 尺寸调整: 启用</div>
                  <div>• 调整模式: {settings.canvasMode === 'canvas' ? '自定义画布大小' : '直接调整'}</div>
                  <div>• 目标尺寸: {settings.width || '自动'} × {settings.height || '自动'} px</div>
                  {settings.canvasMode === 'resize' && (
                    <div>• 保持比例: {settings.maintainAspectRatio ? '是' : '否'}</div>
                  )}
                  {settings.canvasMode === 'canvas' && (
                    <div>• 画布背景: {settings.canvasColor === 'transparent' ? '透明' : settings.canvasColor}</div>
                  )}
                  {settings.originalAspectRatio && (
                    <div>• 原始比例: {settings.originalAspectRatio.toFixed(2)}:1</div>
                  )}
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
        className={`advanced-upload-area ${isDragging ? 'dragging' : ''}`}
      >
        <div className="upload-icon">📁</div>
        <h3 className="upload-title">拖拽图片到此处或点击上传</h3>
        <p className="upload-description">支持 PNG, JPG, JPEG, GIF, WebP 格式，可批量处理</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
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
              <button onClick={clearResults} className="clear-btn">
                清空
              </button>
            </div>
          </div>

          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className="advanced-result-item">
                <div className="advanced-result-header">
                  <div className="advanced-result-info">
                    <div className="result-filename">{result.originalFile.name}</div>
                    <div className="result-type">{result.originalFile.type} → image/webp</div>
                    <div className="advanced-result-settings">
                      质量: {Math.round(result.settings.quality * 100)}%
                      {result.settings.resize && (
                        <> | 尺寸: {result.settings.width || '自动'}×{result.settings.height || '自动'} {result.settings.maintainAspectRatio ? '(保持比例)' : ''}</>
                      )}
                    </div>
                  </div>
                  <button onClick={() => downloadFile(result)} className="download-btn">
                    下载
                  </button>
                </div>

                <div className="advanced-result-stats">
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
            💡 提示: 所有转换在浏览器本地完成，无需上传到服务器，保护您的隐私。使用&ldquo;批量下载 ZIP&rdquo;可一次性下载所有转换后的图片
          </div>
        </div>
      )}
    </div>
  )
}