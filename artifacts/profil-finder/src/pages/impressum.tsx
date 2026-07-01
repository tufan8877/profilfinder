import { MainLayout } from "@/components/layout/MainLayout";
export default function Imprint() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Impressum</h1>
        <div className="prose max-w-none">
          <p>Informationspflicht laut §5 E-Commerce Gesetz, §14 Unternehmensgesetzbuch, §63 Gewerbeordnung und Offenlegungspflicht laut §25 Mediengesetz.</p>
          <h2>ProfilFinder.at GmbH</h2>
          <p>Musterstraße 1<br/>1010 Wien<br/>Österreich</p>
          <p><strong>Unternehmensgegenstand:</strong> IT Dienstleistungen<br/><strong>UID-Nummer:</strong> ATU12345678<br/><strong>Firmenbuchnummer:</strong> FN 123456x<br/><strong>Firmenbuchgericht:</strong> Handelsgericht Wien</p>
          <p><strong>Tel.:</strong> +43 1 234 5678<br/><strong>E-Mail:</strong> office@profilfinder.at</p>
        </div>
      </div>
    </MainLayout>
  );
}
