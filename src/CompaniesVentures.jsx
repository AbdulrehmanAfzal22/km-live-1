import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import './CompaniesVentures.css'

function CompanyArtwork({ company, id }) {
  const fill = `url(#${id}-wash)`
  return (
    <svg className="ventures-company-art" viewBox="0 0 460 380" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".18" />
        </linearGradient>
      </defs>
      {company === 'khaldun-systems' && <>
        <circle cx="455" cy="279" r="147" fill={fill} />
        <circle cx="332" cy="420" r="162" fill={fill} />
        <circle cx="474" cy="403" r="176" fill={fill} opacity=".65" />
        <path d="M232 401C278 305 303 211 367 215S444 270 478 315" fill="none" stroke="currentColor" strokeOpacity=".27" strokeWidth="1" />
        <path d="M122 388C228 331 310 326 367 349S442 378 482 358" fill="none" stroke="currentColor" strokeOpacity=".11" strokeWidth=".8" />
      </>}
      {company === 'ma-chaudhari' && <>
        <path d="M207 405C276 338 328 227 470 133V405Z" fill={fill} opacity=".6" />
        <path d="M285 403C288 313 342 241 389 221S439 209 475 211V403Z" fill={fill} />
        <path d="M341 409C339 340 376 297 413 283S450 280 478 284V409Z" fill={fill} />
        <path d="M256 404C311 298 358 261 413 278S455 317 482 343" fill="none" stroke="currentColor" strokeOpacity=".28" strokeWidth="1" />
        <path d="M308 402C358 348 411 324 484 344" fill="none" stroke="currentColor" strokeOpacity=".08" strokeWidth=".8" />
      </>}
      {company === 'yesaya' && <>
        <circle cx="444" cy="285" r="143" fill={fill} opacity=".6" />
        <path d="M151 380C213 321 229 347 280 300S370 275 470 312V400Z" fill={fill} />
        {Array.from({ length: 13 }, (_, index) => <path key={index}
          d={`M${166 + index * 2} 399C${233 + index} ${280 + index * 6} ${269 + index * 3} ${402 - index * 3} 478 ${209 + index * 7}`}
          fill="none" stroke="currentColor" strokeOpacity={.055 + index * .003} strokeWidth=".8" />)}
        <path d="M211 407C312 384 390 313 473 177" fill="none" stroke="currentColor" strokeOpacity=".29" strokeWidth="1" />
      </>}
    </svg>
  )
}

export default function CompaniesVentures({ companies }) {
  const reducedMotion = useReducedMotion()
  const instance = useId().replace(/:/g, '')
  const entrance = { once: true, amount: .15 }
  return (
    <section className="ventures-editorial" id="companies" data-section="Companies" aria-labelledby="companies-heading">
      <svg className="ventures-corner-lines" viewBox="0 0 1400 700" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" strokeWidth=".8">
          <path d="M-55 42C75 3 169 92 165 262" /><path d="M-55 109C42 68 120 150 124 282" />
          <path d="M1151 -55C1172 104 1280 171 1450 174" /><path d="M1202 -55C1214 81 1304 130 1450 136" />
        </g>
      </svg>
      <div className="ventures-editorial-inner">
        <motion.header className="ventures-heading" initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={entrance}
          transition={{ duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }}>
          <p className="ventures-eyebrow">Companies / Ventures</p>
          <h2 id="companies-heading"><span>Companies</span> <span className="ventures-ampersand">&amp;</span> <span>Ventures</span></h2>
          <p className="ventures-introduction">Distinct businesses, united by a shared commitment to building a more intelligent, transparent, and prosperous future.</p>
        </motion.header>
        <div className="ventures-company-grid">
          {companies.map(({ id, name, sector, description, link, linkedin, icon: Icon }, index) => (
            <motion.div className={`ventures-company-item ventures-company-item--${id}`} key={id}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={entrance}
              transition={{ duration: reducedMotion ? 0 : .65, delay: reducedMotion ? 0 : index * .1, ease: [.22, 1, .36, 1] }}>
              <article className="ventures-company-card" aria-labelledby={`${instance}-${id}-title`}>
                <CompanyArtwork company={id} id={`${instance}-${id}`} />
                <div className="ventures-company-top">
                  <span className="ventures-company-icon" aria-hidden="true"><Icon size={27} strokeWidth={1.45} /></span>
                  <span className="ventures-company-badge">{sector}</span>
                </div>
                <h3 className="ventures-company-title" id={`${instance}-${id}-title`}>{name}</h3>
                <p className="ventures-company-description">{description}</p>
                <div className="ventures-company-actions">
                  {id !== 'yesaya' && <a className="ventures-company-link" href={link || '#products'} target="_blank" rel="noopener noreferrer"
                    aria-label={`Learn more about ${name} (opens in a new tab)`}>
                    <span>Learn more</span><ArrowRight size={17} strokeWidth={1.6} aria-hidden="true" />
                  </a>}
                  {linkedin && <a className="ventures-company-linkedin" href={linkedin} target="_blank" rel="noopener noreferrer"
                    aria-label={`Visit ${name} on LinkedIn (opens in a new tab)`} title={`${name} on LinkedIn`}>
                    <FaLinkedin size={26} color="#0A66C2" aria-hidden="true" />
                  </a>}
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
