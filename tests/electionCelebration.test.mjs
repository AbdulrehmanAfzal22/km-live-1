import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { electionConfettiPieces } from '../src/electionCelebration.js'

test('election victory confetti uses a bounded, deterministic variety of colored particles', () => {
  assert.equal(electionConfettiPieces.length, 48)
  assert.equal(new Set(electionConfettiPieces.map(item => item.id)).size, 48)
  assert.ok(electionConfettiPieces.some(item => item.shape === 'ribbon'))
  assert.ok(electionConfettiPieces.some(item => item.shape === 'round'))
  assert.ok(electionConfettiPieces.some(item => item.shape === 'paper'))
  for (const piece of electionConfettiPieces) {
    assert.match(piece.style['--confetti-x'], /^\d+%$/)
    assert.match(piece.style['--confetti-duration'], /^\d+(\.\d+)?s$/)
    assert.match(piece.style['--confetti-color'], /^#[a-f0-9]{6}$/)
  }
})

test('celebration is attached to the election card and requires active and visible motion', () => {
  const app = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  const css = fs.readFileSync(new URL('../src/App.css', import.meta.url), 'utf8')
  assert.match(app, /imageFit: 'contain', celebrateElection: true/)
  assert.match(app, /entry\.celebrateElection && active && celebrate/)
  assert.match(app, /useVisibleMotion\(stageRef\)/)
  assert.match(css, /\.election-popper--left/)
  assert.match(css, /@keyframes election-confetti-fall/)
  assert.match(css, /prefers-reduced-motion: reduce/)
  assert.doesNotMatch(app, /<Eyebrow>Recognition \/ 02<\/Eyebrow>/)
})
