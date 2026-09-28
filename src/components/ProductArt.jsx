// Flat product illustrations. Colours come from CSS variables set by
// `artTheme()`, so the same drawing works on every card theme.
// Classes: .a-fill / .a-deep / .a-acc / .a-glow (fills), currentColor (ink).

export const artThemes = {
  volt: { '--art-bg': '#ffd400', '--art-ink': '#1f1d1b', '--art-fill': '#ffe45c', '--art-deep': '#efc400', '--art-accent': '#1f1d1b', '--art-glow': '#ffffff' },
  blue: { '--art-bg': '#3450ff', '--art-ink': '#ffffff', '--art-fill': '#4d68ff', '--art-deep': '#263fe0', '--art-accent': '#ffd400', '--art-glow': '#ffd400' },
  light: { '--art-bg': '#e5e3dd', '--art-ink': '#1f1d1b', '--art-fill': '#f8f7f4', '--art-deep': '#d3d0c7', '--art-accent': '#3450ff', '--art-glow': '#ffd400' },
  dark: { '--art-bg': '#2d2a27', '--art-ink': '#f1f0ec', '--art-fill': '#3a3733', '--art-deep': '#1f1d1b', '--art-accent': '#ffd400', '--art-glow': '#ffd400' },
  copper: { '--art-bg': '#d4692c', '--art-ink': '#1f1d1b', '--art-fill': '#e58a55', '--art-deep': '#b9571f', '--art-accent': '#ffd400', '--art-glow': '#ffe45c' },
  paper: { '--art-bg': '#f4f3ef', '--art-ink': '#1f1d1b', '--art-fill': '#ffffff', '--art-deep': '#e4e1d9', '--art-accent': '#3450ff', '--art-glow': '#ffd400' },
}

// `accent` lets a product tint its illustration (breaker levers, LEDs…) with its brand colour
export const artTheme = (name, accent) => ({
  ...artThemes[name],
  ...(accent && { '--art-accent': accent }),
  backgroundColor: 'var(--art-bg)',
  color: 'var(--art-ink)',
})

const WIRE = { live: '#8b4a2b', neutral: '#2f6bff', earth: '#58b33b', copper: '#e8a04c' }

const Shadow = ({ cx = 80, cy = 110, rx = 44 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry="4" fill="currentColor" opacity=".13" />
)

const Screw = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r="4" className="a-deep" stroke="currentColor" strokeWidth="1.5" />
    <path d={`M${x - 2.4} ${y}h4.8`} stroke="currentColor" strokeWidth="1.5" />
  </g>
)

