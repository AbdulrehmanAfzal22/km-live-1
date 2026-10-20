import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const expertise = readFileSync(new URL('../src/ExpertiseSection.jsx', import.meta.url), 'utf8')
const appStyles = readFileSync(new URL('../src/App.css', import.meta.url), 'utf8')
const responsive = readFileSync(new URL('../src/responsive.css', import.meta.url), 'utf8')

test('all 3 original expertise titles and real related images are retained', () => {
  assert.match(expertise, /Financial discipline\. Sound judgement\./)
  assert.match(expertise, /A broader perspective on leadership\./)
  assert.match(expertise, /New technology\. Informed decisions\./)
  assert.match(expertise, /image: accountantImage/)
  assert.match(expertise, /image: educationImage/)
  assert.match(expertise, /image: digitalImage/)
})

test('AI strategy is added as an extra card with actual meeting imagery', () => {
  assert.match(expertise, /Business strategy & AI/)
  assert.match(expertise, /image: strategyMeetingImage/)
  assert.match(expertise, /Where Business Strategy<em>Meets the Power of AI<\/em>/)
})

test('LinkedIn footer displays the icon without the white box', () => {
  assert.match(appStyles, /\.site-footer-socials \.site-footer-linkedin \{\s*width: 36px; height: 36px; padding: 0; border: 0; border-radius: 0;\s*background: transparent;/)
})

test('responsive rules cover phone, tablet and desktop widths', () => {
  for (const width of ['359px', '480px', '700px', '820px', '960px', '1100px']) {
    assert.ok(responsive.includes(width), `missing ${width} breakpoint`)
  }
  assert.match(responsive, /\.editorial-product-card \.editorial-product-title \{ white-space: normal;/)
})
