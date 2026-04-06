import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber'
import * as THREE from 'three'

// ── Torus-knot wireframe ─────────────────────────────────────────────────────
function KnotMesh({ paused }: { paused: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const target = useRef({ x: 0, y: 0 })

  useThree(({ gl }) => {
    const el = gl.domElement.parentElement!
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      target.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      target.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2
      invalidate()
    }
    el.addEventListener('mousemove', onMove, { passive: true })
    return () => el.removeEventListener('mousemove', onMove)
  })

  const geo = useMemo(() => new THREE.TorusKnotGeometry(1.6, 0.42, 120, 20, 2, 3), [])

  useFrame((_, delta) => {
    if (!meshRef.current || paused) return
    const r = meshRef.current.rotation
    r.y += delta * 0.18 + (target.current.x * 0.3 - r.y) * 0.015
    r.x += delta * 0.06 + (-target.current.y * 0.2 - r.x) * 0.015
    invalidate()
  })

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshBasicMaterial color="#c0380a" wireframe transparent opacity={0.55} />
    </mesh>
  )
}

// ── Outer sphere wireframe ───────────────────────────────────────────────────
function OuterSphere({ paused }: { paused: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => new THREE.SphereGeometry(2.7, 20, 20), [])
  useFrame((_, delta) => {
    if (!ref.current || paused) return
    ref.current.rotation.y -= delta * 0.05
    ref.current.rotation.x += delta * 0.02
  })
  return (
    <mesh ref={ref} geometry={geo}>
      <meshBasicMaterial color="#8b1a00" wireframe transparent opacity={0.12} />
    </mesh>
  )
}

// ── Orbit ring ───────────────────────────────────────────────────────────────
function OrbitRing({ rx = 0, ry = 0, rz = 0, speed = 0.3, paused }: {
  rx?: number; ry?: number; rz?: number; speed?: number; paused: boolean
}) {
  const ref = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => {
    const g = new THREE.TorusGeometry(2.3, 0.018, 6, 80)
    const count = g.attributes.position.count
    const colors = new Float32Array(count * 3)
    const col = new THREE.Color('#00E1F0')
    for (let i = 0; i < count; i++) {
      colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [])

  useFrame((_, delta) => {
    if (ref.current && !paused) ref.current.rotation.z += delta * speed
  })

  return (
    <mesh ref={ref} rotation={[rx, ry, rz]} geometry={geo}>
      <meshBasicMaterial vertexColors transparent opacity={0.9} />
    </mesh>
  )
}

// ── Dot particles ────────────────────────────────────────────────────────────
function Particles({ paused }: { paused: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, colors } = useMemo(() => {
    const slots: [number, number, number][] = [
      [-0.35, 0.9, 0.4], [0.1, 0.55, 0.6], [-0.55, -0.2, 0.2],
      [-0.2, -0.65, 0.3], [2.6, 0.25, 0], [1.8, -0.7, 0],
      [-2.6, 0.1, 0], [0.9, -2.0, 0], [2.1, 0.9, 0],
    ]
    const pos = new Float32Array(slots.length * 3)
    const col = new Float32Array(slots.length * 3)
    const c = new THREE.Color('#00E1F0')
    slots.forEach(([x, y, z], i) => {
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    })
    return { positions: pos, colors: col }
  }, [])

  useFrame((state) => {
    if (ref.current && !paused) ref.current.rotation.y = state.clock.elapsedTime * 0.12
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors sizeAttenuation transparent opacity={0.95} />
    </points>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function OrbitalSphere() {
  const [paused, setPaused] = useState(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setPaused(true)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => setPaused(false), 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
    }
  }, [])

  return (
    <div className="orbital-canvas">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 52 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
        frameloop="demand"
        style={{ width: '100%', height: '100%', cursor: 'grab', pointerEvents: 'none' }}
      >
        <OuterSphere paused={paused} />
        <KnotMesh paused={paused} />
        <OrbitRing rx={Math.PI / 2.4} ry={0.3} rz={0} speed={0.22} paused={paused} />
        <OrbitRing rx={Math.PI / 6} ry={0.8} rz={0.5} speed={-0.14} paused={paused} />
        <Particles paused={paused} />
      </Canvas>
    </div>
  )
}
