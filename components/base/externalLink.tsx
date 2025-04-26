interface ExternalLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

/**
 * A functional component that renders an external link.
 *
 * @param {Object} props - The props for the ExternalLink component.
 * @param {string} props.href - The URL to which the link points.
 * @param {React.ReactNode} props.children - The content to be displayed inside the link.
 *
 * @returns {JSX.Element} A styled anchor element that opens the link in a new tab.
 *
 * @remarks
 * The `target="_blank"` attribute ensures the link opens in a new tab, and the
 * `rel="noopener noreferrer"` attribute improves security by preventing the new page
 * from accessing the `window.opener` property.
 */
export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}
