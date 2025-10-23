import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: {
    label: string;
    path: string;
  };
}

const ServiceCard = ({ title, description, icon: Icon, action }: ServiceCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
      {action && (
        <CardFooter>
          <Link to={action.path} className="w-full">
            <Button className="w-full">{action.label}</Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default ServiceCard;
