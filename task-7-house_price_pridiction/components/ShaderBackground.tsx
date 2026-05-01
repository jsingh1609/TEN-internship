"use client";

import React, { useRef, useEffect } from "react";
import { useTheme } from "next-themes";

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec3 u_color;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( aa.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    float mouse_dist = distance(st, u_mouse);

    vec3 color = vec3(0.0);
    float t = u_time * 0.1;
    float noise = snoise(st * 3.0 + t);
    
    vec3 p_color = u_color;
    color = mix(p_color * 0.0, p_color * 0.4, smoothstep(0.1, 0.5, noise));
    
    float circle = 1.0 - smoothstep(0.0, 0.3, mouse_dist);
    color += circle * 0.15;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const ShaderBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Attempt to get a WebGL context, but fail gracefully if not available.
        const gl = canvas.getContext("webgl", { antialias: true, failIfMajorPerformanceCaveat: true });
        if (!gl) {
            console.warn("WebGL not supported or performance is too low, falling back."); 
            return;
        }

        const program = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) return;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        const timeLocation = gl.getUniformLocation(program, "u_time");
        const mouseLocation = gl.getUniformLocation(program, "u_mouse");
        const colorLocation = gl.getUniformLocation(program, "u_color");

        let mousePos = { x: 0.5, y: 0.5 };
        
        const handleMouseMove = (event: MouseEvent) => {
            mousePos = { x: event.clientX / window.innerWidth, y: 1 - event.clientY / window.innerHeight };
        };
        window.addEventListener('mousemove', handleMouseMove);

        let startTime = Date.now();
        let animationFrameId: number;
        function render() {
            if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            }
            
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program!);
            const positionAttributeLocation = gl.getAttribLocation(program!, "a_position");
            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeLocation, (Date.now() - startTime) * 0.001);
            gl.uniform2f(mouseLocation, mousePos.x, mousePos.y);

            const color = resolvedTheme === "dark" ? [0.61, 0.15, 0.69] : [0.4, 0.22, 0.71];
            gl.uniform3fv(colorLocation, color);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            animationFrameId = requestAnimationFrame(render);
        }
        render();

        return () => {
             window.removeEventListener('mousemove', handleMouseMove);
             cancelAnimationFrame(animationFrameId);
        }
    }, [resolvedTheme]);

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" />;
};

function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return null;

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return null;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
