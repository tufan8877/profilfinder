import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetUser, useGetMyProfile, useUpdateProfile } from "@workspace/api-client-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { INDUSTRIES, FEDERAL_STATES, AVAILABILITIES, EMPLOYMENT_TYPES } from "@/lib/constants";
import { Loader2, Lock, Eye, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const schema = z.object({
  jobTitle: z.string().min(2, "Bitte geben Sie Ihre aktuelle oder angestrebte Position an"),
  publicName: z.string().optional(),
  profession: z.string().optional(),
  industry: z.string().min(1, "Bitte wählen Sie eine Branche"),
  experience: z.string().optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  languages: z.string().optional(),
  desiredJob: z.string().optional(),
  federalState: z.string().min(1, "Bitte wählen Sie ein Bundesland"),
  city: z.string().optional(),
  availability: z.string().min(1, "Bitte wählen Sie Ihre Verfügbarkeit"),
  employmentType: z.string().optional(),
  driverLicense: z.boolean().default(false),
  description: z.string().min(10, "Bitte beschreiben Sie sich kurz (min. 10 Zeichen)"),
  cvText: z.string().optional(),
  isAvailable: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  // Private fields (Update allows partial, but we handle it together if possible. The API for update may allow them)
  firstName: z.string().min(2, "Vorname ist erforderlich"),
  lastName: z.string().min(2, "Nachname ist erforderlich"),
  phoneNumber: z.string().min(5, "Telefonnummer ist erforderlich"),
  contactEmail: z.string().email("Gültige E-Mail erforderlich"),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditProfile() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: userLoading } = useGetUser();
  const { data: profile, isLoading: profileLoading } = useGetMyProfile({
    query: { enabled: !!user }
  });
  
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    if (!userLoading && !user) {
      setLocation("/login");
    }
  }, [user, userLoading, setLocation]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        jobTitle: profile.jobTitle || "",
        publicName: profile.publicName || "",
        profession: profile.profession || "",
        industry: profile.industry || "",
        experience: profile.experience || "",
        education: profile.education || "",
        skills: profile.skills || "",
        languages: profile.languages || "",
        desiredJob: profile.desiredJob || "",
        federalState: profile.federalState || "",
        city: profile.city || "",
        availability: profile.availability || "",
        employmentType: profile.employmentType || "",
        driverLicense: profile.driverLicense || false,
        description: profile.description || "",
        cvText: profile.cvText || "",
        isAvailable: profile.isAvailable || false,
        isPublic: profile.isPublic || false,
        // Actually, we don't receive private fields from GetMyProfile in standard flow, 
        // but if we do, map them here. Assuming standard defaults if empty.
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: FormValues) => {
    if (!profile) return;
    
    updateProfile.mutate(
      { id: profile.id, data }, 
      {
        onSuccess: () => {
          toast.success("Profil erfolgreich aktualisiert!");
          setLocation("/my-profile");
        },
        onError: () => {
          toast.error("Fehler beim Aktualisieren des Profils.");
        }
      }
    );
  };

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
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Kein Profil gefunden</h1>
          <Button onClick={() => setLocation("/create-profile")}>Jetzt Profil erstellen</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4 max-w-4xl flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/my-profile")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil bearbeiten</h1>
            <p className="text-gray-600 text-sm">Aktualisieren Sie Ihre Daten für potenzielle Arbeitgeber.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Öffentliche Profildaten</h2>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="jobTitle">Aktuelle/Angestrebte Position *</Label>
                  <Input id="jobTitle" {...register("jobTitle")} />
                  {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="publicName">Öffentlicher Name (optional)</Label>
                  <Input id="publicName" {...register("publicName")} />
                </div>
                
                <div className="space-y-2">
                  <Label>Branche *</Label>
                  <Controller
                    control={control}
                    name="industry"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Branche wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map(ind => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.industry && <p className="text-sm text-red-500">{errors.industry.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label>Bundesland *</Label>
                  <Controller
                    control={control}
                    name="federalState"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Bundesland wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {FEDERAL_STATES.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.federalState && <p className="text-sm text-red-500">{errors.federalState.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ort / Bezirk (optional)</Label>
                  <Input id="city" {...register("city")} />
                </div>

                <div className="space-y-2">
                  <Label>Verfügbarkeit *</Label>
                  <Controller
                    control={control}
                    name="availability"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Verfügbarkeit wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABILITIES.map(avail => (
                            <SelectItem key={avail} value={avail}>{avail}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.availability && <p className="text-sm text-red-500">{errors.availability.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Berufserfahrung</Label>
                  <Input id="experience" {...register("experience")} />
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <Label htmlFor="description">Über mich (Profilbeschreibung) *</Label>
                  <Textarea 
                    id="description" 
                    className="min-h-[120px]"
                    {...register("description")} 
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvText">Werdegang & Ausbildung</Label>
                  <Textarea 
                    id="cvText" 
                    className="min-h-[150px]"
                    {...register("cvText")} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Fähigkeiten & Kenntnisse (kommagetrennt)</Label>
                  <Input id="skills" {...register("skills")} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setLocation("/my-profile")}>Abbrechen</Button>
            <Button type="submit" size="lg" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Änderungen speichern
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
