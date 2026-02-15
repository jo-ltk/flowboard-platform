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
    <footer className="border-t border-border-soft bg-cream-warm py-12 sm:py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-8 sm:gap-12 py-8 sm:py-12 md:grid-cols-4 lg:gap-20">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-deep-blue shadow-soft">
                <span className="text-sm font-bold text-cream">F</span>
              </div>
              <span className="text-lg font-syne font-bold text-deep-blue tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 sm:mt-6 max-w-xs text-sm leading-relaxed text-deep-blue/45">
              The modern productivity platform for teams who value design, clarity, and speed.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-deep-blue/40">
              Product
            </h4>
            <ul className="mt-5 sm:mt-8 flex flex-col gap-3 sm:gap-4">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-deep-blue/60 transition-colors hover:text-deep-blue min-h-[44px] sm:min-h-0 inline-flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-deep-blue/40">
              Company
            </h4>
            <ul className="mt-5 sm:mt-8 flex flex-col gap-3 sm:gap-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-deep-blue/60 transition-colors hover:text-deep-blue min-h-[44px] sm:min-h-0 inline-flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-deep-blue/40">
              Legal
            </h4>
            <ul className="mt-5 sm:mt-8 flex flex-col gap-3 sm:gap-4">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-deep-blue/60 transition-colors hover:text-deep-blue min-h-[44px] sm:min-h-0 inline-flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center justify-between gap-4 sm:gap-6 border-t border-deep-blue/5 py-8 sm:py-10 sm:flex-row">
          <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-deep-blue/30 text-center sm:text-left">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap justify-center">
            <Link href="#" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-deep-blue/30 transition-colors hover:text-deep-blue min-h-[44px] sm:min-h-0 inline-flex items-center">
              Twitter
            </Link>
            <Link href="#" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-deep-blue/30 transition-colors hover:text-deep-blue min-h-[44px] sm:min-h-0 inline-flex items-center">
              GitHub
            </Link>
            <Link href="#" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-deep-blue/30 transition-colors hover:text-deep-blue min-h-[44px] sm:min-h-0 inline-flex items-center">
              Dribbble
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
