import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicProfile } from "@workspace/api-client-react";
import { Link } from "wouter";
import { MapPin, Briefcase, Clock, Building2 } from "lucide-react";
import { ContactRequestModal } from "./ContactRequestModal";
import { useState } from "react";

interface ProfileCardProps {
  profile: PublicProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200 font-mono text-xs">
              {profile.profileNumber}
            </Badge>
            <Badge variant={profile.isAvailable ? "default" : "secondary"} className={profile.isAvailable ? "bg-green-600 hover:bg-green-700" : ""}>
              {profile.isAvailable ? "Verfügbar" : "Nicht verfügbar"}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2" title={profile.jobTitle}>
            {profile.jobTitle}
          </h3>
          {profile.publicName && (
            <p className="text-sm text-gray-500 font-medium">{profile.publicName}</p>
          )}
        </CardHeader>
        
        <CardContent className="flex-grow space-y-3">
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate" title={profile.industry}>{profile.industry}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{profile.federalState}{profile.city ? `, ${profile.city}` : ''}</span>
            </div>
            {profile.experience && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate">{profile.experience} Erfahrung</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{profile.availability}</span>
            </div>
          </div>
          
          {profile.skills && (
            <div className="pt-2">
              <div className="flex flex-wrap gap-1">
                {profile.skills.split(',').slice(0, 3).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-gray-100 font-normal">
                    {skill.trim()}
                  </Badge>
                ))}
                {profile.skills.split(',').length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 font-normal">
                    +{profile.skills.split(',').length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-4 border-t border-gray-100 flex gap-2">
          <Link href={`/profile/${profile.profileNumber}`} className="flex-1">
            <Button variant="outline" className="w-full">Profil ansehen</Button>
          </Link>
          <Button className="flex-1" onClick={() => setIsContactModalOpen(true)}>
            Kontakt anfragen
          </Button>
        </CardFooter>
      </Card>

      <ContactRequestModal 
        open={isContactModalOpen} 
        onOpenChange={setIsContactModalOpen} 
        profileNumber={profile.profileNumber} 
      />
    </>
  );
}
