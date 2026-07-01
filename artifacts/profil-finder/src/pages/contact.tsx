import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Kontakt</h1>
        <p className="text-gray-600 mb-8">Haben Sie Fragen oder Anregungen? Schreiben Sie uns eine Nachricht.</p>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="Ihr Name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-Mail</label>
              <Input type="email" placeholder="Ihre E-Mail-Adresse" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Betreff</label>
            <Input placeholder="Worum geht es?" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nachricht</label>
            <Textarea placeholder="Ihre Nachricht an uns..." rows={6} />
          </div>
          <Button type="submit" className="w-full md:w-auto">Nachricht senden</Button>
        </form>
      </div>
    </MainLayout>
  );
}
