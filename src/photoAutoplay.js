// Keep the photographic feature moving locally, without intercepting page scrolling.
export function mountPhotoAutoplay(element, onAdvance, reducedMotion = false) {
  let timer = 0
  let disposed = false
  let paused = false
  let inView = typeof IntersectionObserver === 'undefined'

  function reset() {
    window.clearTimeout(timer)
    timer = 0
    if (disposed || reducedMotion || paused || !inView || document.hidden) return
    timer = window.setTimeout(() => {
      onAdvance()
      reset()
    }, 3000)
  }

  const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    reset()
  }, { threshold: .1 })
  observer?.observe(element)
  document.addEventListener('visibilitychange', reset)
  reset()

  return {
    reset,
    setPaused(value) { paused = value; reset() },
    destroy() {
      disposed = true
      window.clearTimeout(timer)
      observer?.disconnect()
      document.removeEventListener('visibilitychange', reset)
    },
  }
}
