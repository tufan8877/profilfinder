import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  useGetUser, 
  useGetAdminStats, 
  useGetAdminProfiles, 
  useGetAdminCompanyRequests, 
  useGetAdminUsers,
  useUpdateCompanyRequestStatus,
  useUpdateUserStatus
} from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, Users, FileText, MessageSquare, Activity, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useGetUser();
  
  const [profileSearch, setProfileSearch] = useState("");
  const [debouncedProfileSearch, setDebouncedProfileSearch] = useState("");

  useEffect(() => {
    if (!userLoading && (!user || !user.isAdmin)) {
      setLocation("/");
      toast.error("Keine Berechtigung");
    }
  }, [user, userLoading, setLocation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProfileSearch(profileSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [profileSearch]);

  const { data: stats } = useGetAdminStats({ query: { enabled: !!user?.isAdmin } });
  const { data: profiles } = useGetAdminProfiles(
    { search: debouncedProfileSearch, limit: 50 }, 
    { query: { enabled: !!user?.isAdmin } }
  );
  const { data: requests } = useGetAdminCompanyRequests({ query: { enabled: !!user?.isAdmin } });
  const { data: users } = useGetAdminUsers({ query: { enabled: !!user?.isAdmin } });

  const updateRequestStatus = useUpdateCompanyRequestStatus();
  const updateUserStatus = useUpdateUserStatus();

  const handleRequestStatusUpdate = (id: number, status: string) => {
    updateRequestStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toast.success(`Status auf ${status} aktualisiert`);
          queryClient.invalidateQueries({ queryKey: ["getAdminCompanyRequests"] });
          queryClient.invalidateQueries({ queryKey: ["getAdminStats"] });
        }
      }
    );
  };

  const handleUserStatusUpdate = (id: number, status: string) => {
    updateUserStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toast.success(`Benutzerstatus aktualisiert`);
          queryClient.invalidateQueries({ queryKey: ["getAdminUsers"] });
        }
      }
    );
  };

  if (userLoading || !user?.isAdmin) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">Verwaltung von Profilen, Anfragen und Benutzern</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-8">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="profiles">Profile</TabsTrigger>
            <TabsTrigger value="requests">Anfragen</TabsTrigger>
            <TabsTrigger value="users">Benutzer</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Gesamtprofile</CardTitle>
                  <FileText className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalProfiles || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">{stats?.activeProfiles || 0} aktiv</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Kontaktanfragen</CardTitle>
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalRequests || 0}</div>
                  <p className="text-xs text-red-500 mt-1 font-medium">{stats?.newRequests || 0} neu zu bearbeiten</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Benutzer</CardTitle>
                  <Users className="w-4 h-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Suche nach Name, Profilnummer..." 
                  className="pl-9"
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="px-4 py-3">Nr.</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Position</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles?.profiles.map(profile => (
                      <tr key={profile.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{profile.profileNumber}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{profile.firstName} {profile.lastName}</div>
                          <div className="text-gray-500 text-xs">{profile.contactEmail}</div>
                        </td>
                        <td className="px-4 py-3">{profile.jobTitle}</td>
                        <td className="px-4 py-3">
                          <Badge variant={profile.isPublic ? "default" : "secondary"}>
                            {profile.isPublic ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/profile/${profile.profileNumber}`}>
                            <Button variant="ghost" size="sm">Ansehen</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {profiles?.profiles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Keine Profile gefunden</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="bg-white border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="px-4 py-3">Datum</th>
                      <th className="px-4 py-3">Profil</th>
                      <th className="px-4 py-3">Unternehmen</th>
                      <th className="px-4 py-3">Nachricht</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests?.map(request => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {format(new Date(request.createdAt), 'dd.MM.yyyy HH:mm')}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          <Link href={`/profile/${request.profileNumber}`} className="text-primary hover:underline">
                            {request.profileNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{request.companyName}</div>
                          <div className="text-gray-500 text-xs">{request.contactPerson}</div>
                          <div className="text-gray-500 text-xs">{request.email}</div>
                        </td>
                        <td className="px-4 py-3 max-w-xs truncate" title={request.message}>
                          {request.message}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={
                            request.status === 'neu' ? 'destructive' : 
                            request.status === 'bearbeitet' ? 'default' : 'secondary'
                          }>
                            {request.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {request.status !== 'bearbeitet' && (
                              <Button size="sm" variant="outline" onClick={() => handleRequestStatusUpdate(request.id, 'bearbeitet')}>
                                In Bearbeitung
                              </Button>
                            )}
                            {request.status !== 'erledigt' && (
                              <Button size="sm" variant="outline" onClick={() => handleRequestStatusUpdate(request.id, 'erledigt')}>
                                Erledigt
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {requests?.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Keine Kontaktanfragen vorhanden</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="bg-white border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Rolle</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map(u => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{u.id}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">
                          {u.isAdmin ? <Badge variant="default" className="bg-red-500">Admin</Badge> : <Badge variant="secondary">User</Badge>}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={u.status === 'active' ? 'default' : 'destructive'} className={u.status === 'active' ? 'bg-green-500' : ''}>
                            {u.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {!u.isAdmin && (
                            <Button 
                              size="sm" 
                              variant={u.status === 'active' ? "destructive" : "default"}
                              onClick={() => handleUserStatusUpdate(u.id, u.status === 'active' ? 'suspended' : 'active')}
                            >
                              {u.status === 'active' ? 'Sperren' : 'Aktivieren'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
