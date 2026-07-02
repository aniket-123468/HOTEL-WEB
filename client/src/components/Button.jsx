/**
 * Button — Design System component per DESIGN.md
 *
 * Variants:
 *   primary  — solid charcoal bg, white text, label-caps typography
 *   ghost    — 1px gold border, gold text, transparent bg (ghost/secondary)
 *   text     — no border/bg, gold underline text link style
 *
 * All buttons use label-caps typography (Inter, uppercase, 0.1em letter-spacing, 600 weight)
 * Radius: 0.25rem (soft, not bubbly) per design spec
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses =
    'font-label-caps text-label-caps uppercase tracking-widest transition-all duration-300 rounded inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-5 py-2.5',
    md: 'px-8 py-4',
    lg: 'px-10 py-5',
  };

  const variantClasses = {
    primary:
      'bg-primary text-on-primary hover:opacity-80 active:scale-[0.98]',
    ghost:
      // NOTE: WCAG flag — gold (#775a19) on white passes ~4.6:1 AA. Using secondary (#775a19) not gold (#C5A059).
      'border border-secondary text-secondary bg-transparent hover:bg-secondary/10 active:scale-[0.98]',
    'ghost-white':
      'border border-white text-white bg-transparent hover:bg-white hover:text-primary active:scale-[0.98]',
    text:
      'text-secondary border-b border-secondary/40 pb-0.5 hover:border-secondary px-0 py-0 rounded-none',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size] ?? sizeClasses.md} ${variantClasses[variant] ?? variantClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
