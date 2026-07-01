import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ForCompanies() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Finden Sie die besten Talente für Ihr Unternehmen</h1>
          <p className="text-xl text-gray-600">
            Auf ProfilFinder.at präsentieren sich qualifizierte Fachkräfte anonym und diskret.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Warum ProfilFinder.at?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-primary mr-2 font-bold">✓</span>
                <span><strong>Zugang zu passiven Kandidaten:</strong> Viele Bewerber sind in einem aufrechten Dienstverhältnis und suchen diskret nach neuen Herausforderungen.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 font-bold">✓</span>
                <span><strong>Qualifizierte Profile:</strong> Fokus auf Fähigkeiten, Erfahrung und Ausbildung.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 font-bold">✓</span>
                <span><strong>Einfacher Prozess:</strong> Profil finden, Anfrage senden, in Kontakt treten.</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-4">Bereit, Kandidaten zu finden?</h3>
            <p className="mb-6">Durchsuchen Sie unsere Datenbank und finden Sie das passende Profil für Ihre offene Position.</p>
            <Link href="/profile">
              <Button className="w-full">Profile durchsuchen</Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
