// Small, static SVG sculptures. Only their containing layer moves on hover.
// Decorative artwork stays outside the text and button layers.
export function ProductIllustration({ tone, id }) {
  const gradient = name => `${id}-${name}`
  const paint = name => `url(#${gradient(name)})`
  return (
    <svg className={`editorial-product-art editorial-product-art--${tone}`} viewBox="0 0 300 280" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={gradient('pearl')} cx=".26" cy=".2" r=".85">
          <stop stopColor="#fffcf6" />
          <stop offset=".32" stopColor="var(--sculpture-light)" />
          <stop offset=".78" stopColor="var(--sculpture-mid)" />
          <stop offset="1" stopColor="var(--sculpture-deep)" />
        </radialGradient>
        <linearGradient id={gradient('panel')} x1="0" y1="0" x2="1" y2=".9">
          <stop stopColor="#fffef7" stopOpacity=".88" />
          <stop offset=".52" stopColor="var(--sculpture-light)" stopOpacity=".5" />
          <stop offset="1" stopColor="var(--sculpture-mid)" stopOpacity=".62" />
        </linearGradient>
        <linearGradient id={gradient('bar')} x1="0" y1="0" x2="1" y2=".2">
          <stop stopColor="var(--sculpture-light)" />
          <stop offset="1" stopColor="var(--sculpture-deep)" />
        </linearGradient>
        <linearGradient id={gradient('face')} x1="0" y1="0" x2="1" y2=".6">
          <stop stopColor="#fff7e5" stopOpacity=".9" />
          <stop offset="1" stopColor="var(--sculpture-mid)" stopOpacity=".8" />
        </linearGradient>
        <radialGradient id={gradient('ground')}>
          <stop stopColor="currentColor" stopOpacity=".18" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {tone === 'orbital' && <>
        <ellipse cx="176" cy="235" rx="91" ry="17" fill={paint('ground')} />
        <g fill="none" stroke="currentColor" strokeWidth=".8" opacity=".2">
          <ellipse cx="170" cy="166" rx="128" ry="42" transform="rotate(-43 170 166)" />
          <ellipse cx="170" cy="166" rx="115" ry="31" transform="rotate(-43 170 166)" />
        </g>
        <circle cx="170" cy="166" r="68" fill={paint('pearl')} stroke="#fff9ee" strokeOpacity=".65" strokeWidth=".8" />
        <path d="M119 124C128 103 151 95 173 100" fill="none" stroke="#fffdf6" strokeWidth="1.5" opacity=".55" />
        <g fill="none" stroke="#fffaf1" strokeWidth="1.1">
          <ellipse cx="170" cy="166" rx="128" ry="42" transform="rotate(-43 170 166)" />
          <ellipse cx="170" cy="166" rx="112" ry="29" transform="rotate(-43 170 166)" opacity=".75" />
        </g>
        <circle cx="226" cy="157" r="9" fill={paint('pearl')} stroke="#fff9ee" strokeWidth=".8" />
      </>}
      {tone === 'magnus' && <>
        <ellipse cx="179" cy="245" rx="106" ry="21" fill={paint('ground')} />
        <g transform="matrix(1 -.27 -.13 1 29 50)" stroke="#fffdf4" strokeWidth="1">
          <rect x="88" y="20" width="147" height="174" rx="12" fill={paint('panel')} opacity=".55" />
          <rect x="54" y="48" width="154" height="172" rx="12" fill={paint('panel')} />
          <rect x="70" y="72" width="122" height="116" rx="7" fill={paint('panel')} strokeOpacity=".4" />
          <path d="M83 91V173H180" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="1.5" />
          {[{ x: 90, h: 25 }, { x: 112, h: 40 }, { x: 134, h: 56 }, { x: 156, h: 78 }].map(({ x, h }) => (
            <g key={x}>
              <rect x={x} y={171 - h} width="13" height={h} rx="2" fill={paint('bar')} stroke="currentColor" strokeOpacity=".18" />
              <path d={`M${x + 2} ${173 - h}V168`} stroke="#fffdf4" strokeOpacity=".5" />
            </g>
          ))}
          <path d="M80 201H159" stroke="currentColor" strokeOpacity=".1" strokeWidth="4" strokeLinecap="round" />
          <path d="M80 211H135" stroke="currentColor" strokeOpacity=".08" strokeWidth="3" strokeLinecap="round" />
        </g>
      </>}
      {tone === 'simfore' && <>
        <ellipse cx="187" cy="243" rx="100" ry="20" fill={paint('ground')} />
        <g fill="none" strokeWidth=".85">
          <ellipse cx="163" cy="184" rx="127" ry="37" transform="rotate(-39 163 184)" stroke="currentColor" opacity=".19" />
          <path d="M59 253C78 163 174 117 291 78" stroke="#fffaf0" opacity=".8" />
          <path d="M77 263C108 187 210 148 300 142" stroke="#fffaf0" opacity=".55" />
        </g>
        {[{ x: 109, y: 163 }, { x: 141, y: 123 }, { x: 173, y: 87 }, { x: 205, y: 42 }].map(({ x, y }) => (
          <g key={x} stroke="#fff7e8" strokeOpacity=".85" strokeWidth=".85">
            <path d={`M${x} ${y + 9}L${x + 26} ${y + 18}V237L${x} 228Z`} fill={paint('face')} />
            <path d={`M${x + 26} ${y + 18}L${x + 44} ${y + 8}V227L${x + 26} 237Z`} fill={paint('bar')} opacity=".75" />
            <path d={`M${x} ${y + 9}L${x + 18} ${y}L${x + 44} ${y + 8}L${x + 26} ${y + 18}Z`} fill={paint('face')} />
          </g>
        ))}
        <circle cx="79" cy="227" r="9" fill={paint('pearl')} stroke="#fff8e8" strokeWidth=".6" />
      </>}
    </svg>
  )
}
