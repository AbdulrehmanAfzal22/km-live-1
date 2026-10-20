import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Award, BarChart3, Bell, BrainCircuit, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, Edit3, Gavel, Globe2, GraduationCap, Landmark, Layers3, Link2, Mail, MapPin, Menu, Megaphone, Mic, Network, Phone, Send, ShieldCheck, Sparkles, Target, X } from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { FaLinkedin } from 'react-icons/fa'
import { theme } from './theme'
import womenPortrait from './assets/women.webp'
import blueImage from './assets/blue.webp'
import artificialImage from './assets/artifical.webp'
import calculatorImage from './assets/calculator.webp'
import earthImage from './assets/earth.webp'
import greenImage from './assets/green.webp'
import meetingImage from './assets/meeting.webp'
import womenInternational from './assets/women-international.webp'
import womenSudia from './assets/women-sudia.webp'
import womensudiaImage from './assets/womensudia.webp'
import womenYellow from './assets/women-yellow.webp'
import womenGreen from './assets/women-green.webp'
import whiteDress from './assets/white-dress.webp'
import prccsfImage from './assets/prccsf.webp'
import talkImage from './assets/talk.webp'
import ugbImage from './assets/ugb.webp'
import womenThree from './assets/women-3.jpeg'
import essaLabImage from './assets/essa-lab.webp'
import gmailLogo from './assets/gmail-logo.svg'
import slackLogo from './assets/slack-logo.svg'
import googleCalendarLogo from './assets/google-calendar-logo.svg'
import logoBlack from './assets/logo-black.png'
import logoWhite from './assets/logo-white.png'
import './App.css'
import { mountScrollGallery } from './scrollGallery.js'
import ProductCards from './ProductCards'
import CompaniesVentures from './CompaniesVentures'
import UzbekistanFeature from './UzbekistanFeature'
import kasurElectionImage from './assets/kasur-chamber-election.webp'
import ExpertiseSection from './ExpertiseSection'
import { electionConfettiPieces } from './electionCelebration.js'

gsap.registerPlugin(ScrollTrigger)
let pendingScrollRefresh = 0
function requestScrollRefresh() {
  if (pendingScrollRefresh) return
  pendingScrollRefresh = window.requestAnimationFrame(() => {
    pendingScrollRefresh = 0
    ScrollTrigger.refresh()
  })
}

