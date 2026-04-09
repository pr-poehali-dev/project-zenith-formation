export const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`

export const fragmentShaderSource = `
  precision mediump float;

  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform vec2 u_specialTextPos;
  uniform bool u_mouseInside;
  uniform float u_scale;
  uniform float u_colorRadiusPixels;
  uniform float u_magnifyRadiusPixels;
  uniform float u_time;

  varying vec2 v_texCoord;

  // Simplified HSV to RGB for subtle iridescence
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  // Enhanced scanlines effect with proper visibility
  float scanlines(vec2 coord) {
    float line = sin(coord.y * u_resolution.y * 1.5) * 0.15 + 0.85;
    return line;
  }

  // Added phosphor glow effect
  vec3 phosphorGlow(vec3 color, vec2 coord) {
    float glow = sin(coord.x * u_resolution.x * 3.0) * 0.02 + 0.98;
    return color * glow;
  }

  // Added vignette effect
  float vignette(vec2 coord) {
    vec2 center = coord - 0.5;
    float dist = length(center);
    return 1.0 - smoothstep(0.3, 0.8, dist);
  }

  // Added subtle noise
  float noise(vec2 coord) {
    return fract(sin(dot(coord, vec2(12.9898, 78.233)) + u_time * 0.001) * 43758.5453) * 0.03 + 0.97;
  }

  void main() {
    vec2 coord = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;

    vec4 color = texture2D(u_texture, coord);

    // Only apply distortion if mouse is inside canvas
    if (u_mouseInside) {
      // Convert to pixel coordinates for dimension-independent calculations
      vec2 pixelCoord = coord * u_resolution;
      vec2 pixelMouse = u_mouse;
      vec2 pixelSpecialTextPos = u_specialTextPos * u_resolution;

      // Calculate distance in pixels
      float pixelDist = distance(pixelCoord, pixelMouse);

      // Use fixed pixel-based magnification radius
      if (pixelDist < u_magnifyRadiusPixels) {
        float factor = (u_magnifyRadiusPixels - pixelDist) / u_magnifyRadiusPixels;
        factor = smoothstep(0.0, 1.0, factor);

        // Scale texture coordinates toward mouse position for magnification
        vec2 direction = coord - mouse;
        coord = mouse + direction * (1.0 - factor * 0.5);

        vec4 distortedColor = texture2D(u_texture, coord);

        // Use pixel-based elliptical distance for color dispersion
        vec2 pixelDistortedCoord = coord * u_resolution;
        vec2 toSpecialTextPixels = pixelDistortedCoord - pixelSpecialTextPos;
        toSpecialTextPixels.y *= 2.5; // Fixed vertical constraint
        float ellipticalPixelDistance = length(toSpecialTextPixels);

        // Only apply iridescence using fixed pixel threshold
        if (ellipticalPixelDistance < u_colorRadiusPixels &&
            distortedColor.r > 0.3 && distortedColor.r < 0.9 && factor > 0.3) {

          // Calculate angle for color dispersion
          vec2 colorToSpecialTextPixels = pixelDistortedCoord - pixelSpecialTextPos;
          float angle = atan(colorToSpecialTextPixels.y, colorToSpecialTextPixels.x);
          float normalizedAngle = (angle + 3.14159) / (2.0 * 3.14159);

          float hue = normalizedAngle;
          vec3 iridescenceColor = hsv2rgb(vec3(hue, 1.0, 1.0));

          // Fixed intensity calculation
          float proximityFactor = 1.0 - (ellipticalPixelDistance / u_colorRadiusPixels);
          float iridescenceIntensity = proximityFactor * factor * 0.8;
          distortedColor.rgb = mix(distortedColor.rgb, iridescenceColor, iridescenceIntensity);
        }

        color = distortedColor;
      }
    }

    // Apply CRT effects without curvature
    color.rgb *= scanlines(v_texCoord);
    color.rgb = phosphorGlow(color.rgb, v_texCoord);
    color.rgb *= vignette(v_texCoord);
    color.rgb *= noise(v_texCoord);

    gl_FragColor = color;
  }
`
