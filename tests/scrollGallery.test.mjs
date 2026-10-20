import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mountScrollGallery } from '../src/scrollGallery.js'

function fixture(count = 6) {
  const listeners = new Set()
  const timers = new Map()
  const frames = new Map()
  const observers = []
  const animations = []
  let nextId = 1
  let allowLayout = true
  const dimensions = { width: 1200, height: 600, cardWidth: 980, cardHeight: 500, top: 80 }
  const read = value => { assert.ok(allowLayout, 'Transitions must not measure layout'); return value }
  const target = () => {
    const events = new Map()
    return {
      addEventListener(type, callback) { if (!events.has(type)) events.set(type, new Set()); events.get(type).add(callback); listeners.add(callback) },
      removeEventListener(type, callback) { events.get(type)?.delete(callback); listeners.delete(callback) },
      fire(type, event = {}) { events.get(type)?.forEach(callback => callback(event)) },
    }
  }
  const classes = new Set()
  const cards = Array.from({ length: count }, (_, index) => ({ style: {}, get offsetWidth() { return read(dimensions.cardWidth) }, get offsetHeight() { return read(dimensions.cardHeight) }, get offsetLeft() { return read(index * dimensions.cardWidth) },
    animate(keyframes, options) {
      let finish, reject
      const finished = new Promise((resolve, fail) => { finish = resolve; reject = fail })
      const animation = { finished, finish, cancel: () => reject(new Error('cancelled')), keyframes, options }
      animations.push(animation)
      return animation
    } }))
  const viewport = { ...target(), get clientWidth() { return read(dimensions.width) }, get clientHeight() { return read(dimensions.height) }, scrollTo(value) { this.destination = value } }
  const track = { style: {} }
  const stage = Object.assign(target(), {
    classList: { add: value => classes.add(value), remove: value => classes.delete(value), toggle: (value, enabled) => enabled ? classes.add(value) : classes.delete(value), contains: value => classes.has(value) },
    contains: node => node === 'child',
    getBoundingClientRect: () => ({ top: dimensions.top, bottom: dimensions.top + dimensions.height }),
    querySelector: selector => ({ '.scroll-gallery-viewport': viewport, '.scroll-gallery-track': track })[selector],
    querySelectorAll: () => cards,
  })
  globalThis.document = Object.assign(target(), { hidden: false, querySelector: () => ({ offsetHeight: 80 }), fonts: { ready: Promise.resolve() } })
  globalThis.window = Object.assign(target(), {
    scrollY: 1234, innerHeight: 800,
    scrollTo() { assert.fail('Gallery navigation must never move the page') },
    setTimeout(callback, delay) { const id = nextId++; timers.set(id, { callback, delay }); return id },
    clearTimeout: id => timers.delete(id),
    requestAnimationFrame(callback) { const id = nextId++; frames.set(id, callback); return id },
    cancelAnimationFrame: id => frames.delete(id),
  })
  globalThis.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  globalThis.ResizeObserver = class extends IntersectionObserver {}
  const updates = []
  const enter = () => observers[0].callback([{ isIntersecting: true, intersectionRatio: .8 }])
  const leave = () => observers[0].callback([{ isIntersecting: false, intersectionRatio: 0 }])
  const tick = () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(({ callback }) => callback()) }
  const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()) }
  return { stage, viewport, cards, dimensions, updates, listeners, observers, timers, frames, animations, enter, leave, tick, flush, denyLayout: () => { allowLayout = false } }
}

test('autoplay starts only onscreen, loops every card, and never changes vertical scrolling', async () => {
  const f = fixture(7)
  const gallery = mountScrollGallery(f.stage, index => f.updates.push(index))
  await Promise.resolve(); f.flush()
  assert.equal(f.timers.size, 0)
  f.enter()
  assert.equal([...f.timers.values()][0].delay, 3000)
  f.denyLayout()
  for (let step = 1; step <= 15; step++) {
    f.tick()
    const index = step % 7
    assert.equal(f.updates.at(-1), index)
    assert.equal(f.cards[index].style.opacity, '1')
    assert.equal(window.scrollY, 1234)
    assert.equal(f.timers.size, 1)
    assert.ok(f.cards.every(card => !/NaN|Infinity/.test(card.style.transform)))
  }
  f.leave(); assert.equal(f.timers.size, 0)
  gallery.destroy()
})

