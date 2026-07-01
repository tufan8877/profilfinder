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
import { useCreateProfile, useGetUser } from "@workspace/api-client-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { INDUSTRIES, FEDERAL_STATES, AVAILABILITIES, EMPLOYMENT_TYPES } from "@/lib/constants";
import { Loader2, Lock, Eye } from "lucide-react";
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
  // Private fields
  firstName: z.string().min(2, "Vorname ist erforderlich"),
  lastName: z.string().min(2, "Nachname ist erforderlich"),
  phoneNumber: z.string().min(5, "Telefonnummer ist erforderlich"),
  contactEmail: z.string().email("Gültige E-Mail erforderlich"),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CreateProfile() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: userLoading } = useGetUser();
  const createProfile = useCreateProfile();

  useEffect(() => {
    if (!userLoading && !user) {
      setLocation("/login");
      toast.error("Bitte melden Sie sich an, um ein Profil zu erstellen.");
    }
  }, [user, userLoading, setLocation]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      isAvailable: true,
      isPublic: true,
      driverLicense: false,
      contactEmail: user?.email || "",
    }
  });

  const onSubmit = (data: FormValues) => {
    createProfile.mutate({ data }, {
      onSuccess: () => {
        toast.success("Profil erfolgreich erstellt!");
        setLocation("/my-profile");
      },
      onError: () => {
        toast.error("Fehler beim Erstellen des Profils.");
      }
    });
  };

  if (userLoading || !user) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bewerberprofil erstellen</h1>
          <p className="text-gray-600">Präsentieren Sie Ihre Fähigkeiten anonym potenziellen Arbeitgebern.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Private Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-500" />
              <h2 className="font-bold text-lg">Private Kontaktdaten</h2>
              <span className="text-sm text-gray-500 ml-auto hidden sm:inline">(Werden niemals veröffentlicht)</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname *</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname *</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Kontakt E-Mail *</Label>
                <Input id="contactEmail" type="email" {...register("contactEmail")} />
                {errors.contactEmail && <p className="text-sm text-red-500">{errors.contactEmail.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Telefonnummer *</Label>
                <Input id="phoneNumber" type="tel" {...register("phoneNumber")} />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse (Straße, PLZ, Ort)</Label>
                <Input id="address" {...register("address")} />
              </div>
            </div>
          </div>

          {/* Public Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Öffentliches Profil</h2>
              <span className="text-sm text-gray-500 ml-auto hidden sm:inline">(Für Unternehmen sichtbar)</span>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="jobTitle">Aktuelle/Angestrebte Position *</Label>
                  <Input id="jobTitle" placeholder="z.B. Erfahrener Buchhalter" {...register("jobTitle")} />
                  {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="publicName">Öffentlicher Name (optional)</Label>
                  <Input id="publicName" placeholder="z.B. Max M. oder Vorname" {...register("publicName")} />
                  <p className="text-xs text-gray-500">Wenn leer, wird nur Ihre Profilnummer angezeigt.</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Branche *</Label>
                  <Controller
                    control={control}
                    name="industry"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Input id="city" placeholder="z.B. Wien 1020 oder Linz" {...register("city")} />
                </div>

                <div className="space-y-2">
                  <Label>Verfügbarkeit *</Label>
                  <Controller
                    control={control}
                    name="availability"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Label>Gewünschtes Anstellungsverhältnis</Label>
                  <Controller
                    control={control}
                    name="employmentType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {EMPLOYMENT_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Berufserfahrung (in Jahren)</Label>
                  <Input id="experience" placeholder="z.B. 5 Jahre oder Junior/Senior" {...register("experience")} />
                </div>

                <div className="space-y-2 flex items-center h-full pt-6">
                  <Controller
                    control={control}
                    name="driverLicense"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="driverLicense" 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                        <Label htmlFor="driverLicense" className="font-normal cursor-pointer">
                          Führerschein B vorhanden
                        </Label>
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <Label htmlFor="description">Über mich (Profilbeschreibung) *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Beschreiben Sie sich kurz: Was sind Ihre Stärken? Was zeichnet Sie aus?"
                    className="min-h-[120px]"
                    {...register("description")} 
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvText">Werdegang & Ausbildung</Label>
                  <Textarea 
                    id="cvText" 
                    placeholder="Listen Sie Ihre wichtigsten Stationen auf (Arbeitgeber, Position, Dauer)..."
                    className="min-h-[150px]"
                    {...register("cvText")} 
                  />
                  <p className="text-xs text-gray-500">Achten Sie darauf, hier keine echten Firmennamen zu nennen, wenn Sie völlig anonym bleiben wollen (z.B. "Großes IT-Unternehmen" statt Firmenname).</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Fähigkeiten & Kenntnisse (kommagetrennt)</Label>
                  <Input id="skills" placeholder="z.B. Excel, BMD, SAP, Teamführung" {...register("skills")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">Sprachen (kommagetrennt)</Label>
                  <Input id="languages" placeholder="z.B. Deutsch (Muttersprache), Englisch (B2)" {...register("languages")} />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <Controller
                  control={control}
                  name="isPublic"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isPublic" 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                      <div>
                        <Label htmlFor="isPublic" className="font-medium cursor-pointer">Profil veröffentlichen</Label>
                        <p className="text-xs text-gray-500 mt-1">Wenn deaktiviert, kann Ihr Profil von Unternehmen nicht gefunden werden.</p>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setLocation("/")}>Abbrechen</Button>
            <Button type="submit" size="lg" disabled={createProfile.isPending}>
              {createProfile.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Profil erstellen
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
