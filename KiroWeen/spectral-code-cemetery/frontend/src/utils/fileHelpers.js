/**
 * Get file extension
 * @param {string} filePath - File path
 * @returns {string} Extension
 */
export function getFileExtension(filePath) {
  if (!filePath) return ''
  const parts = filePath.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

/**
 * Get file name from path
 * @param {string} filePath - File path
 * @returns {string} File name
 */
export function getFileName(filePath) {
  if (!filePath) return ''
  return filePath.split('/').pop()
}

/**
 * Get file directory
 * @param {string} filePath - File path
 * @returns {string} Directory path
 */
export function getFileDirectory(filePath) {
  if (!filePath) return ''
  const parts = filePath.split('/')
  parts.pop()
  return parts.join('/') || '/'
}

/**
 * Determine file type category
 * @param {string} filePath - File path
 * @returns {string} Category
 */
export function getFileCategory(filePath) {
  const ext = getFileExtension(filePath)
  
  const categories = {
    code: ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'go', 'rs', 'rb', 'php', 'c', 'cpp', 'cs'],
    style: ['css', 'scss', 'sass', 'less', 'styl'],
    markup: ['html', 'xml', 'svg', 'md', 'mdx'],
    config: ['json', 'yaml', 'yml', 'toml', 'ini', 'env'],
    image: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp'],
    document: ['txt', 'pdf', 'doc', 'docx'],
  }
  
  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(ext)) return category
  }
  
  return 'other'
}

/**
 * Get icon for file type
 * @param {string} filePath - File path
 * @returns {string} Icon name (lucide-react)
 */
export function getFileIcon(filePath) {
  const category = getFileCategory(filePath)
  
  const icons = {
    code: 'Code',
    style: 'Palette',
    markup: 'FileText',
    config: 'Settings',
    image: 'Image',
    document: 'File',
    other: 'FileQuestion',
  }
  
  return icons[category] || 'File'
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, index)
  
  return `${size.toFixed(2)} ${units[index]}`
}
