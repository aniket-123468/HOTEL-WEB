import { Link } from 'react-router-dom';
import GoldDivider from '../components/GoldDivider';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      heading: 'Navigate',
      links: [
        { label: 'The Hotel', to: '/' },
        { label: 'Rooms & Suites', to: '/rooms' },
        { label: 'Dining Experiences', to: '/dining' },
        { label: 'Heritage Gallery', to: '/gallery' },
        { label: 'Wellness & Spa', to: '/#wellness' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Cookie Policy', to: '/cookies' },
        { label: 'Careers', to: '/careers' },
      ],
    },
    {
      heading: 'Connect',
      links: [
        { label: 'Instagram', to: '#' },
        { label: 'LinkedIn', to: '#' },
        { label: 'Press Kit', to: '#' },
        { label: 'Contact Us', to: '#' },
      ],
    },
  ];

  return (
    <footer className="w-full pt-20 pb-10 bg-primary border-t border-secondary-fixed-dim/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-[80px] max-w-[1280px] mx-auto">
        {/* Brand Column */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Wordmark */}
          <Link to="/" className="flex flex-col leading-none group w-fit">
            <span
              className="text-secondary-fixed tracking-[0.18em] text-[18px] font-bold uppercase"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Delhi Line
            </span>
            <span className="font-label-caps text-label-caps text-secondary-fixed-dim/70 tracking-[0.25em] text-[9px]">
              Hotel
            </span>
          </Link>

          <p className="text-surface-variant/70 font-body-md text-body-md leading-relaxed max-w-xs">
            Refining the art of heritage hospitality for the discerning global citizen. A new era of luxury living awaits.
          </p>

          {/* Newsletter */}
          <div className="mt-4">
            <p className="font-label-caps text-label-caps text-secondary-fixed-dim mb-3 tracking-widest text-[10px]">
              JOIN OUR INNER CIRCLE
            </p>
            <div className="flex border-b border-secondary-fixed-dim/30 py-2">
              <input
                type="email"
                placeholder="E-mail address"
                className="bg-transparent border-none focus:ring-0 text-on-primary placeholder:text-surface-variant/40 w-full font-body-md text-[14px] focus:outline-none"
              />
              <button
                aria-label="Subscribe"
                className="text-secondary-fixed hover:translate-x-1 transition-transform"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Nav Link Columns */}
        {footerSections.map(({ heading, links }) => (
          <div key={heading} className="flex flex-col gap-4">
            <h4 className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-widest text-[10px]">
              {heading.toUpperCase()}
            </h4>
            <nav className="flex flex-col gap-3">
              {links.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-surface-variant/70 hover:text-secondary-fixed transition-all duration-300 hover:translate-x-1 font-body-md text-[14px] inline-block"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Contact Row */}
      <div className="px-5 md:px-[80px] max-w-[1280px] mx-auto mt-12">
        <GoldDivider dark />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <address className="not-italic text-surface-variant/60 font-body-md text-[13px] leading-relaxed">
            12 Dr. APJ Abdul Kalam Road, New Delhi, 110011, India &nbsp;·&nbsp;
            <span className="text-secondary-fixed">+91 11 4321 0000</span>&nbsp;·&nbsp;
            <a
              href="mailto:reservations@delhilinehotel.com"
              className="hover:text-secondary-fixed transition-colors"
            >
              reservations@delhilinehotel.com
            </a>
          </address>

          <div className="flex gap-6">
            <button aria-label="Language" className="text-secondary-fixed hover:opacity-70 transition-opacity">
              <span className="material-symbols-outlined">language</span>
            </button>
            <button aria-label="Share" className="text-secondary-fixed hover:opacity-70 transition-opacity">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="px-5 md:px-[80px] max-w-[1280px] mx-auto mt-8 pt-6 border-t border-surface-variant/10 text-center">
        <p className="font-body-md text-[12px] text-surface-variant/40">
          © {currentYear} Delhi Line Hotel. All rights reserved. Crafted with heritage in mind.
        </p>
      </div>
    </footer>
  );
}
