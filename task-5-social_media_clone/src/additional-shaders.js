// ADDITIONAL SHADER EFFECTS
// Copy these into the SHADER_CONFIGS object in social-media-feed-item.jsx

import * as THREE from 'three';

export const ADDITIONAL_SHADERS = {
  // 1. Glass Refraction Effect
  glassRefraction: {
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uHoverIntensity;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        float dist = distance(uv, uMouse);
        float influence = smoothstep(0.4, 0.0, dist) * uHoverIntensity;
        
        // Glass-like refraction
        vec2 offset = vec2(
          sin(uv.y * 15.0 + uTime * 2.0),
          cos(uv.x * 15.0 + uTime * 2.0)
        ) * 0.015 * influence;
        
        // Add radial distortion from mouse
        vec2 toMouse = uv - uMouse;
        float radialDist = length(toMouse);
        offset += normalize(toMouse) * sin(radialDist * 10.0 - uTime * 3.0) * 0.01 * influence;
        
        vec4 color = texture2D(uTexture, uv + offset);
        
        // Add slight brightness on hover
        color.rgb += 0.1 * influence;
        
        gl_FragColor = color;
      }
    `,
    uniforms: {
      uTexture: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uHoverIntensity: { value: 0 }
    }
  },

  // 2. Magnetic Field Effect
  magneticField: {
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uHoverIntensity;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        vec2 toMouse = uv - uMouse;
        float dist = length(toMouse);
        
        // Magnetic pull effect
        float pullStrength = smoothstep(0.5, 0.0, dist) * uHoverIntensity;
        vec2 pull = normalize(toMouse) * pullStrength * 0.05;
        
        // Circular motion around mouse
        float angle = atan(toMouse.y, toMouse.x);
        vec2 rotation = vec2(
          cos(angle + uTime),
          sin(angle + uTime)
        ) * pullStrength * 0.02;
        
        vec2 finalUV = uv - pull + rotation;
        vec4 color = texture2D(uTexture, finalUV);
        
        gl_FragColor = color;
      }
    `,
    uniforms: {
      uTexture: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uHoverIntensity: { value: 0 }
    }
  },

  // 3. Kaleidoscope Effect
  kaleidoscope: {
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uHoverIntensity;
      varying vec2 vUv;
      
      #define PI 3.14159265359
      
      void main() {
        vec2 uv = vUv;
        float dist = distance(uv, uMouse);
        float influence = smoothstep(0.5, 0.0, dist) * uHoverIntensity;
        
        // Convert to polar coordinates
        vec2 centered = uv - 0.5;
        float radius = length(centered);
        float angle = atan(centered.y, centered.x);
        
        // Create kaleidoscope segments
        float segments = 6.0 + influence * 4.0;
        angle = mod(angle, (2.0 * PI) / segments);
        angle = abs(angle - PI / segments);
        
        // Convert back to cartesian
        vec2 kaleidoUV = vec2(cos(angle), sin(angle)) * radius + 0.5;
        
        // Add rotation over time
        float rotation = uTime * 0.5 * influence;
        float cosR = cos(rotation);
        float sinR = sin(rotation);
        vec2 rotated = vec2(
          kaleidoUV.x * cosR - kaleidoUV.y * sinR,
          kaleidoUV.x * sinR + kaleidoUV.y * cosR
        ) + 0.5;
        
        vec4 color = texture2D(uTexture, mix(uv, rotated, influence));
        
        gl_FragColor = color;
      }
    `,
    uniforms: {
      uTexture: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uHoverIntensity: { value: 0 }
    }
  },

  // 4. RGB Chromatic Aberration
  rgbSplit: {
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uHoverIntensity;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        vec2 toMouse = uv - uMouse;
        float dist = length(toMouse);
        float influence = smoothstep(0.4, 0.0, dist) * uHoverIntensity;
        
        // Direction of chromatic split
        vec2 direction = normalize(toMouse);
        
        // Animated offset
        float offset = 0.02 * influence * (sin(uTime * 2.0) * 0.5 + 0.5);
        
        // Sample each color channel with offset
        float r = texture2D(uTexture, uv + direction * offset).r;
        float g = texture2D(uTexture, uv).g;
        float b = texture2D(uTexture, uv - direction * offset).b;
        
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `,
    uniforms: {
      uTexture: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uHoverIntensity: { value: 0 }
    }
  },

  // 5. Pixel Sort Glitch
  pixelSort: {
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uHoverIntensity;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 uv = vUv;
        float dist = distance(uv, uMouse);
        float influence = smoothstep(0.4, 0.0, dist) * uHoverIntensity;
        
        // Pixelation
        float pixelSize = mix(300.0, 20.0, influence);
        vec2 pixelatedUV = floor(uv * pixelSize) / pixelSize;
        
        // Horizontal sort glitch
        float sortOffset = random(vec2(pixelatedUV.y, floor(uTime * 2.0))) * 0.1 * influence;
        vec2 sortedUV = vec2(fract(pixelatedUV.x + sortOffset), pixelatedUV.y);
        
        vec4 color = texture2D(uTexture, sortedUV);
        
        // Add scan lines
        float scanline = sin(uv.y * 200.0 + uTime * 5.0) * 0.05 * influence;
        color.rgb += scanline;
        
        gl_FragColor = color;
      }
    `,
    uniforms: {
      uTexture: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uHoverIntensity: { value: 0 }
    }
  },

  // 6. Bubble Lens Effect
  bubbleLens: {
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uHoverIntensity;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        vec2 toMouse = uv - uMouse;
        float dist = length(toMouse);
        
        // Create bubble lens effect
        float lensRadius = 0.3 * uHoverIntensity;
        float lensPower = 1.5;
        
        if (dist < lensRadius) {
          float distRatio = dist / lensRadius;
          float lensEffect = pow(1.0 - distRatio, lensPower);
          
          // Magnify and distort
          vec2 offset = normalize(toMouse) * lensEffect * 0.1;
          uv = uv - offset;
          
          // Add color fringe at edges
          if (distRatio > 0.8) {
            float r = texture2D(uTexture, uv + offset * 0.01).r;
            float g = texture2D(uTexture, uv).g;
            float b = texture2D(uTexture, uv - offset * 0.01).b;
            gl_FragColor = vec4(r, g, b, 1.0);
            return;
          }
        }
        
        // Add subtle breathing animation
        float breathe = sin(uTime * 1.5) * 0.002 * uHoverIntensity;
        uv += normalize(toMouse) * breathe;
        
        gl_FragColor = texture2D(uTexture, uv);
      }
    `,
    uniforms: {
      uTexture: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uHoverIntensity: { value: 0 }
    }
  }
};

