
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  photo_url?: string | null;
}

export const TestimonialCard = ({ name, role, content, photo_url }: TestimonialCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={photo_url || undefined} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="italic">{content}</p>
      </CardContent>
    </Card>
  );
};
