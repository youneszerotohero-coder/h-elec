const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const Bolt = (p) => (
  <svg viewBox="0 0 64 88" aria-hidden="true" {...p}>
    <path d="M40.5 0 4 50.5h23.5L20.5 88 60 34H35.5z" fill="currentColor" />
  </svg>
)

export const Power = ({ strokeWidth = 4, ...p }) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={strokeWidth} {...p}>
    <path d="M7.2 5.8a8.2 8.2 0 1 0 9.6 0" />
    <path d="M12 2.4v8.2" />
  </svg>
)

// data-flip: mirrored in RTL so arrows follow the reading direction (see index.css)
export const ArrowRight = (p) => (
  <svg viewBox="0 0 24 24" data-flip {...base} {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

export const ArrowUpRight = (p) => (
  <svg viewBox="0 0 24 24" data-flip {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const ArrowUp = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 20V4M6 10l6-6 6 6" />
  </svg>
)

export const ArrowDown = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </svg>
)

export const Plus = (p) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Minus = (p) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2} {...p}>
    <path d="M5 12h14" />
  </svg>
)

export const Search = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
)

export const External = (p) => (
  <svg viewBox="0 0 24 24" data-flip {...base} {...p}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </svg>
)

export const Check = (p) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const Close = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const Phone = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
)

export const Mail = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const Pin = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

export const Upload = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 15V4M7 9l5-5 5 5" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
)

export const FileIcon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </svg>
)

export const WhatsApp = (p) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2m0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2m4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3"
    />
  </svg>
)

export const SocialIcon = ({ name, ...p }) => {
  if (name === 'linkedin')
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
        <path fill="currentColor" d="M5.4 8.2H2.2V21h3.2zM3.8 3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8M21.8 13.8c0-3.5-1.9-5.9-5-5.9a4.3 4.3 0 0 0-3.8 2.1V8.2H9.9V21h3.2v-6.4c0-1.7.3-3.3 2.4-3.3s2.1 1.9 2.1 3.4V21h3.2z" />
      </svg>
    )
  if (name === 'instagram')
    return (
      <svg viewBox="0 0 24 24" {...base} strokeWidth={1.9} {...p}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path fill="currentColor" d="M13.5 21v-7.5H16l.4-3h-2.9V8.7c0-.9.3-1.5 1.5-1.5h1.5V4.5a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.3H8v3h2.6V21z" />
    </svg>
  )
}
