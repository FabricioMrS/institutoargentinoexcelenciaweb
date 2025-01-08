import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  title: string;
  category: string;
  image: string;
  price: string;
}

export const CourseCard = ({ title, category, image, price }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden transition-transform hover:scale-105">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary">{category}</Badge>
          <span className="font-bold text-lg">{price}</span>
        </div>
        <CardTitle className="text-lg mt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full">
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  );
};