// USAGE EXAMPLES:

/* 
// 1. Add to your component:
import { ADDITIONAL_SHADERS } from './additional-shaders';

// Merge with existing shaders
const SHADER_CONFIGS = {
  liquidDistortion: { ... },
  ...ADDITIONAL_SHADERS
};

// 2. Use in your feed items:
<SocialMediaFeedItem post={post} shaderType="glassRefraction" />
<SocialMediaFeedItem post={post} shaderType="magneticField" />
<SocialMediaFeedItem post={post} shaderType="kaleidoscope" />
<SocialMediaFeedItem post={post} shaderType="rgbSplit" />
<SocialMediaFeedItem post={post} shaderType="pixelSort" />
<SocialMediaFeedItem post={post} shaderType="bubbleLens" />

// 3. Create a shader picker:
const shaders = ['liquidDistortion', 'glassRefraction', 'magneticField', 'kaleidoscope', 'rgbSplit', 'pixelSort', 'bubbleLens'];
const [currentShader, setCurrentShader] = useState('liquidDistortion');

<select onChange={(e) => setCurrentShader(e.target.value)}>
  {shaders.map(shader => (
    <option key={shader} value={shader}>{shader}</option>
  ))}
</select>

<SocialMediaFeedItem post={post} shaderType={currentShader} />
*/

// PERFORMANCE TIPS:
/*
1. Reduce shader complexity on mobile:
   const isMobile = window.innerWidth < 768;
   const shaderType = isMobile ? 'liquidDistortion' : 'kaleidoscope';

2. Adjust hover intensity for performance:
   material.uniforms.uHoverIntensity.value = isMobile ? 0.5 : 1.0;

3. Lower texture resolution on low-end devices:
   const texture = useTexture(imageUrl);
   texture.minFilter = THREE.LinearFilter;
   texture.generateMipmaps = false;
*/
