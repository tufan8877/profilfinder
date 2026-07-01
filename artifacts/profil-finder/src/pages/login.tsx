import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

const schema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  password: z.string().min(1, "Bitte geben Sie ein Passwort ein"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const login = useLogin();
  
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    login.mutate({ data }, {
      onSuccess: () => {
        toast.success("Erfolgreich angemeldet");
        setLocation("/my-profile");
      },
      onError: () => {
        toast.error("Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.");
      }
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Anmelden</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={login.isPending}>
                Anmelden
              </Button>
              <div className="text-center text-sm mt-4">
                Noch kein Konto? <Link href="/register" className="text-primary hover:underline">Hier registrieren</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
