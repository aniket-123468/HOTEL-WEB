import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import GoldDivider from '../components/GoldDivider';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | Delhi Line Hotel</title>
      </Helmet>
      
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center px-5 pt-20">
        <span className="font-display-lg text-primary text-8xl md:text-9xl mb-4 opacity-20">404</span>
        
        <h1 className="font-headline-md text-headline-md mb-6 max-w-lg">
          We could not find the page you were looking for.
        </h1>
        
        <GoldDivider className="w-24 mb-6 mx-auto" />
        
        <p className="font-body-md text-on-surface-variant max-w-md mb-10">
          The page may have been moved or no longer exists. Let us guide you back to our luxurious spaces.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-80 transition-opacity rounded"
          >
            Return to Homepage
          </Link>
          <Link
            to="/rooms"
            className="border border-primary text-primary px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary/5 transition-colors rounded"
          >
            View Residences
          </Link>
        </div>
      </div>
    </>
  );
}
