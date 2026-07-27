import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, ArrowUpRight } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
  return (
    <footer className="relative bg-navy-950 border-t border-gold-400/10">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <Logo size="lg" />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Your trusted partner for Mutual Funds, SIP, Insurance, and Wealth Planning. Building secure financial futures with expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Services</h3>
            <ul className="space-y-3">
              {[
                { name: 'Mutual Funds', href: '/mutual-funds' },
                { name: 'Insurance', href: '/insurance' },
                { name: 'SIP Plans', href: '/sip-plans' },
                { name: 'SIP Calculator', href: '/sip-calculator' },
                { name: 'Lumpsum Calculator', href: '/lumpsum-calculator' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-gold-400 text-sm transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Company</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/#about' },
                { name: 'Why Choose Us', href: '/#why-us' },
                { name: 'Contact', href: '/contact' },
                { name: 'Login', href: '/login' },
                { name: 'Register', href: '/register' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-gold-400 text-sm transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Get In Touch</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://www.instagram.com/ysinvestmentconsultants/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 hover:text-gold-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center group-hover:bg-gold-400/20 transition-all">
                    <Instagram className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium block text-white/70">Instagram</span>
                    <span className="text-xs">@ysinvestmentconsultant</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:9810062733" className="flex items-center gap-3 text-white/50 hover:text-gold-400 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center group-hover:bg-gold-400/20 transition-all">
                    <Phone className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium block text-white/70">Phone</span>
                    <span className="text-xs">9810062733</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:ysconsultant2020@gmail.com" className="flex items-center gap-3 text-white/50 hover:text-gold-400 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center group-hover:bg-gold-400/20 transition-all">
                    <Mail className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium block text-white/70">Email</span>
                    <span className="text-xs">ysconsultant2020@gmail.com</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} YS Investment Consultants. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/ysinvestmentconsultants/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold-400 hover:border-gold-400/30 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a href="tel:9810062733" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold-400 hover:border-gold-400/30 transition-all">
              <Phone className="w-4 h-4" />
            </a>
            <a href="mailto:ysconsultant2020@gmail.com" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold-400 hover:border-gold-400/30 transition-all">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
