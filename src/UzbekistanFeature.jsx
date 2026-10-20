import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, MapPin, Maximize2, X } from 'lucide-react'
import portrait from './assets/uzbekistan/portrait.webp'
import stand from './assets/uzbekistan/khaldun-stand.webp'
import standThumb from './assets/uzbekistan/khaldun-stand-thumb.webp'
import atWork from './assets/uzbekistan/at-work.webp'
import atWorkThumb from './assets/uzbekistan/at-work-thumb.webp'
import ictWeek from './assets/uzbekistan/ict-week.webp'
import ictWeekThumb from './assets/uzbekistan/ict-week-thumb.webp'
import summit from './assets/uzbekistan/summit.webp'
import summitThumb from './assets/uzbekistan/summit-thumb.webp'
import connections from './assets/uzbekistan/connections.webp'
import connectionsThumb from './assets/uzbekistan/connections-thumb.webp'
import './UzbekistanFeature.css'
import { mountPhotoAutoplay } from './photoAutoplay.js'

const photographs = [
  { image: stand, thumb: standThumb, caption: 'Representing Khaldun Systems', alt: 'Khadija at the Khaldun Systems exhibition stand', width: 1600, height: 900, position: '46% 50%' },
  { image: atWork, thumb: atWorkThumb, caption: 'The work behind the vision', alt: 'Khadija working at the Khaldun Systems stand', width: 1600, height: 900, position: '50% 50%' },
  { image: ictWeek, thumb: ictWeekThumb, caption: 'ICT Week, Uzbekistan', alt: 'Khadija seated beside the ICT Week Uzbekistan event backdrop', width: 1448, height: 1086, position: '58% 50%' },
  { image: summit, thumb: summitThumb, caption: 'Enterprise Uzbekistan Summit', alt: 'Khadija in front of the Enterprise Uzbekistan Summit backdrop', width: 1600, height: 740, position: '50% 50%' },
  { image: connections, thumb: connectionsThumb, caption: 'People, perspectives, and new conversations', alt: 'Khadija with another attendee at the exhibition', width: 1448, height: 1086, position: '50% 43%' },
]

export default function UzbekistanFeature() {
  const reducedMotion = useReducedMotion()
  const [selected, setSelected] = useState(0)
  const dialogRef = useRef(null)
  const galleryRef = useRef(null)
  const autoplayRef = useRef(null)
  useEffect(() => {
    const autoplay = mountPhotoAutoplay(galleryRef.current, () => setSelected(index => (index + 1) % photographs.length), reducedMotion)
    autoplayRef.current = autoplay
    return () => { autoplay.destroy(); autoplayRef.current = null }
  }, [reducedMotion])
  useEffect(() => {
    // Prepare the next full-size photo before its fade begins.
    const nextImage = new Image()
    nextImage.src = photographs[(selected + 1) % photographs.length].image
  }, [selected])
  const current = photographs[selected]
  const reveal = { initial: reducedMotion ? false : { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .15 } }
  const transition = { duration: reducedMotion ? 0 : .7, ease: [.22, 1, .36, 1] }
  const choosePhoto = index => {
    setSelected((index + photographs.length) % photographs.length)
    autoplayRef.current?.reset()
  }
  const openPhoto = () => {
    dialogRef.current?.showModal()
    autoplayRef.current?.setPaused(true)
  }
  const navigatePhotos = event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    choosePhoto(selected + (event.key === 'ArrowRight' ? 1 : -1))
  }

  return (
    <section className="uzbekistan-feature" id="uzbekistan" data-section="Recognition" aria-labelledby="uzbekistan-heading">
      <div className="uzbekistan-inner">
        <div className="uzbekistan-heading-grid">
          <motion.header {...reveal} transition={transition}>
            <p className="uzbekistan-eyebrow">Khaldun Systems <span aria-hidden="true">/</span> Uzbekistan</p>
            <h2 id="uzbekistan-heading">Her own company.<em>An international stage.</em></h2>
          </motion.header>
          <motion.div className="uzbekistan-introduction" {...reveal} transition={{ ...transition, delay: reducedMotion ? 0 : .12 }}>
            <p className="uzbekistan-location"><MapPin size={14} strokeWidth={1.6} aria-hidden="true" />ICT Week, Uzbekistan</p>
            <p className="uzbekistan-description">At ICT Week in Uzbekistan, Khadija represented Khaldun Systems, introduced its work, and connected with people from different markets. A company that began as an idea was now part of conversations beyond Pakistan, taking a vision built at home onto an international stage.</p>
            <a href="#products" className="uzbekistan-company-link">Explore Khaldun Systems<ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" /></a>
          </motion.div>
        </div>

        <div className="uzbekistan-gallery-grid">
          <motion.div ref={galleryRef} className="uzbekistan-gallery" {...reveal} transition={{ ...transition, delay: reducedMotion ? 0 : .08 }} onKeyDown={navigatePhotos}>
            <button type="button" className="uzbekistan-main-photo" aria-label={`View full photo: ${current.caption}`} onClick={openPhoto}>
              <AnimatePresence initial={false}>
                <motion.img key={current.image} src={current.image} alt={current.alt} width={current.width} height={current.height}
                  loading="lazy" decoding="async" style={{ objectPosition: current.position }}
                  initial={{ opacity: reducedMotion ? 1 : 0, scale: reducedMotion ? 1 : 1.025 }}
                  animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : .5, ease: [.22, 1, .36, 1] }} />
              </AnimatePresence>
              <span className="uzbekistan-photo-expand"><Maximize2 size={14} aria-hidden="true" /><span>View photo</span></span>
            </button>
            <div className="uzbekistan-photo-caption"><span>{current.caption}</span><span>Uzbekistan</span></div>
            <div className="uzbekistan-thumbnails" role="group" aria-label="Choose a photograph from Uzbekistan">
              {photographs.map((photo, index) => <button type="button" key={photo.image} className={selected === index ? 'is-selected' : ''}
                aria-label={`Show photo: ${photo.caption}`} aria-pressed={selected === index} onClick={() => choosePhoto(index)}>
                <img src={photo.thumb} alt="" width={400} height={Math.round(400 * photo.height / photo.width)} loading="lazy" decoding="async" style={{ objectPosition: photo.position }} />
              </button>)}
            </div>
          </motion.div>

          <motion.figure className="uzbekistan-portrait" {...reveal} transition={{ ...transition, delay: reducedMotion ? 0 : .2 }}>
            <div className="uzbekistan-portrait-frame"><img src={portrait} alt="Khadija Mubarik Ali attending ICT Week in Uzbekistan" width="1086" height="1448" loading="lazy" decoding="async" /></div>
            <figcaption>
              <p className="uzbekistan-portrait-name">Khadija Mubarik Ali<span>Representing Khaldun Systems</span></p>
              <p className="uzbekistan-closing">Built in Pakistan.<em>Thinking globally.</em></p>
            </figcaption>
          </motion.figure>
        </div>
      </div>

      <dialog className="uzbekistan-viewer" ref={dialogRef} aria-label="Uzbekistan photograph viewer" onKeyDown={navigatePhotos}
        onClose={() => autoplayRef.current?.setPaused(false)}
        onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close() }}>
        <button type="button" className="uzbekistan-viewer-close" aria-label="Close photo viewer" onClick={() => dialogRef.current?.close()}><X size={23} strokeWidth={1.5} /></button>
        <figure><img src={current.image} alt={current.alt} width={current.width} height={current.height} decoding="async" /><figcaption>{current.caption}</figcaption></figure>
      </dialog>
    </section>
  )
}
