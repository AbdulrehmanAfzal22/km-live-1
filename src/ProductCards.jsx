import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Compass, GitBranch, Scale } from 'lucide-react'
import { ProductIllustration } from './ProductIllustrations'
import './ProductCards.css'

// Keep the existing copy and destinations; only the presentation changes.
const products = [
  { name: 'ORBITAL', description: "Understand what's really happening.", audience: 'For business leaders & strategy teams', icon: Compass, tone: 'orbital', href: 'https://orbital-simulation-explainer.netlify.app/' },
  { name: 'MAGNUS', description: 'Check if the story matches the facts.', audience: 'For investors & risk teams', icon: Scale, tone: 'magnus', href: 'https://khaldun.systems/intelligence-systems' },
  { name: 'SIMFORE', description: 'See what happens before you decide.', audience: 'For executives & boards', icon: GitBranch, tone: 'simfore', href: 'https://khaldun.systems/intelligence-systems' },
]

function CardLandscape({ id }) {
  return (
    <svg className="editorial-product-landscape" viewBox="0 0 440 600" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id={`${id}-fold`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fffdf7" stopOpacity=".85" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".18" />
        </linearGradient>
      </defs>
      <path d="M440 80C444 230 350 245 310 357S268 534 168 600H440Z" fill={`url(#${id}-ribbon)`} />
      <path d="M440 270C331 315 323 420 244 492S96 610 15 600H440Z" fill={`url(#${id}-ribbon)`} />
      <path d="M0 577C69 501 145 621 250 576S368 518 440 473V600H0Z" fill={`url(#${id}-fold)`} />
      <path d="M0 577C69 501 145 621 250 576S368 518 440 473" fill="none" stroke="#fffdf7" strokeOpacity=".65" strokeWidth="1" />
    </svg>
  )
}

export default function ProductCards() {
  const reducedMotion = useReducedMotion()
  const instanceId = useId().replace(/:/g, '')
  return (
    <div className="editorial-products-grid" aria-label="Khaldun Systems products">
      {products.map(({ name, description, audience, icon: Icon, tone, href }, index) => {
        const id = `${instanceId}-${tone}`
        return (
          <motion.div className={`editorial-product-item editorial-product-item--${tone}`} key={name}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }}
            transition={{ duration: reducedMotion ? 0 : .7, delay: reducedMotion ? 0 : index * .12, ease: [.22, 1, .36, 1] }}>
            <article className="editorial-product-card" aria-labelledby={`${id}-title`}>
              <CardLandscape id={id} />
              <div className="editorial-product-top">
                <span className="editorial-product-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="editorial-product-icon" aria-hidden="true"><Icon size={29} strokeWidth={1.35} /></span>
              </div>
              <div className="editorial-product-copy">
                <span className="editorial-product-category">Khaldun Systems / Product</span>
                <h2 className="editorial-product-title" id={`${id}-title`}>{name}</h2>
                <p className="editorial-product-subtitle">{description}</p>
                <p className="editorial-product-audience">{audience}</p>
              </div>
              <a className="editorial-product-action" href={href} target="_blank" rel="noreferrer" aria-label={`Learn more about ${name} (opens in a new tab)`}>
                <span>Learn more</span><ArrowUpRight size={19} strokeWidth={1.65} aria-hidden="true" />
              </a>
              <ProductIllustration tone={tone} id={id} />
            </article>
          </motion.div>
        )
      })}
    </div>
  )
}
