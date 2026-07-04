import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetUser, useLogout } from "@workspace/api-client-react";
import { Menu, X, User as UserIcon } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: user } = useGetUser({
    query: {
      retry: false,
      staleTime: 30000,
    },
  });
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/";
      }
    });
  };

  const navLinks = [
    { href: "/", label: "Startseite" },
    { href: "/profile", label: "Profile" },
    { href: "/for-companies", label: "Für Unternehmen" },
    { href: "/how-it-works", label: "So funktioniert es" },
    { href: "/contact", label: "Kontakt" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold text-primary tracking-tight">ProfilFinder</span>
          <span className="text-xl font-bold text-red-600 tracking-tight">.at</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`hover:text-primary transition-colors ${location === link.href ? "text-primary font-semibold" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          {user?.isAdmin && (
            <Link href="/admin" className="text-red-600 hover:text-red-700 transition-colors">
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/my-profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary">
                <UserIcon className="w-4 h-4" />
                Mein Profil
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>Abmelden</Button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-primary">
                Anmelden
              </Link>
              <Link href="/register">
                <Button size="sm">Registrieren</Button>
              </Link>
            </>
          )}
        </div>

        <button 
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col py-4 px-4 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-base font-medium ${location === link.href ? "text-primary" : "text-gray-700"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user?.isAdmin && (
              <Link 
                href="/admin" 
                className="text-base font-medium text-red-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {user ? (
                <>
                  <Link 
                    href="/my-profile" 
                    className="text-base font-medium text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mein Profil
                  </Link>
                  <Button variant="outline" className="w-full justify-center" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                    Abmelden
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Anmelden</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-center">Registrieren</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
