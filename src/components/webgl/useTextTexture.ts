export interface TextTextureResult {
  canvas: HTMLCanvasElement
  specialTextPos: { x: number; y: number }
}

export function createTextTexture(): TextTextureResult | null {
  const textCanvas = document.createElement('canvas')
  const ctx = textCanvas.getContext('2d')
  if (!ctx) return null

  const viewportWidth = window.innerWidth
  const isDesktop = viewportWidth >= 768

  let targetWidth
  if (isDesktop) {
    targetWidth = Math.min(viewportWidth * 0.8, 1000)
  } else {
    targetWidth = viewportWidth - 40
  }

  ctx.font = '12px monospace'
  const actualCharWidth = ctx.measureText('данные ').width / 7 // 7 characters in "данные "

  const internalPadding = isDesktop ? 80 : 15
  const availableTextWidth = targetWidth - (internalPadding * 2)

  const baseCharsPerLine = Math.floor(availableTextWidth / actualCharWidth)
  const evenCharsPerLine = baseCharsPerLine % 2 === 0 ? baseCharsPerLine : baseCharsPerLine - 1
  const minCharsNeeded = 20
  const charsPerLine = Math.max(evenCharsPerLine, minCharsNeeded)

  const actualTextWidth = charsPerLine * actualCharWidth
  textCanvas.width = actualTextWidth + (internalPadding * 2)
  textCanvas.height = window.innerHeight

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, textCanvas.width, textCanvas.height)

  ctx.fillStyle = '#808080'
  ctx.font = '12px monospace'

  const text = 'данные '
  const specialText = 'CORP PORTAL'
  const lineHeight = 16

  const horizontalOffset = internalPadding
  const availableHeight = textCanvas.height
  const linesCount = Math.floor(availableHeight / lineHeight)
  const reservedBottomLines = 4

  // Calculate exact number of "данные " blocks per line
  const nopesPerLine = Math.floor(charsPerLine / text.length)

  let specialInserted = false
  const specialTextNormalizedPos = { x: 0, y: 0 }

  for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
    const y = lineIndex * lineHeight
    let line = ''

    const isInSpecialTextZone = lineIndex > linesCount * 0.7 && lineIndex < linesCount - reservedBottomLines

    if (!specialInserted && isInSpecialTextZone) {
      // Replace exactly 3 "данные " blocks to fit special text
      const nopesBeforeSpecial = nopesPerLine - 5 // Replace 3 nopes with special text, keep 2 after

      // Add nopes before special text
      for (let i = 0; i < nopesBeforeSpecial; i++) {
        line += text
      }

      // Add special text (replaces 3 nopes = 12 chars, specialText + space = 11 chars)
      line += specialText + ' '

      // Always 2 nopes after special text
      const remainingNopes = 2
      for (let i = 0; i < remainingNopes; i++) {
        line += text
      }

      // Fixed epicenter positioning to be consistent across screen sizes
      // Calculate position as percentage of line rather than fixed pixel offset
      const specialTextStartPos = nopesBeforeSpecial * text.length
      const etoPositionInSpecialText = 5 // "CORP " is 5 characters, so "PORTAL" starts at position 5
      const totalCharPosition = specialTextStartPos + etoPositionInSpecialText + 1 // +1 to center on "PORTAL"

      // Normalize position relative to total line length for consistency
      specialTextNormalizedPos.x = (horizontalOffset + (totalCharPosition * actualCharWidth)) / textCanvas.width
      specialTextNormalizedPos.y = (y + lineHeight) / textCanvas.height
      specialInserted = true

    } else {
      // Regular lines: exactly nopesPerLine "данные " blocks
      for (let i = 0; i < nopesPerLine; i++) {
        line += text
      }
    }

    ctx.fillText(line, horizontalOffset, y + lineHeight)
  }

  // Fallback with same consistent pattern
  if (!specialInserted) {
    const fallbackLineIndex = linesCount - reservedBottomLines - 1
    const y = fallbackLineIndex * lineHeight

    // Updated fallback to also replace 3 nopes
    const nopesBeforeSpecial = nopesPerLine - 5
    let line = ''

    for (let i = 0; i < nopesBeforeSpecial; i++) {
      line += text
    }

    line += specialText + ' '

    // Always 2 nopes after special text
    const remainingNopes = 2
    for (let i = 0; i < remainingNopes; i++) {
      line += text
    }

    // Applied same consistent positioning logic to fallback
    const specialTextStartPos = nopesBeforeSpecial * text.length
    const etoPositionInSpecialText = 5
    const totalCharPosition = specialTextStartPos + etoPositionInSpecialText + 1

    specialTextNormalizedPos.x = (horizontalOffset + (totalCharPosition * actualCharWidth)) / textCanvas.width
    specialTextNormalizedPos.y = (y + lineHeight) / textCanvas.height

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, y, textCanvas.width, lineHeight)
    ctx.fillStyle = '#808080'
    ctx.fillText(line, horizontalOffset, y + lineHeight)
  }

  return { canvas: textCanvas, specialTextPos: specialTextNormalizedPos }
}
