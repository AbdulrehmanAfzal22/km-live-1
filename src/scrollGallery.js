// Recognition autoplays locally; qualifications advance one complete card per gesture.
export function mountScrollGallery(stage, onActiveIndex, reducedMotion = false, layout = 'horizontal') {
  if (layout === 'stack') return mountStepStack(stage, onActiveIndex, reducedMotion)
  const viewport = stage.querySelector('.scroll-gallery-viewport')
  const track = stage.querySelector('.scroll-gallery-track')
  const cards = [...stage.querySelectorAll('.scroll-gallery-panel')]
  if (!viewport || !track || !cards.length) return { destroy() {}, showEntry() {}, setPaused() {} }

  let active = 0
  let timer = 0
  let frame = 0
  let disposed = false
  let enhanced = false
  let paused = false
  let inView = typeof IntersectionObserver === 'undefined'
  let stride = 0
  const slots = []
  const listeners = []
  const modulo = index => (index % cards.length + cards.length) % cards.length
  const listen = (target, event, callback) => {
    target.addEventListener(event, callback)
    listeners.push(() => target.removeEventListener(event, callback))
  }

  function stopTimer() {
    window.clearTimeout(timer)
    timer = 0
  }

  function schedule() {
    stopTimer()
    if (disposed || !enhanced || paused || !inView || document.hidden || reducedMotion || cards.length < 2) return
    timer = window.setTimeout(() => showEntry(active + 1), 3000)
  }

  function render(instant = false) {
    cards.forEach((card, index) => {
      let slot = modulo(index - active)
      if (slot > cards.length / 2) slot -= cards.length
      // A card wrapping behind the carousel must not sweep across the front.
      const wrapped = slots[index] != null && Math.abs(slot - slots[index]) > 1
      card.style.transition = instant || reducedMotion || wrapped ? 'none' : ''
      card.style.transform = layout === 'showcase'
        ? `translate3d(-50%, calc(-50% + ${index === active ? 0 : 24}px), 0) scale(${index === active ? 1 : .975})`
        : `translate3d(calc(-50% + ${slot * stride}px), -50%, 0) scale(${slot === 0 ? 1 : .91})`
      card.style.opacity = index === active ? '1' : layout === 'showcase' || reducedMotion ? '0' : Math.abs(slot) === 1 ? '.32' : '0'
      card.style.zIndex = index === active ? '2' : '1'
      card.style.pointerEvents = index === active ? 'auto' : 'none'
      slots[index] = slot
    })
  }

  function measure() {
    frame = 0
    if (disposed) return
    stage.classList.add('is-auto-ready')
    const width = viewport.clientWidth
    const cardWidth = cards[0].offsetWidth
    enhanced = width > 0 && viewport.clientHeight > 0 && cardWidth > 0
    stage.classList.toggle('is-auto-ready', enhanced)
    if (enhanced) {
      stride = cardWidth + Math.min(28, width * .025)
      render(true)
    } else resetPanels()
    schedule()
  }

  function resize() {
    if (!disposed && !frame) frame = window.requestAnimationFrame(measure)
  }

  function showEntry(index) {
    if (disposed) return
    active = modulo(index)
    if (enhanced) render()
    else viewport.scrollTo({ left: cards[active].offsetLeft - (viewport.clientWidth - cards[active].offsetWidth) / 2, behavior: reducedMotion ? 'instant' : 'smooth' })
    onActiveIndex(active)
    schedule()
  }

  function setPaused(value) { paused = value; schedule() }

  function resetPanels() {
    cards.forEach(card => {
      for (const property of ['transform', 'opacity', 'zIndex', 'pointerEvents', 'transition']) card.style[property] = ''
    })
  }

  listen(document, 'visibilitychange', schedule)
  listen(window, 'resize', resize)
  listen(window, 'pageshow', resize)
  const visibilityObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    schedule()
  }, { threshold: 0 })
  visibilityObserver?.observe(stage)
  const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
  resizeObserver?.observe(viewport)
  document.fonts?.ready.then(() => { if (!disposed) resize() })
  measure()
  onActiveIndex(active)

  function destroy() {
    disposed = true
    stopTimer()
    if (frame) window.cancelAnimationFrame(frame)
    visibilityObserver?.disconnect()
    resizeObserver?.disconnect()
    listeners.forEach(remove => remove())
    stage.classList.remove('is-auto-ready')
    resetPanels()
  }
  return { destroy, showEntry, setPaused }
}

