import { vertexShaderSource, fragmentShaderSource } from './shaders'
import { createTextTexture } from './useTextTexture'

export interface WebGLSetupResult {
  program: WebGLProgram
  positionBuffer: WebGLBuffer
  texCoordBuffer: WebGLBuffer
  texture: WebGLTexture
  locations: {
    position: number
    texCoord: number
    texture: WebGLUniformLocation
    mouse: WebGLUniformLocation
    resolution: WebGLUniformLocation
    specialTextPos: WebGLUniformLocation
    mouseInside: WebGLUniformLocation
    scale: WebGLUniformLocation
    colorRadiusPixels: WebGLUniformLocation
    magnifyRadiusPixels: WebGLUniformLocation
    time: WebGLUniformLocation
  }
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

export function setupWebGL(
  gl: WebGLRenderingContext,
  specialTextPosRef: React.MutableRefObject<{ x: number; y: number }>
): WebGLSetupResult | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

  if (!vertexShader || !fragmentShader) return null

  const program = createProgram(gl, vertexShader, fragmentShader)
  if (!program) return null

  const positionBuffer = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]), gl.STATIC_DRAW)

  const texCoordBuffer = gl.createBuffer()!
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 1,
    1, 1,
    0, 0,
    1, 0,
  ]), gl.STATIC_DRAW)

  const texture = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const textResult = createTextTexture()
  if (textResult) {
    specialTextPosRef.current = textResult.specialTextPos
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textResult.canvas)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  }

  return {
    program,
    positionBuffer,
    texCoordBuffer,
    texture,
    locations: {
      position: gl.getAttribLocation(program, 'a_position'),
      texCoord: gl.getAttribLocation(program, 'a_texCoord'),
      texture: gl.getUniformLocation(program, 'u_texture')!,
      mouse: gl.getUniformLocation(program, 'u_mouse')!,
      resolution: gl.getUniformLocation(program, 'u_resolution')!,
      specialTextPos: gl.getUniformLocation(program, 'u_specialTextPos')!,
      mouseInside: gl.getUniformLocation(program, 'u_mouseInside')!,
      scale: gl.getUniformLocation(program, 'u_scale')!,
      colorRadiusPixels: gl.getUniformLocation(program, 'u_colorRadiusPixels')!,
      magnifyRadiusPixels: gl.getUniformLocation(program, 'u_magnifyRadiusPixels')!,
      time: gl.getUniformLocation(program, 'u_time')!,
    },
  }
}

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  specialTextPosRef: React.MutableRefObject<{ x: number; y: number }>
) {
  const viewportWidth = window.innerWidth
  const isDesktop = viewportWidth >= 768

  let targetWidth
  if (isDesktop) {
    targetWidth = Math.min(viewportWidth * 0.8, 1000)
  } else {
    targetWidth = viewportWidth - 40
  }

  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return

  tempCtx.font = '12px monospace'
  const actualCharWidth = tempCtx.measureText('данные ').width / 7

  const internalPadding = isDesktop ? 80 : 15
  const availableTextWidth = targetWidth - (internalPadding * 2)

  const baseCharsPerLine = Math.floor(availableTextWidth / actualCharWidth)
  const evenCharsPerLine = baseCharsPerLine % 2 === 0 ? baseCharsPerLine : baseCharsPerLine - 1
  const minCharsNeeded = 20
  const finalCharsPerLine = Math.max(evenCharsPerLine, minCharsNeeded)

  const actualCanvasWidth = (finalCharsPerLine * actualCharWidth) + (internalPadding * 2)

  canvas.width = actualCanvasWidth
  canvas.height = window.innerHeight

  canvas.style.width = actualCanvasWidth + 'px'
  canvas.style.height = canvas.height + 'px'

  gl.viewport(0, 0, canvas.width, canvas.height)

  const textResult = createTextTexture()
  if (textResult) {
    specialTextPosRef.current = textResult.specialTextPos
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textResult.canvas)
  }
}
