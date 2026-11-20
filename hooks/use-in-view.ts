"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Reports whether an element has scrolled into view. Once seen, it stays
 * `true`, so scroll-reveal animations play once instead of flickering.
 * Falls back to visible where IntersectionObserver is unavailable.
 */
export function useInView<T extends Element>(options: IntersectionObserverInit = { threshold: 0.2 }) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const { root, rootMargin, threshold } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === "undefined") {
      // Deferred so the state change doesn't run synchronously inside the effect.
      const id = requestAnimationFrame(() => setInView(true))
      return () => cancelAnimationFrame(id)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { root, rootMargin, threshold }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [root, rootMargin, threshold])

  return { ref, inView }
}
