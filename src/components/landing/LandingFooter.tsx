import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { ROUTES } from '@/constants';

export function LandingFooter() {
  return (
    <footer className="border-t-2 border-ink bg-white py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link to={ROUTES.LANDING} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-primary shadow-brutal-sm">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-extrabold">FlowPilot</span>
            </Link>
            <p className="mt-3 text-sm text-muted max-w-xs">
              Project management for teams that value speed, clarity, and actually shipping.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <p className="font-extrabold text-ink mb-3">Product</p>
              <ul className="space-y-2 text-muted font-semibold">
                <li><a href="#features" className="hover:text-ink">Features</a></li>
                <li><Link to={ROUTES.DASHBOARD} className="hover:text-ink">Demo</Link></li>
                <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-extrabold text-ink mb-3">Company</p>
              <ul className="space-y-2 text-muted font-semibold">
                 <li><Link to="/about" className="hover:text-ink">About</Link></li>
                <li><Link to="/blog" className="hover:text-ink">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-ink">Careers</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-extrabold text-ink mb-3">Legal</p>
              <ul className="space-y-2 text-muted font-semibold">
                <li><Link to="/privacy-policy" className="hover:text-ink">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-ink">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t-2 border-ink/10 flex flex-col sm:flex-row justify-between gap-2 text-sm font-semibold text-muted">
          <p>&copy; {new Date().getFullYear()} FlowPilot. All rights reserved.</p>
          <p>Made with care in San Francisco</p>
        </div>
      </div>
    </footer>
  );
}
