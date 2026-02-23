import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/constants";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative w-full bg-white border-t border-[#DDE5E1] pt-24 pb-12 px-6 sm:px-12 lg:px-20 font-[Poppins]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-24">
          
          {/* Brand & Mission */}
          <div className="border-l-4 border-[#8CBA41] pl-8">
            <Link href="/" className="inline-block mb-10">
              <span className="text-2xl font-bold text-[#2F3A35] tracking-tighter uppercase">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-[#5C6B64] text-sm font-light leading-relaxed max-w-xs mb-10">
              A thoughtful platform built for teams who value clarity over complexity. We orchestrate flow so you can focus on building what matters.
            </p>
            
            {/* Social - Sharp Style */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-[#8A9E96] uppercase tracking-[0.3em] mb-2">Connect</span>
              <div className="flex gap-6">
                {["Twitter", "GitHub", "Dribbble"].map((s) => (
                  <Link
                    key={s}
                    href="#"
                    className="text-[11px] font-bold uppercase tracking-widest text-[#2F3A35] hover:text-[#8CBA41] transition-colors"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="lg:pl-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8A9E96] mb-8">
              Capabilities
            </h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium text-[#2F3A35] hover:text-[#8CBA41] transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:pl-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8A9E96] mb-8">
              Organization
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium text-[#2F3A35] hover:text-[#8CBA41] transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="lg:pl-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8A9E96] mb-8">
              Newsletter
            </h4>
            <p className="text-[12px] text-[#5C6B64] font-light mb-6">
              Stay updated with our latest releases and notes on productivity.
            </p>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="name@company.com"
                className="w-full bg-[#f8faf9] border border-[#DDE5E1] px-4 py-3 text-xs rounded-none focus:outline-none focus:border-[#8CBA41]"
              />
              <button className="w-full bg-[#2F3A35] text-white px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-none hover:bg-black transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Architectural Divider */}
        <div className="pt-12 border-t border-[#DDE5E1] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-12">
            <p className="text-[10px] text-[#8A9E96] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} {siteConfig.name} Platform
            </p>
            <div className="hidden md:flex gap-8">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A9E96] hover:text-[#2F3A35]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-[#DDE5E1]" />
            <span className="text-[10px] text-[#8A9E96] font-bold uppercase tracking-[0.4em]">
              Crafted in NYC · 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
