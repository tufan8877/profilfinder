import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetProfiles } from "@workspace/api-client-react";
import { ProfileCard } from "@/components/shared/ProfileCard";
import { INDUSTRIES, FEDERAL_STATES, AVAILABILITIES } from "@/lib/constants";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function ProfileList() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [industry, setIndustry] = useState(searchParams.get("industry") || "all");
  const [federalState, setFederalState] = useState(searchParams.get("federalState") || "all");
  const [availability, setAvailability] = useState(searchParams.get("availability") || "all");
  const [page, setPage] = useState(1);

  // Parse params for API call
  const apiParams = {
    page,
    limit: 12,
    ...(search && { search }),
    ...(industry !== "all" && { industry }),
    ...(federalState !== "all" && { federalState }),
    ...(availability !== "all" && { availability })
  };

  const { data, isLoading } = useGetProfiles(apiParams);

  // Update URL without reload
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (industry && industry !== "all") params.set("industry", industry);
    if (federalState && federalState !== "all") params.set("federalState", federalState);
    if (availability && availability !== "all") params.set("availability", availability);
    if (page > 1) params.set("page", page.toString());
    
    const newUrl = `${location}${params.toString() ? `?${params.toString()}` : ''}`;
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [search, industry, federalState, availability, page, location]);

  const handleReset = () => {
    setSearch("");
    setIndustry("all");
    setFederalState("all");
    setAvailability("all");
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <MainLayout>
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile durchsuchen</h1>
          <p className="text-gray-600">Finden Sie qualifizierte Fachkräfte aus ganz Österreich.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-bold">Filter</h2>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Beruf/Tätigkeit</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Suchbegriff..." 
                      className="pl-9"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Branche</Label>
                  <Select value={industry} onValueChange={(val) => { setIndustry(val); setPage(1); }}>
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

                <div className="space-y-2">
                  <Label>Bundesland</Label>
                  <Select value={federalState} onValueChange={(val) => { setFederalState(val); setPage(1); }}>
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

                <div className="space-y-2">
                  <Label>Verfügbarkeit</Label>
                  <Select value={availability} onValueChange={(val) => { setAvailability(val); setPage(1); }}>
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

                <Button variant="outline" className="w-full mt-4" onClick={handleReset}>
                  Filter zurücksetzen
                </Button>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p>Profile werden geladen...</p>
              </div>
            ) : data && data.profiles.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">
                    {data.total} {data.total === 1 ? 'Profil' : 'Profile'} gefunden
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {data.profiles.map(profile => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setPage(Math.max(1, page - 1))}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            isActive={page === i + 1}
                            onClick={() => setPage(i + 1)}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPage(Math.min(totalPages, page + 1))}
                          className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Keine Profile gefunden</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Wir konnten leider keine Profile finden, die Ihren Suchkriterien entsprechen. Bitte versuchen Sie es mit anderen Filtern.
                </p>
                <Button variant="outline" onClick={handleReset}>Filter zurücksetzen</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