// Preserve the original deck: the whole front card drops below the viewport,
// the next card rises, and the outgoing card returns behind the settled deck.
// Wheel/touch distance triggers a complete animation, never a partial scrub.
function mountStepStack(stage, onActiveIndex, reducedMotion) {
  const viewport = stage.querySelector('.scroll-gallery-viewport')
  const cards = [...stage.querySelectorAll('.scroll-gallery-panel')]
  if (!viewport || !cards.length) return { destroy() {}, showEntry() {}, setPaused() {} }
  let active = 0
  let busy = false
  let disposed = false
  let enhanced = false
  let height = 0
  let peek = 0
  let frame = 0
  let gestureTimer = 0
  let gestureUsed = false
  let wheelDistance = 0
  let touch = null
  let animations = []
  let generation = 0
  const listeners = []
  const rank = (index, front) => (index - front + cards.length) % cards.length
  const transform = depth => `translate3d(-50%, calc(-50% - ${depth * peek}px), 0) scale(${1 - depth * .035})`
  const below = `translate3d(-50%, 110%, 0) scale(.98) rotate(-3deg)`
  const listen = (target, event, callback, options) => {
    target.addEventListener(event, callback, options)
    listeners.push(() => target.removeEventListener(event, callback, options))
  }

  function settle() {
    cards.forEach((card, index) => {
      const depth = rank(index, active)
      card.style.transition = 'none'
      card.style.transform = transform(depth)
      card.style.opacity = reducedMotion && depth ? '0' : depth ? '.94' : '1'
      card.style.zIndex = String(cards.length - depth)
      card.style.pointerEvents = depth ? 'none' : 'auto'
    })
  }

  function cancelTransition() {
    generation++
    animations.forEach(animation => animation.cancel())
    animations = []
    busy = false
  }

  function measure() {
    frame = 0
    if (disposed) return
    cancelTransition()
    stage.classList.add('is-auto-ready')
    height = viewport.clientHeight
    enhanced = viewport.clientWidth > 0 && height > 0 && cards[0].offsetWidth > 0
    stage.classList.toggle('is-auto-ready', enhanced)
    peek = Math.min(30, Math.max(0, (height - cards[0].offsetHeight) / (cards.length + 1)))
    if (enhanced) settle()
    else reset()
  }

  function resize() {
    if (!disposed && !frame) frame = window.requestAnimationFrame(measure)
  }

  function showEntry(index) {
    if (disposed || busy) return
    const next = Math.max(0, Math.min(cards.length - 1, index))
    if (next === active) return
    const previous = active
    active = next
    onActiveIndex(active)
    if (!enhanced) {
      viewport.scrollTo({ left: cards[active].offsetLeft - (viewport.clientWidth - cards[active].offsetWidth) / 2, behavior: reducedMotion ? 'instant' : 'smooth' })
      return
    }
    if (reducedMotion || !cards[0].animate) { settle(); return }
    busy = true
    const token = ++generation
    const forward = next > previous
    cards.forEach((card, index) => {
      const oldDepth = rank(index, previous)
      const newDepth = rank(index, next)
      const outgoing = forward && index === previous
      const incoming = !forward && index === next
      const from = { transform: incoming ? below : transform(oldDepth), opacity: incoming ? 0 : oldDepth ? .94 : 1 }
      const to = { transform: outgoing ? below : transform(newDepth), opacity: outgoing ? 0 : newDepth ? .94 : 1 }
      card.style.zIndex = String(outgoing || incoming ? cards.length + 1 : cards.length - oldDepth)
      // Keyframes run on transform/opacity; there is no layout work on each frame.
      const keyframes = outgoing
        ? [from, { transform: `translate3d(-50%, ${height * .65}px, 0) scale(.98) rotate(-3deg)`, opacity: 1, offset: .82 }, to]
        : [from, to]
      animations.push(card.animate(keyframes, { duration: 2000, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' }))
    })
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (disposed || generation !== token) return
      settle()
      cancelTransition()
    }).catch(() => {})
  }

  function canStep(direction) { return direction > 0 ? active < cards.length - 1 : active > 0 }
  function isReadingDeck() {
    const bounds = stage.getBoundingClientRect()
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 78
    return enhanced && bounds.top <= headerHeight + 120 && bounds.top >= headerHeight - 120 && bounds.bottom > headerHeight + height * .6
  }
  function consume(event) { if (event.cancelable) event.preventDefault() }

  function onWheel(event) {
    if (event.ctrlKey || Math.abs(event.deltaX || 0) > Math.abs(event.deltaY) || !event.deltaY) return
    // Wait for the complete trackpad/mouse gesture to end, including inertia.
    window.clearTimeout(gestureTimer)
    gestureTimer = window.setTimeout(() => { gestureUsed = false; wheelDistance = 0 }, 220)
    if (gestureUsed || busy) { consume(event); return }
    const direction = Math.sign(event.deltaY)
    if (!isReadingDeck() || !canStep(direction)) return
    consume(event)
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1)
    if (Math.sign(wheelDistance) !== Math.sign(delta)) wheelDistance = 0
    wheelDistance += delta
    if (Math.abs(wheelDistance) < 28) return
    gestureUsed = true
    showEntry(active + direction)
  }

  listen(stage, 'wheel', onWheel, { passive: false })
  listen(viewport, 'touchstart', event => {
    if (event.touches.length !== 1) { touch = null; return }
    touch = { x: event.touches[0].clientX, y: event.touches[0].clientY, used: false }
  }, { passive: true })
  listen(viewport, 'touchmove', event => {
    if (!touch || event.touches.length !== 1) return
    if (touch.used || busy) { consume(event); return }
    const dx = touch.x - event.touches[0].clientX
    const dy = touch.y - event.touches[0].clientY
    if (!dy || Math.abs(dx) > Math.abs(dy) || !isReadingDeck() || !canStep(Math.sign(dy))) return
    consume(event)
    if (Math.abs(dy) < 28) return
    touch.used = true
    showEntry(active + Math.sign(dy))
  }, { passive: false })
  listen(viewport, 'touchend', () => { touch = null }, { passive: true })
  listen(viewport, 'touchcancel', () => { touch = null }, { passive: true })
  listen(window, 'resize', resize)
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
  observer?.observe(viewport)
  document.fonts?.ready.then(() => { if (!disposed) resize() })
  measure()
  onActiveIndex(active)

  function reset() {
    cards.forEach(card => {
      for (const property of ['transform', 'opacity', 'zIndex', 'pointerEvents', 'transition']) card.style[property] = ''
    })
  }
  function destroy() {
    disposed = true
    cancelTransition()
    if (frame) window.cancelAnimationFrame(frame)
    window.clearTimeout(gestureTimer)
    observer?.disconnect()
    listeners.forEach(remove => remove())
    stage.classList.remove('is-auto-ready')
    reset()
  }
  return { destroy, showEntry, setPaused() {} }
}
