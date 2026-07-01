import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetFeaturedProfiles, useGetIndustryStats } from "@workspace/api-client-react";
import { ProfileCard } from "@/components/shared/ProfileCard";
import { INDUSTRIES, FEDERAL_STATES, AVAILABILITIES } from "@/lib/constants";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Search, MapPin, Briefcase, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedProfiles();
  const { data: industryStats, isLoading: industriesLoading } = useGetIndustryStats();

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [federalState, setFederalState] = useState("");
  const [availability, setAvailability] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (industry && industry !== "all") params.append("industry", industry);
    if (federalState && federalState !== "all") params.append("federalState", federalState);
    if (availability && availability !== "all") params.append("availability", availability);
    
    setLocation(`/profile?${params.toString()}`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        <section className="bg-primary text-white py-24 px-4 border-b border-primary/20">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Bewerberprofile finden. Kontakte sicher anfragen.</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Die vertrauenswürdige österreichische Plattform für anonyme Bewerbungen. Schützen Sie Ihre Privatsphäre oder finden Sie qualifizierte Mitarbeiter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profile">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 text-base font-semibold">
                  Profile ansehen
                </Button>
              </Link>
              <Link href="/for-companies">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto text-white hover:bg-white/10 text-base font-semibold">
                  Für Unternehmen
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-8 -mt-16 relative z-10 px-4">
          <div className="container mx-auto max-w-5xl">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Beruf/Tätigkeit</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="z.B. Buchhalter" 
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Branche</label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Alle Branchen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Branchen</SelectItem>
                        {INDUSTRIES.map(ind => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Bundesland</label>
                    <Select value={federalState} onValueChange={setFederalState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ganz Österreich" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Ganz Österreich</SelectItem>
                        {FEDERAL_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Verfügbarkeit</label>
                    <Select value={availability} onValueChange={setAvailability}>
                      <SelectTrigger>
                        <SelectValue placeholder="Egal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Egal</SelectItem>
                        {AVAILABILITIES.map(avail => (
                          <SelectItem key={avail} value={avail}>{avail}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <Button type="submit" className="w-full">Profile suchen</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Aktuelle Bewerberprofile</h2>
                <p className="text-gray-600 mt-2">Frisch eingetroffene Profile von verifizierten Fachkräften.</p>
              </div>
              <Link href="/profile" className="hidden md:flex items-center text-primary font-medium hover:underline">
                Alle Profile ansehen <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="h-64 animate-pulse bg-gray-100 border-0" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(featuredData) ? featuredData : []).map(profile => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center md:hidden">
              <Link href="/profile">
                <Button variant="outline" className="w-full">Alle Profile ansehen</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Beliebte Branchen</h2>
            {industriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {industryStats?.map((stat, i) => (
                  <Link key={i} href={`/profile?industry=${encodeURIComponent(stat.industry)}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 hover:border-primary/50">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{stat.industry}</h3>
                          <p className="text-sm text-gray-500">{stat.count} Profile</p>
                        </div>
                        <Briefcase className="w-5 h-5 text-gray-400" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-white px-4 border-t border-gray-100">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Vorteile für Bewerber</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">100% Anonymität</h4>
                      <p className="text-gray-600 text-sm">Ihr aktueller Arbeitgeber erfährt nicht, dass Sie auf der Suche sind.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Kein Anschreiben nötig</h4>
                      <p className="text-gray-600 text-sm">Einmal Profil ausfüllen, von Unternehmen gefunden werden.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Volle Kontrolle</h4>
                      <p className="text-gray-600 text-sm">Sie entscheiden, wem Sie nach einer Kontaktanfrage antworten.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Vorteile für Unternehmen</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Passive Kandidaten</h4>
                      <p className="text-gray-600 text-sm">Erreichen Sie Fachkräfte, die nicht aktiv suchen, aber offen für Angebote sind.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Hohe Qualität</h4>
                      <p className="text-gray-600 text-sm">Strukturierte Profile mit Fokus auf harte Fakten statt leerer Phrasen.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Schnelle Prozesse</h4>
                      <p className="text-gray-600 text-sm">Direkte Kontaktanfragen ohne lange Inserat-Laufzeiten.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50 px-4 border-t border-gray-200">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Sind Sie ein Unternehmen auf Mitarbeitersuche?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Finden Sie jetzt das passende Personal für Ihr Team. Durchsuchen Sie unsere Datenbank und kontaktieren Sie interessante Kandidaten direkt.
            </p>
            <Link href="/for-companies">
              <Button size="lg" className="px-8">
                Mehr Informationen für Unternehmen
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
