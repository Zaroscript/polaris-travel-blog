import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Experience {
  company: string;
  role: string;
  duration: string;
  logo: string;
  isPresent?: boolean;
}

interface ProfileInfoProps {
  about: string;
  status: string;
  birthDate: string;
  location: string;
  email: string;
  experience: Experience[];
  skills: string[];
}

const ProfileInfo = ({
  about,
  status,
  birthDate,
  location,
  email,
  experience,
  skills,
}: ProfileInfoProps) => {
  return (
    <div className="grid gap-6">
      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{about}</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Status: {status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Born: {birthDate}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Location: {location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Email: {email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Experience</CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={exp.logo}
                    alt={exp.company}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{exp.company}</h4>
                  <p className="text-sm text-muted-foreground">{exp.role}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {exp.duration}
                    </span>
                    {exp.isPresent && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Present
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Skills</CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={cn(
                  "px-3 py-1",
                  index < 3 && "bg-primary/10 text-primary"
                )}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;
