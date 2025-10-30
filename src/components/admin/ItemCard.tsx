import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";

interface ItemCardProps {
  emoji?: string;
  icon?: string;
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
}

export const ItemCard = ({
  emoji,
  icon,
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
}: ItemCardProps) => {
  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
      {emoji && <span className="text-3xl flex-shrink-0">{emoji}</span>}
      {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
      
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
