/**
 * GoldDivider — 1px horizontal line with gradient that fades at both ends.
 * From DESIGN.md: "A 1px horizontal line, often using a gradient that fades out at both ends,
 * used to separate major editorial sections or to underline 'Display' headlines."
 *
 * @param {boolean} dark — uses the darker secondary (#775a19) variant instead of secondary-fixed-dim (#e9c176)
 * @param {string} className — additional classes (e.g. "w-24 mx-auto" for short centered divider)
 */
export default function GoldDivider({ dark = false, className = '' }) {
  return (
    <div
      className={`h-px w-full ${className}`}
      style={{
        background: dark
          ? 'linear-gradient(90deg, transparent 0%, #775a19 50%, transparent 100%)'
          : 'linear-gradient(90deg, transparent 0%, #e9c176 50%, transparent 100%)',
        opacity: dark ? 0.4 : 0.6,
      }}
      role="separator"
      aria-hidden="true"
    />
  );
}
