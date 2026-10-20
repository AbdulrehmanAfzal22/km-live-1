import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mountPhotoAutoplay } from '../src/photoAutoplay.js'

function fixture(reducedMotion = false) {
  const timers = new Map()
  const listeners = new Map()
  let observer
  let nextId = 0
  let selected = 0
  globalThis.window = {
    setTimeout(callback, delay) { const id = ++nextId; timers.set(id, { callback, delay }); return id },
    clearTimeout(id) { timers.delete(id) },
  }
  globalThis.document = {
    hidden: false,
    addEventListener(type, callback) { listeners.set(type, callback) },
    removeEventListener(type) { listeners.delete(type) },
  }
  globalThis.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; observer = this }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  const autoplay = mountPhotoAutoplay({}, () => { selected = (selected + 1) % 5 }, reducedMotion)
  return {
    autoplay, timers, listeners,
    get selected() { return selected },
    get disconnected() { return observer.disconnected },
    intersect(isIntersecting) { observer.callback([{ isIntersecting }]) },
    visibility(hidden) { document.hidden = hidden; listeners.get('visibilitychange')() },
    tick() { const pending = [...timers.values()]; timers.clear(); pending.forEach(({ callback }) => callback()) },
  }
}

test('photos advance every three seconds, wrap all five images, and reset after manual selection', () => {
  const f = fixture()
  assert.equal(f.timers.size, 0)
  f.intersect(true)
  assert.equal([...f.timers.values()][0].delay, 3000)
  for (let step = 1; step <= 11; step++) {
    f.tick()
    assert.equal(f.selected, step % 5)
    assert.equal(f.timers.size, 1)
  }
  const previousTimer = [...f.timers.keys()][0]
  f.autoplay.reset()
  assert.equal(f.timers.has(previousTimer), false)
  assert.equal(f.timers.size, 1)
  f.autoplay.destroy()
})

test('full-photo viewing, hidden tabs, and leaving the viewport pause autoplay independently', () => {
  const f = fixture()
  f.intersect(true)
  f.autoplay.setPaused(true)
  f.visibility(true); f.visibility(false)
  assert.equal(f.timers.size, 0, 'Returning to a tab must not advance an open photo viewer')
  f.autoplay.setPaused(false)
  assert.equal(f.timers.size, 1)
  f.intersect(false)
  f.autoplay.reset()
  assert.equal(f.timers.size, 0)
  f.intersect(true)
  f.visibility(true)
  assert.equal(f.timers.size, 0)
  f.visibility(false)
  assert.equal(f.timers.size, 1)
  f.autoplay.destroy()
  assert.equal(f.timers.size, 0)
  assert.equal(f.listeners.size, 0)
  assert.equal(f.disconnected, true)
  f.autoplay.reset()
  assert.equal(f.timers.size, 0, 'Unmounted galleries must never restart')
})

test('reduced motion keeps photo selection manual', () => {
  const f = fixture(true)
  f.intersect(true)
  f.autoplay.reset()
  f.visibility(true); f.visibility(false)
  assert.equal(f.timers.size, 0)
  f.autoplay.destroy()
})