function useVisibleMotion(ref) {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    let inViewport = false
    const update = () => setVisible(inViewport && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting
      update()
    }, { rootMargin: '100px', threshold: 0 })
    if (ref.current) observer.observe(ref.current)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [ref])
  return visible && !reduceMotion
}
const linkedinUrl = 'https://www.linkedin.com/posts/makhadija_leadership-globalgrowth-internationalrelations-activity-7422236214738690048-F61a'
const companies = [
  { name: 'M.A. Chaudhari & Co.', type: 'Accounting & Finance', description: 'A trusted accounting firm serving businesses across Pakistan since 1986.', body: 'An established chartered accountancy firm that helps businesses manage their finances, taxes, and compliance. Known for its reliability and hands-on approach to client relationships.', detail: 'The only QCR-certified firm in the Gujranwala region', tone: 'brass' },
  { name: 'Khaldun Systems', type: 'Technology / Artificial Intelligence', description: 'AI systems that help businesses make smarter decisions.', body: 'Khaldun Systems builds AI tools that help business leaders understand what is really happening inside their company, check whether their assumptions match reality, and test the outcome of a decision before making it.', detail: 'Three flagship systems: ORBITAL, MAGNUS, and SIMFORE', tone: 'signal' },
  { name: 'Yesaya', type: 'Saudi Arabia (KSA) — Technology & Finance', description: 'A technology company bringing together tech and finance to build smarter financial solutions.', body: 'A Saudi Arabia based company working at the intersection of technology and finance, building modern, tech-driven solutions for financial needs — reflecting a growing regional focus on combining innovation with financial services.', detail: 'A growing regional focus on combining innovation with financial services.', tone: 'brass' },
]
const achievements = [
  ['Deputy Director, International Collaborations', "Pakistan Research Center for China's Common Shared Future", 'Appointed to the management team of PRCCSF, leading initiatives that strengthen Pakistan–China relations through international business, policy advisory, and cross-border partnerships.', linkedinUrl],
  ['Member', 'United Business Group (UBG)', 'Joined UBG, a platform representing industrialists and the business community, working under Patron-in-Chief S. M. Tanvir to advocate for stronger industry representation and policy engagement.', 'https://www.linkedin.com/posts/makhadija_ubg-industrialists-businesscommunity-activity-7460248580319019008-9WM8'],
  ['Executive Council & Core Committee Member', 'Kasur Chamber of Commerce', "Contributes to institutional coordination and regional business strategy as part of the Chamber's leadership team.", 'https://www.linkedin.com/posts/makhadija_leadership-businesscommunity-kasurchamber-activity-7462774360790114304-XPK5'],
  ['Diplomatic Engagement', 'Ambassador of Ethiopia', 'Held high-level discussions with H.E. Dr. Oumer Hussein Oba on AI, digital transformation, and cross-border collaboration between Pakistan and Ethiopia.', 'https://www.linkedin.com/posts/makhadija_ai-innovation-digitaltransformation-activity-7463498974222700545-r1b3'],
  ['Policy Dialogue', 'Chairman, Punjab Revenue Authority', 'Engaged in strategic discussions on finance, taxation, and business growth, bringing an ACCA finance perspective to strengthening tax systems and economic policy.', 'https://www.linkedin.com/posts/makhadija_acca-finance-punjabrevenueauthority-activity-7453026321955352576-H8IC'],
  ['Healthcare Consulting Collaboration', 'Dr. Essa Laboratories', 'Led a consulting engagement that extended her expertise into healthcare, applying strategic and operational insight at scale.', 'https://www.linkedin.com/posts/makhadija_collaboration-learning-growth-activity-7462049474945642496-66r-'],
]
const recognitionEntries = [
  { title: 'Appointed Deputy Director, International Collaborations', context: 'PRCCSF', description: 'Leads initiatives strengthening Pakistan-China relations through international business, policy advisory, and cross-border partnerships.', tag: 'Leadership', image: prccsfImage, alt: 'International collaboration at PRCCSF' },
  { title: 'Member, United Business Group (UBG)', context: 'United Business Group', description: 'Joined UBG, a leading platform for industrialists and the business community, working under the leadership of Patron in Chief S. M. Tanvir to advocate for stronger industry representation and policy engagement.', tag: 'Trade', image: ugbImage, alt: 'United Business Group gathering' },
  { title: 'Executive Council & Core Committee Member', context: 'Kasur Chamber of Commerce', description: "Contributes to institutional coordination and regional business strategy within the Chamber's leadership team.", tag: 'Leadership', image: whiteDress, alt: 'Khadija Mubarik Ali at a chamber engagement' },
  { title: 'Elected Senior Vice President', context: 'Kasur Chamber of Commerce & Industry', description: 'Elected to serve Kasur’s business and industrial community, with a focus on stronger representation, new opportunities, and closer institutional ties.', tag: 'Leadership', image: kasurElectionImage, alt: 'Election announcement naming Khadija Mubarik as Senior Vice President of the Kasur Chamber of Commerce and Industry', imageFit: 'contain', celebrateElection: true },
  { title: 'Diplomatic Engagement with the Ambassador of Ethiopia', context: 'Embassy of Ethiopia', description: 'Held high-level talks with H.E. Dr. Oumer Hussein Oba on AI, digital transformation, and Pakistan-Ethiopia collaboration.', tag: 'Diplomacy', image: womenInternational, alt: 'Khadija Mubarik Ali at an international diplomatic engagement' },
  { title: 'Policy Dialogue with the Chairman, Punjab Revenue Authority', context: 'Punjab Revenue Authority', description: "Discussed finance and tax policy, bringing an ACCA finance perspective to strengthening Pakistan's tax systems.", tag: 'Policy', image: womenThree, alt: 'Khadija Mubarik Ali at a policy engagement' },
  { title: 'Healthcare Sector Consulting Collaboration with Dr. Essa Laboratories', context: 'Dr. Essa Laboratories', description: 'Led a consulting engagement extending her strategic and operational expertise into the healthcare industry.', tag: 'Healthcare', image: essaLabImage, alt: 'Healthcare sector collaboration at Dr. Essa Laboratories' },
]
const products = [
  { name: 'ORBITAL', title: "Understanding what's really going on", who: 'Business owners, CEOs, boards, and strategy teams who want decisions based on real understanding, not guesswork.', body: 'Most businesses can see what is happening — sales are down, costs are up, a project is behind schedule. Far fewer can see why. ORBITAL looks past surface numbers and maps the underlying reasons a business behaves the way it does: which few things actually drive results, where risk is building before it becomes a crisis, and where things are heading if nothing changes.', items: ["You're seeing symptoms of a problem but can't pin down the actual cause", "You have plenty of data, but it doesn't explain why things are happening", "Your team disagrees about what's really driving performance", 'Decisions are made from reports and summaries, not real understanding'] },
  { name: 'MAGNUS', title: 'Making sure the story matches the truth', who: 'Investors, private equity firms, lenders, and anyone doing due diligence before committing money or resources.', body: "Before anyone invests, lends, or signs off on a major deal, they need to know one thing: does what the company is saying line up with what's actually true? MAGNUS compares a company's claims and public story against independent signals, spotting gaps, inconsistencies, or risks a polished pitch might not show.", items: ["A company's story sounds great, but you need to verify it's actually true", "You're about to commit capital and want the real risk picture first", 'Warning signs are scattered across public information, not in one place', 'Standard due diligence checks the paperwork but misses the deeper gaps'] },
  { name: 'SIMFORE', title: 'Seeing the future before you commit to it', who: 'Executives, boards, and strategy or transformation leaders who need confidence before a major decision.', body: 'Big decisions come with consequences that unfold over time — some obvious, many not. SIMFORE lets leaders test a decision before making it, simulating how it will play out, including ripple effects, constraints, and risks that simple forecasts tend to miss.', items: ['Big strategic calls are made without properly testing what happens next', 'Forecasts look clean on paper but ignore real-world constraints', 'Your team knows the options but not how each will actually unfold', 'You need to compare several possible paths before deciding'] },
]
const dashboardCompanies = [
  { id: 'khaldun-systems', name: 'Khaldun Systems', sector: 'AI / Tech', description: "AI tools that help leaders see what's really happening, verify assumptions, and test decisions before acting", icon: BrainCircuit, link: 'https://khaldun.systems', linkedin: 'https://www.linkedin.com/company/khaldunsystems/' },
  { id: 'ma-chaudhari', name: 'M.A. Chaudhari & Co.', sector: 'Accounting & Finance', description: 'Chartered accountancy firm serving Pakistan since 1986; only QCR-certified firm in Gujranwala', icon: Landmark, link: 'https://www.machaudhari.co/', linkedin: 'https://www.linkedin.com/company/machaudhari/' },
  { id: 'yesaya', name: 'Yesaya', sector: 'KSA Tech & Finance', description: 'Tech-driven financial solutions in Saudi Arabia', icon: Globe2, link: 'https://yesaya.org', linkedin: 'https://www.linkedin.com/company/yesayaconsultancy/' },
]
const storyRows = [
  { eyebrow: '', title: 'Built on trust', body: 'Every meaningful journey begins with a foundation. Ours began in accounting  where accuracy, transparency, and long-term relationships are not values to aspire to, but principles to uphold.', image: greenImage, alt: 'Khadija Mubarik Ali portrait', icon: Landmark },
  { eyebrow: 'The Signal / Systems', title: 'Seeing the whole picture', body: 'Financial expertise opened the door to something broader, understanding how businesses operate, evolve, and make decisions in a constantly changing world.', image: womenInternational, alt: 'Khadija Mubarik Ali at an international engagement', icon: Network },
  { eyebrow: 'The reach / Region', title: 'Beyond Borders', body: 'An expanding world of relationships, influence, and dialogue, connecting people, institutions, and ideas across borders.', image: womensudiaImage, alt: 'Khadija Mubarik Ali in Saudi Arabia', icon: Globe2 },
  { eyebrow: 'The signal / Systems', title: ['Making Intelligence', 'Useful'], body: 'Technology entered the story as a practical tool: less noise, fewer errors, and better questions before the next important decision.', image: whiteDress, alt: 'Khadija Mubarik Ali in a white dress', icon: BrainCircuit },
  { sections: [
    { eyebrow: '', title: 'What Comes Next', body: 'A broader horizon is taking shape bringing together finance, intelligence, and innovation to build what lasts beyond the present.' },
    { eyebrow: 'The Next Chapter', accentWord: 'Finance.', title: 'Intelligence. Innovation.', headingClassName: 'next-chapter-heading', body: 'A body of work shaped for what comes next.' },
  ], image: womenGreen, alt: 'Khadija Mubarik Ali portrait', icon: Building2 },
]

function ProgressBar({ progressRef }) {
  return <div className="scroll-progress" aria-hidden="true"><div ref={progressRef} /></div>
}

