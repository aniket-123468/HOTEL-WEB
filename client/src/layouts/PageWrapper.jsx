import Navbar from './Navbar';
import Footer from './Footer';
import FloatingBookingBar from '../components/FloatingBookingBar';

/**
 * PageWrapper — wraps every page with Navbar + main content + FloatingBookingBar + Footer.
 * The `pt-20` on the main tag accounts for the fixed navbar height.
 */
export default function PageWrapper({ children, noFloatingBar = false }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      {!noFloatingBar && <FloatingBookingBar />}
      <Footer />
    </div>
  );
}
