import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateCompanyRequest } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const schema = z.object({
  companyName: z.string().min(2, "Bitte geben Sie den Firmennamen ein"),
  contactPerson: z.string().min(2, "Bitte geben Sie einen Ansprechpartner ein"),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  phoneNumber: z.string().optional(),
  message: z.string().min(10, "Die Nachricht muss mindestens 10 Zeichen lang sein"),
  acceptedPrivacy: z.literal(true, {
    errorMap: () => ({ message: "Bitte akzeptieren Sie die Datenschutzbestimmungen" })
  }),
});

type FormValues = z.infer<typeof schema>;

interface ContactRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileNumber: string;
}

export function ContactRequestModal({ open, onOpenChange, profileNumber }: ContactRequestModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const acceptedPrivacy = watch("acceptedPrivacy");

  const createRequest = useCreateCompanyRequest();

  const onSubmit = (data: FormValues) => {
    createRequest.mutate(
      {
        data: {
          profileNumber,
          companyName: data.companyName,
          contactPerson: data.contactPerson,
          email: data.email,
          phoneNumber: data.phoneNumber || undefined,
          message: data.message,
        }
      },
      {
        onSuccess: () => {
          toast.success("Kontaktanfrage erfolgreich gesendet!");
          reset();
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Fehler beim Senden der Kontaktanfrage. Bitte versuchen Sie es später erneut.");
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Kontaktanfrage: Profil {profileNumber}</DialogTitle>
          <DialogDescription>
            Ihre Anfrage wird sicher an den Bewerber weitergeleitet. Der Bewerber entscheidet dann über eine direkte Kontaktaufnahme.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Firmenname *</Label>
            <Input id="companyName" {...register("companyName")} />
            {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Ansprechpartner *</Label>
            <Input id="contactPerson" {...register("contactPerson")} />
            {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Telefonnummer</Label>
              <Input id="phoneNumber" type="tel" {...register("phoneNumber")} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Nachricht an den Bewerber *</Label>
            <Textarea 
              id="message" 
              placeholder="Beschreiben Sie kurz die offene Position und warum Sie Kontakt aufnehmen möchten."
              className="min-h-[100px]"
              {...register("message")} 
            />
            {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="acceptedPrivacy" 
              checked={acceptedPrivacy}
              onCheckedChange={(checked) => setValue("acceptedPrivacy", checked === true)}
            />
            <Label htmlFor="acceptedPrivacy" className="text-sm font-normal text-gray-600 leading-tight">
              Ich bestätige, dass ich die Datenschutzbestimmungen gelesen habe und zustimme, dass meine Daten zur Kontaktaufnahme gespeichert werden. *
            </Label>
          </div>
          {errors.acceptedPrivacy && <p className="text-sm text-red-500">{errors.acceptedPrivacy.message}</p>}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={createRequest.isPending}>
              {createRequest.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Anfrage senden
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
