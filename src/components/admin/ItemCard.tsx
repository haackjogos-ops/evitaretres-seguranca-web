import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import * as Icons from "lucide-react";

interface ItemCardProps {
  emoji?: string;
  icon?: string;
  logoUrl?: string;
  title: string;
  subtitle?: string;
  description?: string;
  isActive?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleActive?: () => void;
  viewMode?: "grid" | "list";
}

export const ItemCard = ({
  emoji,
  icon,
  logoUrl,
  title,
  subtitle,
  description,
  isActive = true,
  isFirst = false,
  isLast = false,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleActive,
  viewMode = "list",
}: ItemCardProps) => {
  const IconComponent = icon ? (Icons as any)[icon] : null;
  
  if (viewMode === "grid") {
    return (
      <div className="flex flex-col items-center gap-3 p-6 border rounded-lg bg-card hover:shadow-md transition-shadow h-full">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={title}
            className="w-16 h-16 object-contain rounded-lg border-2 border-primary/20"
          />
        ) : emoji ? (
          <span className="text-5xl">{emoji}</span>
        ) : icon && IconComponent ? (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
        ) : null}
        
        <div className="flex-1 w-full text-center">
          <div className="flex flex-col items-center gap-2 mb-2">
            <h4 className="font-semibold text-lg">{title}</h4>
            {isActive !== undefined && (
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Ativo" : "Inativo"}
              </Badge>
            )}
          </div>
          
          {subtitle && (
            <p className="text-sm text-muted-foreground mb-1">{subtitle}</p>
          )}
          
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
        
        <div className="flex gap-1 flex-wrap justify-center">
          {onToggleActive && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggleActive}
              title={isActive ? "Desativar" : "Ativar"}
            >
              {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          )}
          
          {onMoveUp && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onMoveUp}
              disabled={isFirst}
              title="Mover para cima"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
          
          {onMoveDown && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onMoveDown}
              disabled={isLast}
              title="Mover para baixo"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            size="icon"
            variant="ghost"
            onClick={onEdit}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={onDelete}
            title="Excluir"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={title}
          className="flex-shrink-0 w-12 h-12 object-contain rounded-lg border-2 border-primary/20"
        />
      ) : emoji ? (
        <span className="text-3xl flex-shrink-0">{emoji}</span>
      ) : icon && IconComponent ? (
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
      ) : null}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-lg truncate">{title}</h4>
          {isActive !== undefined && (
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Ativo" : "Inativo"}
            </Badge>
          )}
        </div>
        
        {subtitle && (
          <p className="text-sm text-muted-foreground mb-1">{subtitle}</p>
        )}
        
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
      </div>
      
      <div className="flex gap-1 flex-shrink-0">
        {onToggleActive && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggleActive}
            title={isActive ? "Desativar" : "Ativar"}
          >
            {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        )}
        
        {onMoveUp && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Mover para cima"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        )}
        
        {onMoveDown && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onMoveDown}
            disabled={isLast}
            title="Mover para baixo"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          size="icon"
          variant="ghost"
          onClick={onEdit}
          title="Editar"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={onDelete}
          title="Excluir"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