test('manual next/previous navigation wraps locally and vertical scrolling is not handled', () => {
  const f = fixture(3)
  const gallery = mountScrollGallery(f.stage, index => f.updates.push(index))
  gallery.showEntry(-1); assert.equal(f.updates.at(-1), 2)
  gallery.showEntry(3); assert.equal(f.updates.at(-1), 0)
  window.scrollY = 99999; window.fire('scroll'); f.flush()
  assert.equal(f.updates.at(-1), 0)
  assert.equal(f.cards[0].style.opacity, '1')
  gallery.destroy()
})

test('recognition keeps autoplaying under the mouse and keyboard focus; explicit pause and hidden tabs stop it', () => {
  const f = fixture()
  const gallery = mountScrollGallery(f.stage, index => f.updates.push(index))
  f.enter(); assert.equal(f.timers.size, 1)
  f.stage.fire('pointerenter', { pointerType: 'mouse' }); assert.equal(f.timers.size, 1)
  f.stage.fire('pointerleave'); assert.equal(f.timers.size, 1)
  f.stage.fire('pointerenter', { pointerType: 'touch' }); assert.equal(f.timers.size, 1)
  f.stage.fire('focusin'); assert.equal(f.timers.size, 1)
  f.stage.fire('focusout', { relatedTarget: 'child' }); assert.equal(f.timers.size, 1)
  f.stage.fire('focusout', { relatedTarget: null }); assert.equal(f.timers.size, 1)
  gallery.setPaused(true); f.leave(); f.enter(); assert.equal(f.timers.size, 0)
  gallery.showEntry(2); assert.equal(f.updates.at(-1), 2); assert.equal(f.timers.size, 0)
  gallery.setPaused(false); assert.equal(f.timers.size, 1)
  document.hidden = true; document.fire('visibilitychange'); assert.equal(f.timers.size, 0)
  document.hidden = false; document.fire('visibilitychange'); assert.equal(f.timers.size, 1)
  gallery.destroy()
})

test('stack never autoplays; one gesture completes one full card drop despite trackpad inertia', async () => {
  const f = fixture(3)
  const gallery = mountScrollGallery(f.stage, index => f.updates.push(index), false, 'stack')
  await Promise.resolve(); f.flush()
  assert.equal(f.timers.size, 0)
  assert.equal(f.cards[0].style.opacity, '1')
  let prevented = 0
  const wheel = deltaY => f.stage.fire('wheel', { deltaY, deltaX: 0, cancelable: true, preventDefault: () => prevented++ })
  wheel(8); wheel(10)
  assert.equal(f.updates.at(-1), 0)
  wheel(12)
  assert.equal(f.updates.at(-1), 1)
  assert.equal(f.animations.length, 3)
  const outgoing = f.animations[0]
  assert.equal(outgoing.options.duration, 2000)
  assert.ok(outgoing.keyframes.at(-1).transform.includes('110%'), 'Whole card exits below the viewport')
  for (let i = 0; i < 40; i++) wheel(65)
  assert.equal(f.updates.at(-1), 1)
  assert.ok(prevented > 40)
  f.animations.forEach(animation => animation.finish())
  await Promise.resolve(); await Promise.resolve()
  assert.equal(f.cards[1].style.opacity, '1')
  assert.equal(f.cards[1].style.zIndex, '3')
  wheel(50); assert.equal(f.updates.at(-1), 1, 'Inertia after completion remains the same gesture')
  f.tick(); wheel(80)
  assert.equal(f.updates.at(-1), 2)
  f.animations.forEach(animation => animation.finish())
  await Promise.resolve(); await Promise.resolve()
  f.tick()
  const count = prevented
  wheel(80)
  assert.equal(prevented, count, 'New gesture after the last card must scroll the page normally')
  f.tick(); wheel(-80)
  assert.equal(f.updates.at(-1), 1)
  gallery.destroy()
})

