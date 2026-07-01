import { MainLayout } from "@/components/layout/MainLayout";
import { useGetAdminProfile, useUpdateAdminProfile, useGetUser } from "@workspace/api-client-react";
import { useParams, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Briefcase, Clock, Building2, ChevronLeft, User as UserIcon, Mail, Phone, Home as HomeIcon, Edit3 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function AdminProfileDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0", 10);
  const [, setLocation] = useLocation();
  
  const { data: user, isLoading: userLoading } = useGetUser();

  useEffect(() => {
    if (!userLoading && (!user || !user.isAdmin)) {
      setLocation("/");
      toast.error("Keine Berechtigung");
    }
  }, [user, userLoading, setLocation]);

  const { data: profile, isLoading } = useGetAdminProfile(id, {
    query: {
      enabled: !!user?.isAdmin && id > 0,
      queryKey: ["getAdminProfile", id]
    }
  });

  const updateProfile = useUpdateAdminProfile();
  const [adminNotes, setAdminNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    if (profile && !isEditingNotes) {
      setAdminNotes(profile.adminNotes || "");
    }
  }, [profile, isEditingNotes]);

  const handleSaveNotes = () => {
    updateProfile.mutate(
      { id, data: { adminNotes } },
      {
        onSuccess: () => {
          toast.success("Admin-Notizen gespeichert");
          setIsEditingNotes(false);
        }
      }
    );
  };

  if (userLoading || isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Profil nicht gefunden</h1>
          <p className="text-gray-600 mb-8">Das angeforderte Profil existiert nicht.</p>
          <Link href="/admin">
            <Button>Zurück zum Admin-Dashboard</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-900 text-white border-b border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Zurück zum Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-800 font-mono text-sm px-3 py-1">
                  {profile.profileNumber}
                </Badge>
                <Badge variant={profile.isAvailable ? "default" : "secondary"} className={profile.isAvailable ? "bg-green-600" : ""}>
                  {profile.isAvailable ? "Verfügbar" : "Nicht verfügbar"}
                </Badge>
                <Badge variant={profile.isPublic ? "default" : "secondary"} className={profile.isPublic ? "bg-blue-600" : "bg-gray-600"}>
                  {profile.isPublic ? "Öffentlich" : "Versteckt"}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{profile.firstName} {profile.lastName}</h1>
              <p className="text-xl text-gray-300">{profile.jobTitle}</p>
            </div>
            
            <div className="shrink-0 flex gap-2">
              <Button 
                variant="outline" 
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                onClick={() => {
                  updateProfile.mutate(
                    { id, data: { isPublic: !profile.isPublic } },
                    {
                      onSuccess: () => {
                        toast.success(profile.isPublic ? "Profil versteckt" : "Profil veröffentlicht");
                      }
                    }
                  );
                }}
              >
                {profile.isPublic ? "Verstecken" : "Veröffentlichen"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2">
                <UserIcon className="w-5 h-5 text-gray-400" />
                Private Kontaktdaten
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Voller Name</p>
                  <p className="font-medium text-lg">{profile.firstName} {profile.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Öffentlicher Name</p>
                  <p className="font-medium">{profile.publicName || "(Nicht angegeben)"}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">E-Mail</p>
                    <a href={`mailto:${profile.contactEmail}`} className="font-medium text-primary hover:underline">{profile.contactEmail}</a>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Telefon</p>
                    <a href={`tel:${profile.phoneNumber}`} className="font-medium text-primary hover:underline">{profile.phoneNumber || "(Nicht angegeben)"}</a>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:col-span-2">
                  <HomeIcon className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Adresse</p>
                    <p className="font-medium">{profile.address || "(Nicht angegeben)"}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4 flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-gray-400" />
                  Admin Notizen
                </div>
                {!isEditingNotes && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(true)}>Bearbeiten</Button>
                )}
              </h2>
              
              {isEditingNotes ? (
                <div className="space-y-4">
                  <Textarea 
                    value={adminNotes} 
                    onChange={(e) => setAdminNotes(e.target.value)} 
                    placeholder="Interne Notizen zu diesem Profil..."
                    className="min-h-[150px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setIsEditingNotes(false); setAdminNotes(profile.adminNotes || ""); }}>Abbrechen</Button>
                    <Button onClick={handleSaveNotes} disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Speichern
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md min-h-[100px]">
                  {profile.adminNotes || <span className="text-gray-400 italic">Keine Notizen vorhanden.</span>}
                </div>
              )}
            </section>

            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Über den Bewerber</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {profile.description}
              </div>
            </section>

            {profile.cvText && (
              <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Werdegang & Qualifikationen</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {profile.cvText}
                </div>
              </section>
            )}
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
                    <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Berufserfahrung</p>
                      <p className="font-medium">{profile.experience}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
