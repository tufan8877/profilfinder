import { MainLayout } from "@/components/layout/MainLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Häufig gestellte Fragen (FAQ)</h1>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Ist mein Profil wirklich anonym?</AccordionTrigger>
            <AccordionContent>
              Ja, Ihr Profil wird nur mit einer Profilnummer (z.B. PF-000001) angezeigt. Ihr Name, Ihre E-Mail-Adresse und Ihre Telefonnummer sind öffentlich nicht sichtbar.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Wie trete ich mit Unternehmen in Kontakt?</AccordionTrigger>
            <AccordionContent>
              Unternehmen senden eine Kontaktanfrage an Ihr Profil. Wir leiten diese Anfrage an Sie weiter. Sie entscheiden dann selbst, ob Sie dem Unternehmen antworten möchten.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Ist der Service kostenlos?</AccordionTrigger>
            <AccordionContent>
              Ja, die Erstellung eines Profils ist für Bewerber komplett kostenlos.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </MainLayout>
  );
}
