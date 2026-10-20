// A local perspective carousel. Only transform and opacity animate; page scroll stays native.
export function mountExpertiseCarousel(root, onChange, reducedMotion = false) {
  const scene = root.querySelector('.expertise-scene')
  const cards = [...root.querySelectorAll('.expertise-card')]
  if (!scene || !cards.length) return { showEntry() {}, destroy() {} }
  let active = 0
  let width = 0
  let inView = typeof IntersectionObserver === 'undefined'
  let focused = false
  let disposed = false
  let busy = false
  let timer = 0
  let frame = 0
  let generation = 0
  let animations = []
  let pointer = null
  const listeners = []
  const modulo = index => (index % cards.length + cards.length) % cards.length
  const slot = (index, front) => {
    const offset = modulo(index - front)
    return offset > cards.length / 2 ? offset - cards.length : offset
  }
  const pose = (offset, back = false) => ({
    transform: `translate3d(calc(-50% + ${offset * width * .79}px), -50%, ${back ? -width : -Math.abs(offset) * Math.min(240, width * .26)}px) rotateY(${-offset * 48}deg)`,
    opacity: back ? 0 : offset === 0 ? 1 : .66,
  })
  const listen = (target, name, callback, options) => {
    target.addEventListener(name, callback, options)
    listeners.push(() => target.removeEventListener(name, callback, options))
  }
  const stopTimer = () => { window.clearTimeout(timer); timer = 0 }
  function schedule() {
    stopTimer()
    if (disposed || busy || !width || focused || !inView || document.hidden || reducedMotion || cards.length < 2) return
    timer = window.setTimeout(() => showEntry(active + 1), 3000)
  }
  function settle() {
    cards.forEach((card, index) => {
      const offset = slot(index, active)
      const target = pose(offset)
      card.style.transform = target.transform
      card.style.opacity = reducedMotion && offset ? '0' : String(target.opacity)
    })
  }
  function cancel() {
    generation++
    animations.forEach(animation => animation.cancel())
    animations = []
    busy = false
  }
  function measure() {
    frame = 0
    if (disposed) return
    cancel()
    width = cards[0].offsetWidth
    settle()
    schedule()
  }
  const resize = () => { if (!disposed && !frame) frame = window.requestAnimationFrame(measure) }
  function showEntry(index) {
    if (disposed || busy) return
    const next = modulo(index)
    if (next === active) { schedule(); return }
    stopTimer()
    const previous = active
    active = next
    onChange(active)
    if (reducedMotion || !width || !cards[0].animate) { settle(); schedule(); return }
    busy = true
    const token = ++generation
    cards.forEach((card, cardIndex) => {
      const from = slot(cardIndex, previous)
      const to = slot(cardIndex, active)
      // The third card returns behind the scene, never sweeping across the reading card.
      const keyframes = Math.abs(to - from) > 1
        ? [pose(from), { ...pose(from * 1.35, true), offset: .22 }, { ...pose(to * 1.35, true), offset: .78 }, pose(to)]
        : [pose(from), pose(to)]
      animations.push(card.animate(keyframes, { duration: 1200, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' }))
    })
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (disposed || token !== generation) return
      settle()
      cancel()
      schedule()
    }).catch(() => {})
  }
  listen(document, 'visibilitychange', schedule)
  listen(window, 'resize', resize)
  listen(window, 'pageshow', resize)
  listen(root, 'focusin', event => { focused = event.target?.matches?.(':focus-visible') ?? true; schedule() })
  listen(root, 'focusout', event => { if (!root.contains(event.relatedTarget)) focused = false; schedule() })
  listen(scene, 'pointerdown', event => {
    if (event.isPrimary === false || (event.button != null && event.button !== 0)) return
    pointer = { x: event.clientX, y: event.clientY }
  }, { passive: true })
  listen(scene, 'pointerup', event => {
    if (!pointer) return
    const dx = event.clientX - pointer.x
    const dy = event.clientY - pointer.y
    pointer = null
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) showEntry(active + (dx < 0 ? 1 : -1))
  }, { passive: true })
  listen(scene, 'pointercancel', () => { pointer = null }, { passive: true })
  const intersection = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    schedule()
  }, { threshold: .15 })
  intersection?.observe(scene)
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
  observer?.observe(scene)
  document.fonts?.ready.then(() => { if (!disposed) resize() })
  measure()
  onChange(active)
  return {
    showEntry,
    destroy() {
      disposed = true
      stopTimer()
      cancel()
      if (frame) window.cancelAnimationFrame(frame)
      intersection?.disconnect()
      observer?.disconnect()
      listeners.forEach(remove => remove())
      cards.forEach(card => { card.style.transform = ''; card.style.opacity = '' })
    },
  }
}
