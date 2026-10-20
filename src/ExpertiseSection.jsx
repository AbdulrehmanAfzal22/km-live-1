import { useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BrainCircuit, GraduationCap, Landmark, TrendingUp } from 'lucide-react'
import accountantImage from './assets/accounntant.webp'
import strategyMeetingImage from './assets/meeting.webp'
import educationImage from './assets/education.webp'
import digitalImage from './assets/expertise-digital.webp'
import { mountExpertiseCarousel } from './expertiseCarousel.js'
import './ExpertiseSection.css'

const disciplines = [
  { label: 'Business strategy & AI', title: 'Where insight meets opportunity.', description: 'Bringing strategic thinking and practical AI knowledge together to explore opportunities, test assumptions, and support informed business decisions.', image: strategyMeetingImage, alt: 'Real business meeting around a conference table, discussing strategy with laptops and documents', width: 1658, height: 1246, icon: TrendingUp },
  { label: 'Chartered accountancy', title: 'Financial discipline. Sound judgement.', description: 'Chartered accountancy grounds her work in audit, assurance, and advisory, bringing financial discipline and accountability to business decisions.', image: accountantImage, alt: 'Accounting work with financial documents and a calculator', width: 500, height: 333, icon: Landmark },
  { label: 'Executive education', title: 'A broader perspective on leadership.', description: 'Continued executive learning connects leadership, strategy, and emerging technology, keeping her perspective responsive to a changing business environment.', image: educationImage, alt: 'A professional learning and leadership discussion', width: 1536, height: 1024, icon: GraduationCap },
  { label: 'AI & digital programmes', title: 'New technology. Informed decisions.', description: 'Applied study of artificial intelligence, data strategy, and digital transformation builds the understanding needed to assess technology in regulated environments.', image: digitalImage, alt: 'Software engineering workspace with code displayed across computer monitors and a laptop', width: 1800, height: 1201, icon: BrainCircuit },
]

export default function ExpertiseSection() {
  const rootRef = useRef(null)
  const carouselRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  useLayoutEffect(() => {
    const carousel = mountExpertiseCarousel(rootRef.current, setActive, reducedMotion)
    carouselRef.current = carousel
    return () => { carousel.destroy(); carouselRef.current = null }
  }, [reducedMotion])
  const select = index => carouselRef.current?.showEntry(index)
  return (
    <section className="expertise-section" data-section="Qualification" aria-labelledby="expertise-heading">
      <header className="expertise-header">
        <p className="expertise-eyebrow">Professional foundations / Continuous learning</p>
        <h2 id="expertise-heading">Where Business Strategy<em>Meets the Power of AI</em></h2>
        <p className="expertise-introduction">Combining financial discipline, business strategy, and emerging AI knowledge to support more informed decisions.</p>
      </header>
      <div ref={rootRef} className="expertise-carousel" role="region" aria-roledescription="carousel" aria-label="Professional expertise and continued learning"
        onKeyDown={event => {
          if (event.altKey || event.ctrlKey || event.metaKey) return
          const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
          if (step) { event.preventDefault(); select(active + step) }
        }}>
        <div className="expertise-window">
          <div className="expertise-scene" id="expertise-slides" aria-live="off">
            <div className="expertise-track">
              {disciplines.map(({ label, title, description, image, alt, width, height, icon: Icon }, index) => (
                <article key={label} className={`expertise-card expertise-card--${index + 1}`} aria-hidden={active !== index} aria-label={`${index + 1} of ${disciplines.length}: ${label}`}>
                  <div className="expertise-photo"><img src={image} alt={alt} width={width} height={height} loading="eager" decoding="async" draggable="false" /></div>
                  <div className="expertise-copy">
                    <div className="expertise-card-meta"><span className="expertise-icon" aria-hidden="true"><Icon size={21} strokeWidth={1.5} /></span><span className="expertise-number">0{index + 1}</span></div>
                    <p className="expertise-label">{label}</p>
                    <h3>{title}</h3>
                    <p className="expertise-description">{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="expertise-controls">
          <div className="expertise-chapters" role="group" aria-label="Choose an area of expertise">
            {disciplines.map(({ label }, index) => <button type="button" key={label} aria-pressed={active === index} aria-controls="expertise-slides" onClick={() => select(index)}>{label}</button>)}
          </div>
          <div className="expertise-arrows">
            <button type="button" aria-label="Previous area of expertise" aria-controls="expertise-slides" onClick={() => select(active - 1)}><ArrowLeft size={19} /></button>
            <button type="button" aria-label="Next area of expertise" aria-controls="expertise-slides" onClick={() => select(active + 1)}><ArrowRight size={19} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
