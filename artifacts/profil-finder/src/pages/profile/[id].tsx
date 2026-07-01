import { MainLayout } from "@/components/layout/MainLayout";
import { useGetProfileByNumber } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Briefcase, Clock, Building2, ChevronLeft, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { ContactRequestModal } from "@/components/shared/ContactRequestModal";
import { useState } from "react";
import NotFound from "@/pages/not-found";

export default function ProfileDetail() {
  const params = useParams<{ id: string }>();
  const profileNumber = params.id;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // If no profileNumber, wouter should handle this but just in case
  if (!profileNumber) return <NotFound />;

  const { data: profile, isLoading, error } = useGetProfileByNumber(profileNumber, {
    query: {
      enabled: !!profileNumber,
      queryKey: ["getProfileByNumber", profileNumber]
    }
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Profil nicht gefunden</h1>
          <p className="text-gray-600 mb-8">Das gesuchte Profil {profileNumber} existiert nicht oder ist nicht mehr öffentlich.</p>
          <Link href="/profile">
            <Button>Zurück zur Profilsuche</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <Link href="/profile" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Zurück zur Suche
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200 font-mono text-sm px-3 py-1">
                  {profile.profileNumber}
                </Badge>
                <Badge variant={profile.isAvailable ? "default" : "secondary"} className={profile.isAvailable ? "bg-green-600" : ""}>
                  {profile.isAvailable ? "Verfügbar" : "Nicht verfügbar"}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{profile.jobTitle}</h1>
              {profile.publicName && (
                <p className="text-xl text-gray-600">{profile.publicName}</p>
              )}
            </div>
            
            <div className="shrink-0">
              <Button size="lg" className="w-full md:w-auto" onClick={() => setIsContactModalOpen(true)}>
                Kontakt zu diesem Profil anfragen
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {profile.description && (
              <section className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Über mich
                </h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {profile.description}
                </div>
              </section>
            )}

            {profile.cvText && (
              <section className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  Beruflicher Werdegang & Qualifikationen
                </h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {profile.cvText}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {profile.skills && (
                <section className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold mb-4">Fähigkeiten & Kenntnisse</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.split(',').map((skill, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 text-sm bg-gray-100 font-medium">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {profile.languages && (
                <section className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold mb-4">Sprachen</h2>
                  <ul className="space-y-2">
                    {profile.languages.split(',').map((lang, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {lang.trim()}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-6">Profil Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Branche</p>
                    <p className="font-medium">{profile.industry}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Standort</p>
                    <p className="font-medium">{profile.federalState}{profile.city ? `, ${profile.city}` : ''}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Verfügbarkeit</p>
                    <p className="font-medium">{profile.availability}</p>
                  </div>
                </div>

                {profile.experience && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Berufserfahrung</p>
                      <p className="font-medium">{profile.experience}</p>
                    </div>
                  </div>
                )}

                {profile.employmentType && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Gewünschtes Anstellungsverhältnis</p>
                      <p className="font-medium">{profile.employmentType}</p>
                    </div>
                  </div>
                )}

                {profile.desiredJob && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Wunschposition</p>
                      <p className="font-medium">{profile.desiredJob}</p>
                    </div>
                  </div>
                )}
                
                {profile.driverLicense !== undefined && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Führerschein</p>
                      <p className="font-medium">{profile.driverLicense ? 'Vorhanden' : 'Nicht vorhanden'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 text-center">
              <h3 className="font-bold text-primary mb-2">Interesse geweckt?</h3>
              <p className="text-sm text-gray-600 mb-4">Senden Sie eine Anfrage an diesen Bewerber. Der Bewerber entscheidet über die weitere Kontaktaufnahme.</p>
              <Button className="w-full" onClick={() => setIsContactModalOpen(true)}>Kontakt anfragen</Button>
            </div>
          </div>
        </div>
      </div>

      <ContactRequestModal 
        open={isContactModalOpen} 
        onOpenChange={setIsContactModalOpen} 
        profileNumber={profile.profileNumber} 
      />
    </MainLayout>
  );
}
