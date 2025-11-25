import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => {
  return (
    <div className="flex gap-1 border rounded-lg p-1 bg-muted/50">
      <Button
        size="sm"
        variant={viewMode === "grid" ? "default" : "ghost"}
        onClick={() => onViewModeChange("grid")}
        title="Visualização em grade"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={viewMode === "list" ? "default" : "ghost"}
        onClick={() => onViewModeChange("list")}
        title="Visualização em lista"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