test('stack does not trap page scrolling before it is in reading position or beyond its ends', async () => {
  const f = fixture(3)
  const gallery = mountScrollGallery(f.stage, index => f.updates.push(index), true, 'stack')
  await Promise.resolve(); f.flush()
  let prevented = false
  const wheel = deltaY => f.stage.fire('wheel', { deltaY, cancelable: true, preventDefault: () => { prevented = true } })
  wheel(-100); assert.equal(prevented, false)
  f.tick(); f.dimensions.top = 450
  wheel(100); assert.equal(prevented, false); assert.equal(f.updates.at(-1), 0)
  f.tick(); f.dimensions.top = 80
  wheel(100); assert.equal(prevented, true); assert.equal(f.updates.at(-1), 1)
  gallery.destroy()
})

test('touch swipe changes a complete stack card once, with no stack autoplay', async () => {
  const f = fixture(3)
  const gallery = mountScrollGallery(f.stage, index => f.updates.push(index), true, 'stack')
  await Promise.resolve(); f.flush()
  f.viewport.fire('touchstart', { touches: [{ clientX: 100, clientY: 300 }] })
  const move = { touches: [{ clientX: 100, clientY: 200 }], cancelable: true, preventDefault() {} }
  f.viewport.fire('touchmove', move); f.viewport.fire('touchmove', move)
  assert.equal(f.updates.at(-1), 1)
  assert.equal(f.timers.size, 0)
  f.viewport.fire('touchend')
  f.viewport.fire('touchstart', { touches: [{ clientX: 100, clientY: 300 }] })
  f.viewport.fire('touchmove', move)
  assert.equal(f.updates.at(-1), 2)
  gallery.destroy()
})

test('reduced motion disables autoplay and animation but allows manual navigation in both layouts', () => {
  for (const layout of ['horizontal', 'stack']) {
    const f = fixture(3)
    const gallery = mountScrollGallery(f.stage, index => f.updates.push(index), true, layout)
    if (layout === 'horizontal') f.enter(); assert.equal(f.timers.size, 0)
    gallery.showEntry(2)
    assert.equal(f.cards.filter(card => card.style.opacity === '1').length, 1)
    assert.equal(f.cards[2].style.transition, 'none')
    assert.equal(f.updates.at(-1), 2)
    gallery.destroy()
  }
})

test('resize keeps the active card and zero-size layouts recover with native fallback', async () => {
  const f = fixture(3)
  const gallery = mountScrollGallery(f.stage, index => f.updates.push(index))
  await Promise.resolve(); f.flush(); gallery.showEntry(2)
  f.dimensions.width = 390; f.dimensions.cardWidth = 350
  window.fire('resize'); window.fire('resize'); assert.equal(f.frames.size, 1); f.flush()
  assert.equal(f.cards[2].style.opacity, '1')
  f.dimensions.width = 0; window.fire('resize'); f.flush()
  assert.equal(f.stage.classList.contains('is-auto-ready'), false)
  f.cards.forEach(card => assert.equal(card.style.transform, ''))
  gallery.showEntry(1); assert.ok(Number.isFinite(f.viewport.destination.left))
  f.dimensions.width = 390; window.fire('resize'); f.flush()
  assert.equal(f.stage.classList.contains('is-auto-ready'), true)
  assert.equal(f.cards[1].style.opacity, '1')
  gallery.destroy()
})

test('a single card has no autoplay and unmount cancels timers, frames and listeners', async () => {
  const f = fixture(1)
  let gallery = mountScrollGallery(f.stage, index => f.updates.push(index))
  f.enter(); assert.equal(f.timers.size, 0)
  gallery.showEntry(99); assert.equal(f.updates.at(-1), 0)
  window.fire('resize'); gallery.destroy()
  await Promise.resolve(); f.flush()
  assert.equal(f.timers.size, 0); assert.equal(f.frames.size, 0); assert.equal(f.listeners.size, 0)
  assert.ok(f.observers.every(observer => observer.disconnected))
  assert.equal(f.cards[0].style.transform, '')
  gallery = mountScrollGallery(f.stage, index => f.updates.push(index))
  assert.equal(f.cards[0].style.opacity, '1')
  gallery.destroy()
})