function Header() {
  const location = useLocation()
  const routeActive = { '/companies': 'Companies', '/products': 'Products', '/contact': 'Contact' }[location.pathname] || 'Opening'
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(routeActive)
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef(null)
  const routeLinks = [['/', 'Opening'], ['/companies', 'Companies'], ['/products', 'Products'], ['/contact', 'Contact']]
  const anchorLinks = [['#hero', 'Opening'], ['#story', 'Story'], ['#recognition', 'Recognition'], ['#companies', 'Companies'], ['#products', 'Products'], ['#contact', 'Contact']]
  const links = location.pathname === '/' ? anchorLinks : routeLinks

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    let previousScrolled
    const updateScroll = () => {
      const nextScrolled = window.scrollY > 32
      if (nextScrolled !== previousScrolled) {
        previousScrolled = nextScrolled
        setScrolled(nextScrolled)
      }
    }
    const sectionLabels = new Set(anchorLinks.map(([, label]) => label))
    const sections = [...document.querySelectorAll('[data-section]')].filter((section) => sectionLabels.has(section.dataset.section))
    if (location.pathname !== '/') { updateScroll(); return undefined }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.dataset.section)
    }, { threshold: [0.2, .45, .7], rootMargin: '-18% 0px -58% 0px' })

    sections.forEach((section) => observer.observe(section))
    const setProgress = gsap.quickSetter(progressRef.current, 'scaleX')
    const progressTrigger = ScrollTrigger.create({ onUpdate: (self) => setProgress(self.progress) })
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => { observer.disconnect(); progressTrigger.kill(); window.removeEventListener('scroll', updateScroll) }
  }, [location.pathname])

  const tone = active === 'Opening' && !scrolled ? 'header-transparent' : 'header-paper'
  const handleLinkClick = (event, path, label) => {
    setOpen(false)
    setActive(label)
    if (!path.startsWith('#')) return
    event.preventDefault()
    window.history.replaceState(null, '', path)
    const target = document.querySelector(path)
    if (target) {
      const headerOffset = 62
      const scrollToTarget = (behavior) => {
        const targetTop = target.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: Math.max(0, targetTop - headerOffset), behavior })
      }
      scrollToTarget('smooth')
      window.setTimeout(() => {
        const correction = target.getBoundingClientRect().top - headerOffset
        if (Math.abs(correction) > 2) window.scrollBy({ top: correction, behavior: 'smooth' })
      }, 800)
    }
  }

  return <>
    <ProgressBar progressRef={progressRef} />
    <header className={`site-header ${tone} ${scrolled ? 'is-scrolled' : ''} ${open ? 'menu-open' : ''} ${location.pathname === '/' ? 'home-header' : ''}`}>
      <Link to="/" className="wordmark" onClick={() => setOpen(false)}><img decoding="async" className="wordmark-logo" src={logoBlack} alt="KMA" /></Link>
      <span className="active-section">{active}</span>
      <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={`desktop-nav ${open ? 'open' : ''}`} onClick={(event) => event.target === event.currentTarget && setOpen(false)}>
        {location.pathname === '/' ? links.map(([path, label]) => (
          <a key={path} href={path} className={active === label ? 'active' : ''} onClick={(event) => handleLinkClick(event, path, label)}>{label}</a>
        )) : links.map(([path, label]) => (
          <NavLink key={path} to={path} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}>{label}</NavLink>
        ))}
      </nav>
    </header>
  </>
}

const ContextualNav = Header

function PageFrame({ children }) {
  const location = useLocation()
  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-section], .site-footer')]
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.dataset.motionVisible = String(entry.isIntersecting)
      })
    }, { rootMargin: '160px', threshold: 0 })
    sections.forEach(section => observer.observe(section))
    const updateVisibility = () => {
      document.documentElement.dataset.motionPaused = String(document.hidden)
    }
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateVisibility)
      sections.forEach(section => { delete section.dataset.motionVisible })
      delete document.documentElement.dataset.motionPaused
    }
  }, [location.pathname])
  return <>
    <ContextualNav />
    <main key={location.pathname}>{children}</main>
    <SiteFooter />
  </>
}

function SiteFooter() {
  const year = new Date().getFullYear()
  const companyLinks = ['Khaldun Systems', 'M.A. Chaudhari & Co.', 'Yesaya']
  const productLinks = [
    ['ORBITAL', "Understand what's happening"],
    ['MAGNUS', 'Verify the facts'],
    ['SIMFORE', "See what's next"],
  ]
  const recognitionLinks = ['Deputy Director, PRCCSF', 'UBG Member', 'Kasur Chamber of Commerce', 'Ethiopia Diplomatic Dialogue', 'Punjab Revenue Authority Dialogue']

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <a className="site-footer-logo" href="/#hero"><img decoding="async" src={logoWhite} alt="KMA" /></a>
          <p>Building bridges between vision and execution — across accounting, AI, and cross-border finance.</p>
          <div className="site-footer-socials">
            <a className="site-footer-linkedin" href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn (opens in a new tab)"><FaLinkedin size={26} color="#0A66C2" aria-hidden="true" /></a>
            <a href="mailto:km@khadijamubarik.com" aria-label="Email"><Mail size={15} /></a>
          </div>
        </div>
        <FooterLinkGroup title="Companies" links={companyLinks.map((name) => [name, '/#companies'])} />
        <div className="site-footer-column">
          <h2>Products</h2>
          <ul>{productLinks.map(([name, tagline]) => <li key={name}><a href="/#products"><strong>{name}</strong><span>{tagline}</span></a></li>)}</ul>
        </div>
        <FooterLinkGroup title="Recognition" links={recognitionLinks.map((name) => [name, '/#recognition'])} />
        <div className="site-footer-column site-footer-contact">
          <h2>Get in touch</h2>
          <a className="site-footer-email" href="mailto:km@khadijamubarik.com">km@khadijamubarik.com</a>
          <a className="site-footer-cta" href="/#contact">Send a message <ArrowUpRight size={15} /></a>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© {year} Khadija Mubarik Ali. All rights reserved.</span>
        <div><a href="#">Privacy Policy</a><a href="#">Terms</a></div>
      </div>
    </footer>
  )
}

function FooterLinkGroup({ title, links }) {
  return <div className="site-footer-column"><h2>{title}</h2><ul>{links.map(([label, href]) => <li key={label}><a href={href}>{label}</a></li>)}</ul></div>
}

