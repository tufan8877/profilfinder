import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 text-center md:text-left">
            <Link href="/" className="flex items-center gap-1 justify-center md:justify-start mb-4">
              <span className="text-xl font-bold text-white tracking-tight">ProfilFinder</span>
              <span className="text-xl font-bold text-red-500 tracking-tight">.at</span>
            </Link>
            <p className="text-sm text-gray-400">
              Österreichs sichere Plattform für anonyme Bewerberprofile. Finden Sie das perfekte Match für Ihr Unternehmen, diskret und professionell.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Bewerber</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/create-profile" className="hover:text-white transition-colors">Profil erstellen</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">So funktioniert es</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Registrieren</Link></li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Unternehmen</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/profile" className="hover:text-white transition-colors">Profile durchsuchen</Link></li>
              <li><Link href="/for-companies" className="hover:text-white transition-colors">Informationen für Unternehmen</Link></li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ProfilFinder.at. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
