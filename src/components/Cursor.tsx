import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './Cursor.css'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = cursorRef.current
    const ring = followerRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let posX = 0
    let posY = 0
    let rafId: number

    function onMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.set(dot!, { x: mouseX, y: mouseY })
    }

    function animate() {
      posX += (mouseX - posX) * 0.12
      posY += (mouseY - posY) * 0.12
      gsap.set(ring!, { x: posX, y: posY })
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(animate)

    // Event delegation — works for all elements including dynamically rendered ones (e.g. Hero)
    const HOVER_SELECTOR = 'a, button, [data-cursor="hover"], [data-cursor="magnetic"]'

    function onEnter(e: MouseEvent) {
      const target = (e.target as Element).closest(HOVER_SELECTOR)
      if (!target) return

      const isMagnetic = target.getAttribute('data-cursor') === 'magnetic'

      dot!.classList.add('cursor--hover')
      ring!.classList.add('follower--hover')

      if (isMagnetic) {
        dot!.classList.add('cursor--magnetic')
        ring!.classList.add('follower--magnetic')
      }
    }

    function onLeave(e: MouseEvent) {
      const target = (e.target as Element).closest(HOVER_SELECTOR)
      if (!target) return

      dot!.classList.remove('cursor--hover', 'cursor--magnetic')
      ring!.classList.remove('follower--hover', 'follower--magnetic')
    }

    function onMouseDown() {
      dot!.classList.add('cursor--click')
      ring!.classList.add('follower--click')
    }

    function onMouseUp() {
      dot!.classList.remove('cursor--click')
      ring!.classList.remove('follower--click')
    }

    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  )
}
