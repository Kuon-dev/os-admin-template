'use client';

import { bakeryInfo } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-espresso text-flour">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">
              {bakeryInfo.name}
            </h3>
            <p className="text-cream/80 text-sm leading-relaxed">
              Authentic French pastries and breads crafted with traditional techniques since 1990.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-cream/80 hover:text-cream transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/menu" className="text-cream/80 hover:text-cream transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="/about" className="text-cream/80 hover:text-cream transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-cream/80 hover:text-cream transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>{bakeryInfo.address}</li>
              <li>
                <a href={`tel:${bakeryInfo.phone}`} className="hover:text-cream transition-colors">
                  {bakeryInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${bakeryInfo.email}`} className="hover:text-cream transition-colors">
                  {bakeryInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-cream/20">
          <p className="text-center text-cream/60 text-sm mb-8">
            <strong>Disclaimer:</strong> This is an example website for demonstration purposes only.
            This business does not actually exist.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-cream/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream/60">
          <p>&copy; {new Date().getFullYear()} {bakeryInfo.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cream transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-cream transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
