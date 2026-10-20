import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mountExpertiseCarousel } from '../src/expertiseCarousel.js'

function fixture(reducedMotion = false) {
  const timers = new Map(), frames = new Map(), observers = [], listeners = new Set(), animations = []
  let id = 0, allowLayout = true
  const dimensions = { width: 840 }
  const target = () => {
    const events = new Map()
    return {
      addEventListener(type, fn) { if (!events.has(type)) events.set(type, new Set()); events.get(type).add(fn); listeners.add(fn) },
      removeEventListener(type, fn) { events.get(type)?.delete(fn); listeners.delete(fn) },
      fire(type, event = {}) { events.get(type)?.forEach(fn => fn(event)) },
    }
  }
  globalThis.window = Object.assign(target(), {
    setTimeout(fn, delay) { const key = ++id; timers.set(key, { fn, delay }); return key },
    clearTimeout(key) { timers.delete(key) },
    requestAnimationFrame(fn) { const key = ++id; frames.set(key, fn); return key },
    cancelAnimationFrame(key) { frames.delete(key) },
    scrollTo() { assert.fail('Carousel must not scroll the page') },
  })
  globalThis.document = Object.assign(target(), { hidden: false, fonts: { ready: Promise.resolve() } })
  globalThis.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  globalThis.ResizeObserver = class extends IntersectionObserver {}
  const cards = Array.from({ length: 3 }, () => ({
    style: {},
    get offsetWidth() { assert.ok(allowLayout, 'Animation must not measure layout'); return dimensions.width },
    animate(keyframes, options) {
      let finish, reject
      const finished = new Promise((resolve, fail) => { finish = resolve; reject = fail })
      const animation = { keyframes, options, finished, finish, cancel: () => reject(new Error('cancelled')) }
      animations.push(animation)
      return animation
    },
  }))
  const scene = target()
  const root = Object.assign(target(), { querySelector: () => scene, querySelectorAll: () => cards, contains: node => node === 'child' })
  const updates = []
  const carousel = mountExpertiseCarousel(root, index => updates.push(index), reducedMotion)
  return {
    carousel, cards, scene, root, updates, timers, frames, observers, listeners, animations, dimensions,
    enter(value = true) { observers[0].callback([{ isIntersecting: value }]) },
    tick() { const pending = [...timers.values()]; timers.clear(); pending.forEach(({ fn }) => fn()) },
    flush() { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()) },
    denyLayout() { allowLayout = false },
    async finish() { animations.forEach(animation => animation.finish()); await Promise.resolve(); await Promise.resolve() },
  }
}

test('perspective carousel loops all three areas, hides the returning card behind the scene, and uses compositor keyframes', async () => {
  const f = fixture()
  await Promise.resolve(); f.flush()
  assert.equal(f.timers.size, 0)
  f.enter()
  assert.equal([...f.timers.values()][0].delay, 3000)
  f.denyLayout()
  for (let step = 1; step <= 7; step++) {
    f.tick()
    assert.equal(f.updates.at(-1), step % 3)
    const recent = f.animations.slice(-3)
    assert.equal(recent.filter(animation => animation.keyframes.length === 4).length, 1)
    for (const animation of recent) {
      assert.equal(animation.options.duration, 1200)
      for (const keyframe of animation.keyframes) {
        assert.ok(Object.keys(keyframe).every(key => ['transform', 'opacity', 'offset'].includes(key)))
        assert.ok(!/NaN|Infinity/.test(keyframe.transform))
      }
    }
    const returning = recent.find(animation => animation.keyframes.length === 4)
    assert.equal(returning.keyframes[1].opacity, 0)
    assert.ok(returning.keyframes[1].transform.includes('-840px'))
    await f.finish()
    assert.equal(f.cards[step % 3].style.opacity, '1')
    assert.equal(f.timers.size, 1)
  }
  f.carousel.destroy()
})

test('navigation is bounded during a transition; reverse wraps and vertical gestures remain native', async () => {
  const f = fixture()
  await Promise.resolve(); f.flush()
  f.carousel.showEntry(-1)
  assert.equal(f.updates.at(-1), 2)
  f.carousel.showEntry(1)
  assert.equal(f.updates.at(-1), 2, 'Rapid inputs must not interrupt the current card')
  await f.finish()
  f.scene.fire('pointerdown', { clientX: 100, clientY: 100, button: 0 })
  f.scene.fire('pointerup', { clientX: 105, clientY: 250 })
  assert.equal(f.updates.at(-1), 2)
  f.scene.fire('pointerdown', { clientX: 250, clientY: 100, button: 0 })
  f.scene.fire('pointerup', { clientX: 100, clientY: 110 })
  assert.equal(f.updates.at(-1), 0)
  await f.finish()
  f.carousel.destroy()
})

test('onscreen visibility, hidden tabs, and keyboard focus independently control automatic movement', async () => {
  const f = fixture()
  await Promise.resolve(); f.flush()
  f.enter(); assert.equal(f.timers.size, 1)
  f.root.fire('focusin', { target: { matches: () => false } })
  assert.equal(f.timers.size, 1, 'Mouse clicks must not leave automatic cycling stopped')
  f.root.fire('focusin'); assert.equal(f.timers.size, 0)
  document.hidden = true; document.fire('visibilitychange')
  document.hidden = false; document.fire('visibilitychange')
  assert.equal(f.timers.size, 0)
  f.root.fire('focusout', { relatedTarget: 'child' }); assert.equal(f.timers.size, 0)
  f.root.fire('focusout', { relatedTarget: null }); assert.equal(f.timers.size, 1)
  f.enter(false); assert.equal(f.timers.size, 0)
  f.carousel.destroy()
})

test('reduced motion uses immediate manual changes; resize and unmount clean up pending work', async () => {
  const f = fixture(true)
  await Promise.resolve(); f.flush()
  f.enter(); assert.equal(f.timers.size, 0)
  f.carousel.showEntry(2)
  assert.equal(f.animations.length, 0)
  assert.equal(f.cards.filter(card => card.style.opacity === '1').length, 1)
  f.dimensions.width = 310
  window.fire('resize'); window.fire('resize')
  assert.equal(f.frames.size, 1)
  f.flush()
  assert.equal(f.cards[2].style.opacity, '1')
  window.fire('resize'); f.carousel.destroy()
  assert.equal(f.frames.size, 0)
  assert.equal(f.listeners.size, 0)
  assert.ok(f.observers.every(observer => observer.disconnected))
  assert.ok(f.cards.every(card => card.style.transform === ''))
})

test('resize during an animation settles the chosen card and ignores stale completion callbacks', async () => {
  const f = fixture()
  await Promise.resolve(); f.flush(); f.enter()
  f.carousel.showEntry(1)
  f.dimensions.width = 360
  window.fire('resize'); f.flush()
  await f.finish()
  assert.equal(f.cards[1].style.opacity, '1')
  const translatedX = Number(f.cards[0].style.transform.match(/-50% \+ ([-\d.]+)px/)[1])
  assert.ok(Math.abs(translatedX + 284.4) < .001)
  assert.equal(f.timers.size, 1)
  f.carousel.destroy()
})
