import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-app flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-2 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-base hover:text-foreground"
            >
              Product
            </a>
            <a
              href="#how"
              className="text-sm font-medium text-muted-foreground transition-base hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-base hover:text-foreground"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-muted-foreground transition-base hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Contact Us
            </a>
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Employee sign in
            </Button>
          </Link>

          <Link to="/employer-login">
            <Button size="sm">Employer portal</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-5 items-center justify-center rounded-md transition-base hover:bg-secondary md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`overflow-hidden border-t border-border bg-background transition-all duration-200 md:hidden ${
            mobileOpen ? "max-h-96" : "max-h-0 border-t-0"
          }`}
        >
          <div className="container-app flex flex-col py-4">
            <a
              href="#features"
              className="py-3 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Product
            </a>

            <a
              href="#how"
              className="py-3 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              How it works
            </a>

            <a
              href="#pricing"
              className="py-3 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </a>

            <a
              href="#contact"
              className="py-3 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Contact Us
            </a>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
              >
                <Button variant="outline" className="w-full">
                  Employee sign in
                </Button>
              </Link>

              <Link
                to="/employer-login"
                onClick={() => setMobileOpen(false)}
              >
                <Button className="w-full">
                  Employer portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}