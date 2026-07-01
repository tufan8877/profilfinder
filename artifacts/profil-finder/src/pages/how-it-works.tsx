import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, ShieldCheck, UserCheck, MessageSquare } from "lucide-react";

export default function HowItWorks() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">So funktioniert ProfilFinder.at</h1>
        <p className="text-lg text-gray-600 mb-12 text-center">In vier einfachen Schritten zu Ihrem Traumjob – diskret und sicher.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-primary">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Profil erstellen</h3>
                <p className="text-gray-600">Sie registrieren sich und erstellen ein aussagekräftiges Profil mit Ihren Fähigkeiten, Erfahrungen und Wünschen.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-primary">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Anonym bleiben</h3>
                <p className="text-gray-600">Ihr Name und Ihre Kontaktdaten bleiben verborgen. Ihr Profil erhält eine einzigartige Profilnummer.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-primary">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Gefunden werden</h3>
                <p className="text-gray-600">Unternehmen durchsuchen unsere Datenbank und finden Ihr Profil anhand Ihrer Qualifikationen.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-primary">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">4. Selbst entscheiden</h3>
                <p className="text-gray-600">Bei Interesse sendet das Unternehmen eine Anfrage. Sie entscheiden, wem Sie antworten und Ihre Daten preisgeben.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
