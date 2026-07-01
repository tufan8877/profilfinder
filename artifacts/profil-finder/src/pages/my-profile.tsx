import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUser, useGetMyProfile, useUpdateProfile, useDeleteProfile } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, Settings, FileEdit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function MyProfile() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: userLoading } = useGetUser();
  const { data: profile, isLoading: profileLoading } = useGetMyProfile({
    query: { enabled: !!user }
  });
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      setLocation("/login");
    }
  }, [user, userLoading, setLocation]);

  if (userLoading || profileLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Willkommen bei ProfilFinder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600">Sie haben noch kein Bewerberprofil erstellt. Legen Sie jetzt los, um von Unternehmen gefunden zu werden.</p>
              <Link href="/create-profile">
                <Button size="lg">Jetzt Profil erstellen</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const toggleAvailability = () => {
    updateProfile.mutate(
      { id: profile.id, data: { isAvailable: !profile.isAvailable } },
      {
        onSuccess: () => {
          toast.success(profile.isAvailable ? "Status auf 'Nicht verfügbar' geändert" : "Status auf 'Verfügbar' geändert");
        }
      }
    );
  };

  const toggleVisibility = () => {
    updateProfile.mutate(
      { id: profile.id, data: { isPublic: !profile.isPublic } },
      {
        onSuccess: () => {
          toast.success(profile.isPublic ? "Profil deaktiviert (unsichtbar)" : "Profil aktiviert (sichtbar)");
        }
      }
    );
  };

  const handleDelete = () => {
    deleteProfile.mutate(
      { id: profile.id },
      {
        onSuccess: () => {
          toast.success("Profil erfolgreich gelöscht");
          setIsDeleteDialogOpen(false);
          // Reload the page to reset the hook state
          window.location.reload();
        }
      }
    );
  };

  return (
    <MainLayout>
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mein Profil</h1>
            <p className="text-gray-600">Verwalten Sie Ihre Profildaten und Einstellungen.</p>
          </div>
          <Link href={`/profile/${profile.profileNumber}`}>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" /> Ansicht als Unternehmen
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Aktuelle Daten</CardTitle>
                <Link href="/edit-profile">
                  <Button variant="ghost" size="icon" title="Profil bearbeiten">
                    <FileEdit className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Profilnummer</span>
                    <span className="font-mono font-medium">{profile.profileNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Position</span>
                    <span className="font-medium">{profile.jobTitle}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Branche</span>
                    <span>{profile.industry}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Standort</span>
                    <span>{profile.federalState}{profile.city ? `, ${profile.city}` : ''}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-gray-500 block mb-2 text-sm">Über mich</span>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Sichtbarkeit</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${profile.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {profile.isPublic ? 'Sichtbar' : 'Versteckt'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Bestimmt, ob Unternehmen Ihr Profil in der Suche finden können.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={toggleVisibility}
                    disabled={updateProfile.isPending}
                  >
                    {profile.isPublic ? 'Profil verstecken' : 'Profil veröffentlichen'}
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Verfügbarkeit</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${profile.isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                      {profile.isAvailable ? 'Verfügbar' : 'Nicht verfügbar'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Zeigt an, ob Sie aktuell offen für Anfragen sind.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={toggleAvailability}
                    disabled={updateProfile.isPending}
                  >
                    {profile.isAvailable ? 'Auf nicht verfügbar setzen' : 'Auf verfügbar setzen'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-100 bg-red-50/30">
              <CardContent className="pt-6">
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full gap-2">
                      <Trash2 className="w-4 h-4" /> Profil löschen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Profil wirklich löschen?</DialogTitle>
                      <DialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten, inklusive Lebenslauf und Beschreibungen, werden dauerhaft gelöscht.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Abbrechen</Button>
                      <Button variant="destructive" onClick={handleDelete} disabled={deleteProfile.isPending}>
                        {deleteProfile.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Ja, endgültig löschen
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