function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow ${light ? 'light' : ''}`}>{children}</p>
}

function RuleLink({ to, children, external = false }) {
  const props = external ? { href: to, target: '_blank', rel: 'noreferrer' } : { to }
  return external ? <a className="rule-link" {...props}>{children}</a> : <Link className="rule-link" {...props}>{children}</Link>
}

function RecordRow({ item, index }) {
  const rowRef = useRef(null)
  const ruleRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(ruleRef.current, { scaleX: 1 })
      gsap.set(rowRef.current.querySelectorAll('.record-number, .record-institution'), { opacity: 1, color: theme.ink })
      return undefined
    }

    const context = gsap.context(() => {
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(rowRef.current.querySelectorAll('.record-number, .record-institution'), { opacity: .4 })
      gsap.to(ruleRef.current, {
        scaleX: 1, duration: .7, ease: 'power3.out',
        scrollTrigger: { trigger: rowRef.current, start: 'top 75%', toggleActions: 'play none none none' }
      })
      gsap.to(rowRef.current.querySelectorAll('.record-number, .record-institution'), {
        opacity: 1, color: theme.ink, duration: .7, ease: 'power3.out',
        scrollTrigger: { trigger: rowRef.current, start: 'top 75%', toggleActions: 'play none none none' }
      })
    }, rowRef)
    return () => context.revert()
  }, [index])

  return (
    <article className="record-row" ref={rowRef}>
      <div className="record-rule" ref={ruleRef} />
      <span className="record-number">0{index + 1}</span>
      <div className="record-copy">
        <h3 className="record-institution">{item[1]}</h3>
        <p className="record-role">{item[0]}</p>
        <p>{item[2]}</p>
        <RuleLink to={item[3]} external>Source</RuleLink>
      </div>
    </article>
  )
}

function useSceneProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return undefined
    }

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      end: 'bottom 25%',
      scrub: true,
      onUpdate: (instance) => setProgress(instance.progress)
    })

    return () => trigger.kill()
  }, [ref])

  return progress
}

function OrbitalMotif({ progress }) {
  const points = Array.from({ length: 14 }, (_, index) => {
    const angle = (index / 14) * Math.PI * 2
    const radius = 108 + (index % 3) * 30
    return {
      x: 170 + Math.cos(angle) * radius,
      y: 150 + Math.sin(angle) * radius,
      targetX: 170 + Math.cos(angle) * (62 + (index % 2) * 22),
      targetY: 150 + Math.sin(angle) * (62 + (index % 2) * 22)
    }
  })

  return (
    <svg className="system-motif orbital-motif" viewBox="0 0 340 300" aria-hidden="true">
      <circle className="motif-orbit" cx="170" cy="150" r="64" style={{ opacity: progress }} />
      <circle className="motif-orbit motif-orbit-wide" cx="170" cy="150" r="108" style={{ opacity: progress * .45 }} />
      {points.map((point, index) => (
        <circle
          key={index}
          className="motif-dot"
          cx={point.x + (point.targetX - point.x) * progress}
          cy={point.y + (point.targetY - point.y) * progress}
          r={index % 3 === 0 ? 4 : 2.5}
        />
      ))}
      <circle className="motif-core" cx="170" cy="150" r="6" style={{ opacity: progress }} />
    </svg>
  )
}

function MagnusMotif({ progress }) {
  return (
    <div className="system-motif magnus-motif" aria-hidden="true">
      <span className="claim-layer" style={{ transform: `translateX(${(1 - progress) * 24}px)` }}>CLAIM</span>
      <span className="signal-layer" style={{ transform: `translateX(${(1 - progress) * -18}px)`, opacity: .45 + progress * .55 }}>SIGNAL</span>
      <i style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}

function SimforeMotif({ progress }) {
  const branches = [0, 1, 2, 3]

  return (
    <svg className="system-motif simfore-motif" viewBox="0 0 340 300" aria-hidden="true">
      <path className="simfore-trunk" d="M30 150 H120" />
      <g>
        {branches.map((branch) => (
          <path
            key={branch}
            className={`simfore-branch ${branch === 1 ? 'is-selected' : ''}`}
            d={`M120 150 C170 ${150 + (branch - 1.5) * 42}, 205 ${70 + branch * 55}, 310 ${70 + branch * 55}`}
            style={{
              pathLength: 1,
              strokeDashoffset: 1 - progress,
              opacity: branch === 1 ? .25 + progress * .75 : 1 - progress * .7
            }}
          />
        ))}
      </g>
      <circle className="motif-core" cx="120" cy="150" r="5" />
    </svg>
  )
}

function SystemScene({ product, index }) {
  const sectionRef = useRef(null)
  const progress = useSceneProgress(sectionRef)
  const Motif = [OrbitalMotif, MagnusMotif, SimforeMotif][index]

  return (
    <article className={`system-scene system-scene-${product.name.toLowerCase()}`} ref={sectionRef}>
      <div className="system-scene-head">
        <span className="system-id">{product.name}</span>
        <h3>{product.title}</h3>
      </div>
      <div className="system-scene-motif">
        <Motif progress={progress} />
        <span className="motif-state">{progress > .78 ? 'Pattern resolved' : 'Reading the signal'}</span>
      </div>
      <div className="system-scene-content" style={{ opacity: progress > .72 ? 1 : .25 }}>
        <p><strong>Who it's for:</strong> {product.who}</p>
        <p>{product.body}</p>
        <div className="system-help">
          <strong>How it helps</strong>
          <ul>
            {product.items.slice(0, 2).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </article>
  )
}

function NewHero() {
  const sectionRef = useRef(null)
  const [expandedCard, setExpandedCard] = useState(null)
  const stats = [
    ['3', 'Companies in motion'],
    ['1986', 'M.A. Chaudhari & Co. established'],
  ]
  const statsRef = useRef(null)
  const [heroEntered, setHeroEntered] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [animatedStats, setAnimatedStats] = useState(stats.map(([value]) => value))
  const [statsAnimating, setStatsAnimating] = useState(false)
  const tickerTags = ['Governance & assurance', 'Digital transformation', 'Artificial intelligence', 'Investment forums', 'Board advisory', 'Product strategy', 'Education & mentorship', 'Chartered accountancy']
  const pillars = [
    { label: 'Strategy', title: 'Financial Strategy', description: 'A trusted accounting firm serving businesses across Pakistan since 1986.', details: ['Accounting practice', 'QCR certified'], tone: 'cream' },
    { label: 'Systems', title: 'AI Systems', description: "AI tools that help business leaders understand what's really happening, verify assumptions, and test decisions before making them.", details: ['ORBITAL · MAGNUS · SIMFORE', 'For founders, executives, boards & investors'], tone: 'blush' },
    { label: 'Growth', title: 'Cross-Border Growth', description: 'A Saudi Arabia based company combining technology and finance to build smarter financial solutions.', details: ['Pakistan to KSA', 'Tech + Finance'], tone: 'wine' },
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timers = []
    let hasStarted = false
    let statsStarted = false
    const startStatsAnimation = () => {
      if (statsStarted) return
      statsStarted = true
      setStatsAnimating(true)

      const numericStats = [[0, 3], [1, 1986]]
      numericStats.forEach(([index, target]) => {
        const start = Math.floor(target * (.08 + Math.random() * .2))
        const startedAt = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - startedAt) / 1350, 1)
          const easedProgress = 1 - ((1 - progress) ** 3)
          const current = Math.round(start + (target - start) * easedProgress)
          setAnimatedStats((previous) => previous.map((value, valueIndex) => valueIndex === index ? `${current}${index === 0 ? '+' : ''}` : value))
          if (progress < 1) timers.push(window.setTimeout(() => requestAnimationFrame(tick), 45))
        }
        requestAnimationFrame(tick)
      })

      timers.push(window.setTimeout(() => setStatsAnimating(false), 1450))
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasStarted) return
      hasStarted = true
      observer.disconnect()
      setHeroEntered(true)
      timers.push(window.setTimeout(startStatsAnimation, 760))
    }, { threshold: .2 })

    observer.observe(section)
    return () => { observer.disconnect(); timers.forEach((timer) => window.clearTimeout(timer)) }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const context = gsap.context(() => {
      gsap.from('.new-hero-pillar', {
        y: 12,
        duration: .65,
        stagger: .12,
        ease: 'power4.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.new-hero-pillars', start: 'top 86%', once: true },
      })
      gsap.to('.new-hero-portrait img', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section className={`new-hero ${heroEntered ? 'is-entered' : ''}`} id="hero" data-section="Opening" ref={sectionRef}>
      <div className="new-hero-rule" aria-hidden="true" />
      <div className="new-hero-corner-dots new-hero-corner-dots-top" aria-hidden="true" />
      <div className="new-hero-corner-dots new-hero-corner-dots-bottom" aria-hidden="true" />
      <div className="new-hero-content">
        <p className="new-hero-label">Khadija Mubarik</p>
        <h1 className="new-hero-title">
          <span className="new-hero-title-line new-hero-title-primary">Where Business Strategy Meets the Power of AI</span>
        </h1>
        <p className="new-hero-copy">Deputy Director, International Collaborations at PRCCSF  advancing Pakistan-China business, policy, and cross-border partnerships.</p>
        <div className="new-hero-actions">
          <a href="#story" className="new-hero-link">Get Started</a>
          <span className="new-hero-secondary"><span>Manage your business.<br />The professional way</span><a className="new-hero-social-button" href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="Open LinkedIn profile"><FaLinkedin size={34} color="#0A66C2" aria-hidden="true" /></a></span>
        </div>
      </div>
      <div className="new-hero-image-column">
        <div className="new-hero-portrait">
          <div className="new-hero-dots new-hero-dots-top" aria-hidden="true" />
          <div className="new-hero-dots new-hero-dots-bottom" aria-hidden="true" />
          <span className="new-hero-portrait-index">01 / OPENING</span>
          <div className="new-hero-image-glow" aria-hidden="true" />
          <div className="new-hero-image-frame">
            <img decoding="async" src={blueImage} alt="Khadija Mubarik Ali" loading="eager" />
          </div>
          <span className="new-hero-badge"><strong>3 Companies. 1 Vision.</strong></span>
        </div>
        <div className={`new-hero-stats ${statsAnimating ? 'is-animating' : ''}`} ref={statsRef} aria-label="Profile highlights">
          {stats.map(([, label], index) => <div className="new-hero-stat" key={label}><strong>{animatedStats[index]}</strong><span>{label}</span></div>)}
        </div>
      </div>
      <div className="new-hero-ticker" aria-label="Areas of work">
        <div className="new-hero-ticker-track" aria-hidden="true">
          {[...tickerTags, ...tickerTags].map((tag, index) => <span className="new-hero-ticker-item" key={`${tag}-${index}`}><i aria-hidden="true">•</i>{tag}</span>)}
        </div>
      </div>
      <div className="new-hero-pillars">
        {pillars.map(({ label, title, description, details, tone }, index) => {
          const expanded = expandedCard === index
          return <article className={`new-hero-pillar new-hero-pillar-${tone} ${expanded ? 'is-expanded' : ''}`} key={title} onClick={() => setExpandedCard(expanded ? null : index)}>
            <span className="new-hero-pillar-label">{label}</span>
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="new-hero-pillar-more" style={expanded ? { opacity: 1, transform: 'translateY(0)' } : undefined}><span>{details[0]}</span><span>{details[1]}</span></div>
          </article>
        })}
      </div>
    </section>
  )
}

function Opening() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current

    if (!section || !content) return undefined

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const cards = section.querySelectorAll('.reference-float:not(.reference-photo-card)')
      const note = section.querySelector('.reference-note')
      const gridCard = section.querySelector('.reference-grid-card')
      const photo = section.querySelector('.reference-photo-card')
      const photoImage = photo?.querySelector('img')
      const reminder = section.querySelector('.reference-stat-cluster')
      const tasks = section.querySelector('.reference-tasks')
      const integrations = section.querySelector('.reference-integrations')
      const title = section.querySelector('.reference-title')
      const subtext = section.querySelector('.reference-subtext')
      const cta = section.querySelector('.reference-cta')
      const entrance = gsap.timeline({ defaults: { ease: 'power4.out' } })

      if (reduceMotion) {
        gsap.set([...cards, title, photo, subtext, cta].filter(Boolean), { opacity: 1 })
      } else {
        gsap.set(note, { x: -80, opacity: 0, rotation: -13 })
        gsap.set(gridCard, { y: -60, opacity: 0, scale: 0.95 })
        gsap.set(photo, { y: 20, opacity: 0, scale: 0.92, filter: 'blur(10px)' })
        gsap.set(reminder, { x: 80, opacity: 0, rotation: 11 })
        gsap.set(tasks, { y: 60, opacity: 0 })
        gsap.set(integrations, { y: 60, opacity: 0 })
        gsap.set(title, { y: -24, opacity: 0 })
        gsap.set([subtext, cta], { y: 20, opacity: 0 })

        entrance.to(note, { x: 0, opacity: 1, rotation: -6, duration: 0.7 }, 0)
          .to(gridCard, { y: 0, opacity: 1, scale: 1, duration: 0.7 }, 0.12)
          .to(title, { y: 0, opacity: 1, duration: 0.6 }, 0)
          .to(photo, { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7 }, 0.15)
          .to(reminder, { x: 0, opacity: 1, rotation: 5, duration: 0.7 }, 0.28)
          .to(tasks, { y: 0, opacity: 1, rotation: 6, duration: 0.7 }, 0.45)
          .to(integrations, { y: 0, opacity: 1, rotation: -5, duration: 0.7 }, 0.55)
          .to(subtext, { y: 0, opacity: 1, duration: 0.5 }, 0.85)
          .to(cta, { y: 0, opacity: 1, duration: 0.5 }, 0.98)
          .call(() => photoImage?.classList.add('photo-ambient'), [], 0.9)

        entrance.from('.reference-integration-tiles > span', {
          opacity: 0,
          scale: 0.82,
          duration: 0.25,
          stagger: 0.07,
          ease: 'power3.out',
        }, 1.18)
      }

      if (!reduceMotion) {
        cards.forEach((card, index) => {
          gsap.to(card, {
            y: index % 2 ? -5 : 5,
            duration: 4.5 + index * 0.35,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.7 + index * 0.28,
          })
        })

        gsap.to(photo, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }, section)

    return () => {
      section.querySelector('.reference-photo-card img')?.classList.remove('photo-ambient')
      context.revert()
    }
  }, [])

  return (
    <section className="reference-hero legacy-opening" id="legacy-opening" ref={sectionRef}>
      <div className="reference-hero-surface">
        <div className="reference-content" ref={contentRef}>
          <h1 className="reference-title"><span>Khadija Mubarik</span><em>Ali</em></h1>
          <div className="reference-photo-card reference-float" aria-label="Portrait of Khadija Mubarik Ali">
            <img decoding="async" src={womenPortrait} alt="Khadija Mubarik Ali" loading="eager" />
            <span>KMA / 1986</span>
          </div>
          <p className="reference-subtext">Founder and strategic lead at the intersection of accounting, AI, and regional innovation.</p>
          <Link className="reference-cta" to="/about">Explore her story <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="reference-float reference-note" data-enter-rotation="-6" aria-hidden="true">
          <span className="note-paper-stack note-paper-back-one" />
          <span className="note-paper-stack note-paper-back-two" />
          <span className="reference-pin" />
          <strong>make the complex<br />feel possible</strong>
          <span className="reference-note-check">✓</span>
        </div>
        <div className="reference-float reference-grid-card" data-enter-rotation="5" aria-hidden="true">
          <span /><span className="active" /><span /><span />
        </div>
        <div className="reference-float reference-stat-cluster" aria-hidden="true">
          <span className="reference-card-back" />
          <div className="reference-reminder-card">
            <strong>Reminders</strong>
            <div className="reminder-divider"><span>Meetings</span></div>
            <b>Today's Meeting</b>
            <p>Call with marketing team</p>
            <div className="reminder-time"><small>Time</small><span><i>◷</i>13:00 – 13:45</span></div>
          </div>
          <div className="reference-clock-card"><span className="stopwatch-crown" /><span className="stopwatch-face"><i /></span></div>
        </div>
        <div className="reference-float reference-tasks" aria-hidden="true">
          <span className="reference-card-back" />
          <small>Current priorities</small>
          <div><b className="priority-badge priority-orange">01</b><span>Build better systems<time>Sep 10</time><i><u style={{ width: '78%' }} /></i></span><strong>78%</strong><span className="task-avatars"><img decoding="async" src="https://i.pravatar.cc/80?img=47" alt="" /><img decoding="async" src="https://i.pravatar.cc/80?img=12" alt="" /></span></div>
          <div><b className="priority-badge priority-green">02</b><span>Grow the right ventures<time>Sep 18</time><i><u style={{ width: '56%' }} /></i></span><strong>56%</strong><span className="task-avatars"><img decoding="async" src="https://i.pravatar.cc/80?img=32" alt="" /><img decoding="async" src="https://i.pravatar.cc/80?img=5" alt="" /></span></div>
        </div>
        <div className="reference-float reference-integrations" aria-hidden="true">
          <span className="reference-card-back" />
          <small>Connected thinking</small>
          <div className="reference-integration-tiles">
            <span className="integration-gmail"><img decoding="async" className="brand-gmail" src={gmailLogo} alt="Gmail" /></span>
            <span className="integration-slack"><img decoding="async" className="brand-slack" src={slackLogo} alt="Slack" /></span>
            <span className="integration-calendar"><img decoding="async" className="brand-calendar" src={googleCalendarLogo} alt="Google Calendar" /></span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Home() {
  return <>
    <NewHero />
    <Story />
    <Recognition />
    <UzbekistanFeature />
    <HonorsBoard />
    <ExpertiseSection />
    <CompaniesVentures companies={dashboardCompanies} />
    <Products />
    <Contact />
    {/* <TheRecord />
    <TheSystems />
    <TheLine />
    <ClosingEntry />
    <Opening /> */}
  </>
}

function PageIntro({ eyebrow, title, children, light = false }) {
  const stage = eyebrow.includes('Products') ? 'product' : eyebrow.includes('Companies') ? 'system' : 'ledger'

  return (
    <section className={`page-intro journey-stage-${stage} ${light ? 'paper-section' : 'dark-section'}`}>
      <Eyebrow light={!light}>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {children && <p className="intro-copy">{children}</p>}
    </section>
  )
}

function Story() {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const timeline = timelineRef.current
    const track = trackRef.current
    if (!section || !timeline || !track) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let trackLength = 0
    let resizeFrame = 0
    let cleanup = () => {}
    const context = gsap.context(() => {
      const rows = gsap.utils.toArray('.story-row')
      let drawTrigger

      const drawPath = () => {
        const timelineBounds = timeline.getBoundingClientRect()
        const anchors = rows.map((row) => row.querySelector('.story-photo-index'))
          .filter(Boolean)
          .map((anchor) => {
            const bounds = anchor.getBoundingClientRect()
            return {
              x: bounds.left - timelineBounds.left + bounds.width / 2,
              y: bounds.top - timelineBounds.top + bounds.height / 2,
            }
          })

        if (anchors.length < 2 || !timelineBounds.width || !timelineBounds.height) return

        const pathData = anchors.reduce((path, point, index) => {
          if (index === 0) return `M ${point.x} ${point.y}`
          const previous = anchors[index - 1]
          const midpoint = (previous.y + point.y) / 2
          return `${path} C ${previous.x} ${midpoint}, ${point.x} ${midpoint}, ${point.x} ${point.y}`
        }, '')

        track.setAttribute('d', pathData)
        track.ownerSVGElement.setAttribute('viewBox', `0 0 ${timelineBounds.width} ${timelineBounds.height}`)
        trackLength = track.getTotalLength()
        const progress = drawTrigger?.progress || 0
        gsap.set(track, { strokeDasharray: trackLength, strokeDashoffset: reduceMotion ? 0 : trackLength * (1 - progress) })
      }

      drawPath()

      rows.forEach((row) => {
        const photo = row.querySelector('.story-photo')
        const content = row.querySelector('.story-content')
        if (reduceMotion) {
          gsap.set([photo, content], { opacity: 1, clearProps: 'transform' })
          return
        }

        const fromX = row.classList.contains('story-row-reverse') ? 48 : -48
        gsap.fromTo(photo, { scale: .98 }, {
          opacity: 1,
          scale: 1,
          duration: .6,
          ease: 'power4.out',
          scrollTrigger: { trigger: row, start: 'top 78%', once: true },
        })
        gsap.fromTo(content, { x: fromX * .25 }, {
          opacity: 1,
          x: 0,
          duration: .6,
          ease: 'power4.out',
          scrollTrigger: { trigger: row, start: 'top 78%', once: true },
        })
      })

      if (!reduceMotion) {
        const setTrackOffset = gsap.quickSetter(track, 'strokeDashoffset', 'px')
        drawTrigger = ScrollTrigger.create({
          trigger: section,
          start: 'top 72%',
          end: 'bottom 75%',
          scrub: .5,
          onUpdate: (self) => setTrackOffset(trackLength * (1 - self.progress)),
        })
      }

      const resizeObserver = new ResizeObserver(() => {
        if (resizeFrame) return
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = 0
          drawPath()
          requestScrollRefresh()
        })
      })
      resizeObserver.observe(timeline)
      window.addEventListener('load', drawPath, { once: true })

      cleanup = () => {
        resizeObserver.disconnect()
        if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
        window.removeEventListener('load', drawPath)
        drawTrigger?.kill()
      }
    }, section)

    return () => {
      cleanup()
      context.revert()
    }
  }, [])

  return (
    <section className="story-section paper-section" id="story" data-section="Story" ref={sectionRef}>
      <header className="story-header">
        <Eyebrow> KMA Journey </Eyebrow>
        <h2>The Ledger Story</h2>
        <p>A connected record of the ideas, relationships, and systems behind the work.</p>
      </header>
      <div className="story-timeline" ref={timelineRef}>
        <svg className="story-track" preserveAspectRatio="none" aria-hidden="true">
          <path ref={trackRef} d="" />
        </svg>
        <div className="story-rows">
          {storyRows.map((row, index) => {
            const Icon = row.icon
            return (
              <article className={`story-row ${index % 2 ? 'story-row-reverse' : ''}`} key={index}>
                <div className="story-photo-wrap">
                  <figure className="story-photo"><img decoding="async" loading="lazy" src={row.image} alt={row.alt} /></figure>
                  <span className="story-photo-index">0{index + 1}</span>
                </div>
                <div className="story-content">
                  <span className="story-icon"><Icon aria-hidden="true" size={19} /></span>
                  {row.sections ? row.sections.map((section) => (
                    <div className="story-subsection" key={section.title}>
                      <Eyebrow>{section.eyebrow}</Eyebrow>
                      <h3 className={section.headingClassName || ''}>{section.accentWord ? <><span className="accent-word">{section.accentWord}</span> {section.title}</> : section.title}</h3>
                      <p>{section.body}</p>
                    </div>
                  )) : <>
                    <Eyebrow>{row.eyebrow}</Eyebrow>
                    <h3>{Array.isArray(row.title) ? row.title.map((line, lineIndex) => <span key={line}>{line}{lineIndex < row.title.length - 1 && <br />}</span>) : row.title}</h3>
                    {Array.isArray(row.body) ? row.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>{row.body}</p>}
                  </>}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function RecognitionPanel({ entry, index, active, celebrate = false }) {
  const isCelebrating = Boolean(entry.celebrateElection && active && celebrate)
  return (
    <article className={`scroll-gallery-panel recognition-panel ${entry.imageFit === 'contain' ? 'recognition-panel--announcement' : ''} ${entry.celebrateElection ? 'recognition-panel--election' : ''} ${active ? 'is-active' : ''}`}
             aria-hidden={!active} aria-label={`Recognition ${index + 1}: ${entry.title}`}>
      <div className="recognition-copy">
        <div className="recognition-index">{String(index + 1).padStart(2, '0')}</div>
        <h3 className="recognition-title">{entry.title}</h3>
        <p className="recognition-context">{entry.context}</p>
        <p className="recognition-description">{entry.description}</p>
        <span className="recognition-tag">{entry.tag}</span>
      </div>
      <div className="scroll-gallery-panel-image">
        <img decoding="async" loading="eager" fetchPriority="low" src={entry.image} alt={entry.alt} />
      </div>
      {isCelebrating && (
        <div className="election-celebration" aria-hidden="true">
          <span className="election-popper election-popper--left">🎉</span>
          <span className="election-popper election-popper--right">🎉</span>
          {electionConfettiPieces.map((piece) => (
            <span key={piece.id} className={`election-confetti election-confetti--${piece.shape}`} style={piece.style} />
          ))}
        </div>
      )}
    </article>
  )
}

function useScrollGallery(stageRef, entryCount, layout) {
  const galleryRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (!stageRef.current) return undefined
    const gallery = mountScrollGallery(stageRef.current, setActiveIndex, reduceMotion, layout)
    galleryRef.current = gallery
    return () => {
      galleryRef.current = null
      gallery.destroy()
    }
  }, [reduceMotion, entryCount, stageRef, layout])

  const showEntry = index => galleryRef.current?.showEntry(index)
  return { activeIndex, showEntry }
}

function ScrollGallery({ entries, name, layout = 'horizontal', renderPanel }) {
  const stageRef = useRef(null)
  const { activeIndex, showEntry } = useScrollGallery(stageRef, entries.length, layout)
  // Run decorative confetti only while the carousel is visible and motion is allowed.
  const celebrationVisible = useVisibleMotion(stageRef)
  const handleKeyDown = event => {
    const direction = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (!direction || event.altKey || event.ctrlKey || event.metaKey) return
    event.preventDefault()
    showEntry(activeIndex + direction)
  }
  return (
    <div className="scroll-gallery-wrapper">
      <div className={`scroll-gallery-stage scroll-gallery-stage--${layout}`} ref={stageRef}
        role="region" aria-roledescription="carousel" aria-label={`${name} cards`}
        onKeyDown={handleKeyDown}>
        <div className="scroll-gallery-viewport" id={`${name}-slides`} aria-live="off">
          <div className="scroll-gallery-track">
            {entries.map((entry, index) => renderPanel(entry, index, index === activeIndex, celebrationVisible))}
          </div>
        </div>
        <div className="gallery-controls">
          {layout === 'stack' && <div className="gallery-chapters" aria-label="Choose a qualification">
            {entries.map((entry, index) => <button type="button" key={entry.title} aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => showEntry(index)}>{entry.title}</button>)}
          </div>}
          <div className="gallery-buttons">
            <button type="button" aria-label={`Previous ${name} card`} aria-controls={`${name}-slides`} onClick={() => showEntry(activeIndex - 1)}><ChevronLeft size={19} /></button>
            <button type="button" aria-label={`Next ${name} card`} aria-controls={`${name}-slides`} onClick={() => showEntry(activeIndex + 1)}><ChevronRight size={19} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Recognition() {
  const sectionRef = useRef(null)
  return (
    <section className="recognition-section dark-section" id="recognition" data-section="Recognition" ref={sectionRef}>
      <header className="recognition-header">
        <h2><span>Recognition that</span><em>follows the work.</em></h2>
        <p>A formal record of the rooms, responsibilities, and relationships shaping the work.</p>
      </header>
      <ScrollGallery entries={recognitionEntries} name="recognition"
        renderPanel={(entry, index, active, celebrate) => <RecognitionPanel key={entry.title} entry={entry} index={index} active={active} celebrate={celebrate} />} />
    </section>
  )
}

function HonorsBoard() {
  const sectionRef = useRef(null)
  const honors = [
    { title: 'Judge — SEE Pakistan 2026', year: '2026', description: 'Invited to assess the next generation of entrepreneurs and ideas shaping Pakistan’s innovation landscape.', icon: Gavel },
    { title: 'Voice for women in finance & technology', year: 'VOICE', description: 'A visible advocate for women building authority, access, and opportunity across both fields.', icon: Megaphone },
    { title: 'Trusted advisory reputation', year: 'TRUST', description: 'Clients return for judgement that clarifies the decision, not another report that sits on a shelf.', icon: ShieldCheck },
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const visibilityObserver = reduceMotion ? null : new IntersectionObserver(([entry]) => section.classList.toggle('is-visible', entry.isIntersecting), { threshold: .08 })
    visibilityObserver?.observe(section)
    const context = gsap.context(() => {
      const entries = section.querySelectorAll('.honors-board-entry')
      entries.forEach(entry => entry.classList.add('is-active'))
      if (reduceMotion) return
      gsap.fromTo(section.querySelector('.honors-board-frame'), { scale: .98 }, {
        scale: 1, duration: .45, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 92%', once: true }
      })
    }, section)
    return () => { visibilityObserver?.disconnect(); context.revert() }
  }, [])

  return (
    <section className="honors-board dark-section" data-section="Honors" ref={sectionRef}>
      <div className="honors-board-header">
        <Award className="honors-board-watermark" size={220} strokeWidth={.65} aria-hidden="true" />
        <h2><span>Invited to judge,</span><em>advise and set the bar.</em></h2>
        <p>Recognition has followed the work: national innovation platforms, professional communities and clients who return for judgement rather than reports.</p>
      </div>
      <div className="honors-board-layout">
        <figure className="honors-board-feature">
          <div className="honors-board-glow" aria-hidden="true" />
          <div className="honors-board-frame">
            <img decoding="async" loading="eager" src={womenSudia} alt="Khadija Mubarik Ali at an international recognition event" />
          </div>
        </figure>
        <div className="honors-board-list">
          {honors.map(({ title, year, description, icon: Icon }, index) => <article className={`honors-board-entry honors-board-entry-${index + 1}`} key={title}>
            <div className="honors-board-marker"><Icon size={17} strokeWidth={1.5} aria-hidden="true" /></div>
            <div className="honors-board-entry-copy"><h3>{title} <small>{year}</small></h3><p>{description}</p></div>
          </article>)}
        </div>
      </div>
    </section>
  )
}

function Companies() {
  return <>
    <PageIntro eyebrow="Companies" title={<>From raw numbers<br /><em>to decisions.</em></>}>
      <span>Khadija is involved with three companies. Each answers a different question, and together they cover the full distance between raw numbers and confident decisions.</span>
    </PageIntro>
    <section className="paper-section company-list">
      {companies.map((company, index) => (
        <article className={`company-entry ${company.tone}`} key={company.name}>
          <div className="entry-number">0{index + 1}</div>
          <div className="company-main">
            <Eyebrow>{company.type}</Eyebrow>
            <h2>{company.name}</h2>
            <h3>{company.description}</h3>
            <p>{company.body}</p>
            <p className="company-detail">{company.detail}</p>
            {company.link && <RuleLink to={company.link}>See ORBITAL, MAGNUS & SIMFORE</RuleLink>}
          </div>
        </article>
      ))}
    </section>
  </>
}

function Products() {
  return <>
    <PageIntro eyebrow="Khaldun Systems / Products" title={<>Systems for<br /><em>clearer decisions.</em></>}>
      <span>Every business generates data. Very few understand what it's really telling them, whether the story leadership believes matches reality, and what happens next if a decision is made. These three systems close that gap, before big decisions are made, not after.</span>
    </PageIntro>
    <section className="dark-section products-list editorial-products-section" id="products" data-section="Products">
      <ProductCards />
    </section>
  </>
}

function ClosingLedgerEntry() {
  return (
    <section className="closing-chapter paper-section" id="closing" data-section="Closing">
      <div className="record-list">
        <article className="record-row closing-record-entry">
          <div className="record-rule" />
          <span className="record-number">07</span>
          <div className="record-copy">
            <h3 className="record-institution">The next entry is a conversation.</h3>
            <a className="closing-source" href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn source</a>
          </div>
        </article>
      </div>
    </section>
  )
}

function Contact() {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', reason: 'General Inquiry', message: '', website: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      gsap.fromTo('.contact-page-details', { y: reduceMotion ? 0 : 12 }, { y: 0, opacity: 1, duration: .65, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 78%', once: true } })
      gsap.fromTo('.contact-form-wrap', { y: reduceMotion ? 0 : 12 }, { y: 0, opacity: 1, duration: .65, delay: reduceMotion ? 0 : .15, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 78%', once: true } })
    }, section)
    return () => context.revert()
  }, [])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  const submitForm = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.'
    if (!form.message.trim()) nextErrors.message = 'Please add a short message.'
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    if (form.website) return

    setStatus('sending')
    setErrors({})
    try {
      const submission = new FormData()
      submission.append('name', form.name)
      submission.append('email', form.email)
      submission.append('subject', form.reason)
      submission.append('message', form.message)
      submission.append('_subject', 'New Contact Form Submission')
      submission.append('_template', 'table')
      submission.append('_captcha', 'false')
      const response = await fetch('https://formsubmit.co/km@khadijamubarik.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: submission,
      })
      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.error || 'Form submission failed')
      }
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrors({ form: error.message || 'We could not send your message. Please try again or email us directly.' })
    }
  }

  return (
    <section className="contact-page paper-section" id="contact" data-section="Contact" ref={sectionRef}>
      <div className="contact-page-intro">
        <p className="eyebrow">Get in touch</p>
        <h1>Let's start a<br /><em>conversation.</em></h1>
        <p className="contact-page-lede">Have a question about our products, or want to talk business? Send a message and we will get back to you.</p>
      </div>
      <div className="contact-page-grid">
        <aside className="contact-page-details">
          <p className="contact-page-kicker">The next entry</p>
          <h2>Good work starts with a good question.</h2>
          <div className="contact-page-detail-list">
            <a href="mailto:km@khadijamubarik.com"><Mail size={17} aria-hidden="true" /><span><small>Email</small>km@khadijamubarik.com</span></a>
            <div><MapPin size={17} aria-hidden="true" /><span><small>Based in</small>Pakistan / working globally</span></div>
          </div>
          <div className="contact-page-socials">
            <span className="contact-page-kicker">Find us online</span>
            <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
          </div>
        </aside>
        <div className="contact-form-wrap">
          {status === 'success' ? (
            <div className="contact-success" role="status"><span><Check size={22} /></span><h2>Message sent.</h2><p>We will be in touch soon.</p></div>
          ) : (
            <form className="contact-form" action="https://formsubmit.co/km@khadijamubarik.com" method="POST" onSubmit={submitForm} noValidate>
              <label className="contact-field contact-honeypot">Website<input name="website" value={form.website} onChange={updateField} tabIndex="-1" autoComplete="off" /></label>
              <label className="contact-field">Name<input name="name" type="text" value={form.name} onChange={updateField} autoComplete="name" aria-invalid={Boolean(errors.name)} />{errors.name && <span className="contact-field-error">{errors.name}</span>}</label>
              <label className="contact-field">Email<input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <span className="contact-field-error">{errors.email}</span>}</label>
              <label className="contact-field">Subject / Reason<select name="reason" value={form.reason} onChange={updateField}><option>General Inquiry</option><option>Product Question</option><option>Partnership</option><option>Other</option></select></label>
              <label className="contact-field contact-field-message">Message<textarea name="message" rows="5" value={form.message} onChange={updateField} aria-invalid={Boolean(errors.message)} />{errors.message && <span className="contact-field-error">{errors.message}</span>}</label>
              {errors.form && <p className="contact-form-error" role="alert">{errors.form}</p>}
              <button className="contact-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Send message'} <ArrowUpRight size={16} aria-hidden="true" /></button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function TheRecord() {
  return (
    <section className="record-chapter paper-section journey-stage-decision" id="record" data-section="Record">
      <div className="section-heading">
        <Eyebrow>The Record</Eyebrow>
        <h2>Standing built<br /><em>in public.</em></h2>
      </div>
      <div className="record-list">
        {achievements.map((item, index) => <RecordRow key={item[0]} item={item} index={index} />)}
      </div>
    </section>
  )
}

function TheSystems() {
  return (
    <section className="systems-chapter dark-section journey-stage-system" id="systems" data-section="Systems">
      <div className="systems-intro">
        <Eyebrow light>The Systems / Khaldun Systems</Eyebrow>
        <h2>Evidence becomes<br /><em>a decision.</em></h2>
      </div>
      {products.map((product, index) => <SystemScene product={product} index={index} key={product.name} />)}
    </section>
  )
}

function TheLine() {
  return (
    <section className="line-chapter paper-section" id="line" data-section="Line">
      <Eyebrow>The Line</Eyebrow>
      <blockquote>Khadija Mubarik Ali helps accounting and finance businesses save time and reduce errors using AI-powered automation.</blockquote>
    </section>
  )
}

function ClosingEntry() {
  return <ClosingLedgerEntry />
}

function HomeNarrative() {
  return <Home />
}

function App() {
  return (
    <PageFrame>
      <Routes>
        <Route path="/" element={<HomeNarrative />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </PageFrame>
  )
}

export default App