const art = {
  socket: (
    <>
      <Shadow />
      <rect x="42" y="16" width="76" height="82" rx="16" className="a-fill" stroke="currentColor" strokeWidth="2" />
      <rect x="50" y="24" width="60" height="66" rx="11" className="a-deep" opacity=".45" />
      <circle cx="80" cy="57" r="22" className="a-deep" stroke="currentColor" strokeWidth="2" />
      <circle cx="80" cy="57" r="15.5" className="a-fill" />
      <circle cx="72.5" cy="57" r="3.3" fill="currentColor" />
      <circle cx="87.5" cy="57" r="3.3" fill="currentColor" />
      <rect x="78" y="42.5" width="4" height="6" rx="1.6" className="a-acc" />
      <circle cx="80" cy="88" r="2.2" className="a-acc" />
    </>
  ),
  switch: (
    <>
      <Shadow />
      <rect x="42" y="16" width="76" height="82" rx="16" className="a-fill" stroke="currentColor" strokeWidth="2" />
      <rect x="53" y="28" width="54" height="58" rx="9" className="a-deep" stroke="currentColor" strokeWidth="2" />
      <rect x="55.5" y="30.5" width="49" height="26" rx="7" className="a-fill" />
      <path d="M55 57.5h50" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
      <path d="M72 44h16" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
      <circle cx="80" cy="74" r="2.6" className="a-acc" />
    </>
  ),
  breaker: (
    <>
      <Shadow />
      <rect x="16" y="54" width="128" height="10" rx="2" fill="currentColor" opacity=".18" />
      {[49, 81].map((x, i) => (
        <g key={x}>
          <rect x={x} y="12" width="30" height="94" rx="5" className="a-fill" stroke="currentColor" strokeWidth="2" />
          <path d={`M${x} 33h30M${x} 85h30`} stroke="currentColor" strokeOpacity=".28" strokeWidth="1.5" />
          <Screw x={x + 15} y={22.5} />
          <Screw x={x + 15} y={95.5} />
          <rect x={x + 7} y="42" width="16" height="31" rx="3" fill="currentColor" />
          <rect x={x + 9.5} y={i === 0 ? 44.5 : 57} width="11" height="13.5" rx="2" className="a-acc" />
          <rect x={x + 9} y="77" width="12" height="3.5" rx="1" fill="currentColor" opacity=".35" />
        </g>
      ))}
    </>
  ),
  board: (
    <>
      <Shadow rx={48} cy={112} />
      <rect x="30" y="8" width="100" height="100" rx="10" className="a-fill" stroke="currentColor" strokeWidth="2" />
      <rect x="39" y="17" width="82" height="76" rx="5" className="a-deep" stroke="currentColor" strokeWidth="1.5" />
      {[25, 57].map((y) =>
        Array.from({ length: 6 }).map((_, i) => {
          const x = 43.5 + i * 12.4
          return (
            <g key={`${y}-${i}`}>
              <rect x={x} y={y} width="11" height="27" rx="2" className="a-fill" stroke="currentColor" strokeWidth="1.2" />
              <rect x={x + 3} y={y + 8} width="5" height="8" rx="1" className={(i + y) % 3 ? 'a-acc' : ''} fill={(i + y) % 3 ? undefined : 'currentColor'} />
            </g>
          )
        }),
      )}
      <rect x="72" y="98" width="16" height="4" rx="2" fill="currentColor" />
    </>
  ),
  cable: (
    <>
      <Shadow cx={74} rx={50} />
      <circle cx="64" cy="58" r="44" className="a-fill" stroke="currentColor" strokeWidth="2" />
      <circle cx="64" cy="58" r="35" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="7" />
      <circle cx="64" cy="58" r="25" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="7" />
      <circle cx="64" cy="58" r="14" className="a-deep" stroke="currentColor" strokeWidth="2" />
      <path d="M103 76c13 5 21 13 28 23" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M103 76c13 5 21 13 28 23" className="s-fill" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M132 100l11-6" stroke={WIRE.live} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M132 100l13 2" stroke={WIRE.neutral} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M132 100l9 9" stroke={WIRE.earth} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M132 100l9 9" stroke="#ffd400" strokeWidth="3.4" strokeDasharray="2.5 2.5" />
      <circle cx="144.5" cy="93.2" r="2" fill={WIRE.copper} />
      <circle cx="147" cy="102.3" r="2" fill={WIRE.copper} />
      <circle cx="142.6" cy="110.6" r="2" fill={WIRE.copper} />
    </>
  ),
  bulb: (
    <>
      <circle cx="80" cy="44" r="46" className="a-glow" opacity=".2" />
      {[-150, -120, -90, -60, -30, 0, 180].map((a) => {
        const r = (a * Math.PI) / 180
        return (
          <path
            key={a}
            d={`M${80 + Math.cos(r) * 39} ${44 + Math.sin(r) * 39}L${80 + Math.cos(r) * 47} ${44 + Math.sin(r) * 47}`}
            className="s-acc"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )
      })}
      <path
        d="M80 12c-19 0-33 14-33 32 0 12 6 19 11 25 3 4 4 7 4 11v3h36v-3c0-4 1-7 4-11 5-6 11-13 11-25 0-18-14-32-33-32z"
        className="a-fill"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M72 83V62M88 83V62" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" />
      <path d="M69 60l5.5-9 5.5 9 5.5-9 5.5 9" className="s-acc" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
      <rect x="61" y="85" width="38" height="7" rx="2" fill="currentColor" />
      <rect x="63" y="94" width="34" height="6" rx="2" fill="currentColor" opacity=".8" />
      <path d="M69 102h22l-4 7H73z" fill="currentColor" />
    </>
  ),
  panel: (
    <>
      <path d="M48 58L20 114h120L112 58z" className="a-glow" opacity=".28" />
      <ellipse cx="80" cy="112" rx="50" ry="4" className="a-glow" opacity=".5" />
      <path d="M44 38l-9-12M116 38l9-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M46 52c0-18 15-30 34-30s34 12 34 30" className="a-deep" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="80" cy="52" rx="38" ry="12" className="a-fill" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="80" cy="54" rx="29" ry="7.5" className="a-glow" />
    </>
  ),
  plc: (
    <>
      <Shadow rx={54} />
      <rect x="18" y="54" width="124" height="10" rx="2" fill="currentColor" opacity=".18" />
      <rect x="28" y="16" width="104" height="88" rx="7" className="a-fill" stroke="currentColor" strokeWidth="2" />
      {[23, 83].map((y) => (
        <g key={y}>
          <rect x="34" y={y} width="92" height="14" rx="3" className="a-deep" />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={38 + i * 11} y={y + 3} width="7" height="8" rx="1.5" fill="currentColor" opacity=".55" />
          ))}
        </g>
      ))}
      <rect x="34" y="42" width="56" height="36" rx="3" fill="currentColor" />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle
          key={i}
          cx={42 + (i % 6) * 8}
          cy={i < 6 ? 53 : 67}
          r="2.2"
          className={[0, 2, 3, 7, 10].includes(i) ? 'a-acc' : 'a-fill'}
          opacity={[0, 2, 3, 7, 10].includes(i) ? 1 : 0.35}
        />
      ))}
      <rect x="96" y="42" width="30" height="36" rx="3" className="a-deep" />
      <path d="M101 52h20M101 59h14M101 66h17" stroke="currentColor" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  drive: (
    <>
      <Shadow />
      <rect x="46" y="6" width="68" height="102" rx="8" className="a-fill" stroke="currentColor" strokeWidth="2" />
      <path d="M58 14h44M58 19h44" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.5" />
      <rect x="55" y="26" width="50" height="24" rx="3" fill="currentColor" />
      <rect x="60" y="32" width="24" height="4.5" rx="1" className="a-acc" />
      <rect x="60" y="40" width="34" height="3" rx="1" className="a-acc" opacity=".45" />
      <circle cx="80" cy="70" r="12" className="a-deep" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="70" r="4.5" className="a-acc" />
      {[
        [60, 64],
        [60, 76],
        [100, 64],
        [100, 76],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3.4" fill="currentColor" opacity=".5" />
      ))}
      <path d="M58 92h44M58 97h44" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.5" />
    </>
  ),
  terminal: (
    <>
      <Shadow />
      {[44, 72, 100].map((x, i) => (
        <path
          key={`w${x}`}
          d={`M${x + 8} 90c0 8 ${(i - 1) * 6} 12 ${(i - 1) * 10} 22`}
          stroke={[WIRE.live, WIRE.neutral, WIRE.earth][i]}
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <rect x="34" y="50" width="92" height="40" rx="7" className="a-fill" stroke="currentColor" strokeWidth="2" />
      {[44, 72, 100].map((x) => (
        <g key={x}>
          <rect x={x} y="68" width="16" height="15" rx="2.5" className="a-deep" />
          <rect x={x + 5} y="71" width="6" height="9" rx="1" fill={WIRE.copper} />
          <path d={`M${x - 3} 55L${x + 1} 18h14l${4} 37z`} className="a-acc" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </g>
      ))}
    </>
  ),
  meter: (
    <>
      <Shadow />
      <rect x="42" y="10" width="76" height="96" rx="8" className="a-fill" stroke="currentColor" strokeWidth="2" />
      <rect x="50" y="20" width="60" height="28" rx="3" fill="currentColor" />
      <text x="80" y="39.5" textAnchor="middle" className="a-acc" style={{ font: '600 13px "JetBrains Mono Variable", monospace' }}>
        230.4
      </text>
      <circle cx="56" cy="58" r="2.6" className="a-acc" />
      <path d="M64 58h40" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      <rect x="42" y="70" width="76" height="36" rx="0" className="a-deep" />
      <path d="M42 70h76" stroke="currentColor" strokeWidth="2" />
      <rect x="42" y="10" width="76" height="96" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
      {[56, 72, 88, 104].map((x) => (
        <Screw key={x} x={x} y={88} />
      ))}
    </>
  ),
  ev: (
    <>
      <Shadow cx={86} rx={52} />
      <path d="M69 92c0 14 18 20 34 14s27-11 30-25" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="40" y="8" width="58" height="84" rx="16" className="a-fill" stroke="currentColor" strokeWidth="2" />
      <circle cx="69" cy="42" r="15" fill="none" className="s-acc" strokeWidth="4.5" />
      <path d="M71.5 31.5l-9 12.5h6.5l-2.5 10 9-13h-6.5z" className="a-acc" />
      <rect x="58" y="70" width="22" height="4" rx="2" fill="currentColor" opacity=".35" />
      <rect x="124" y="54" width="20" height="28" rx="6" className="a-deep" stroke="currentColor" strokeWidth="2" />
      <circle cx="134" cy="68" r="4" fill="currentColor" opacity=".6" />
    </>
  ),
}

export default function ProductArt({ type, className = '', ...props }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {art[type] ?? art.socket}
    </svg>
  )
}
