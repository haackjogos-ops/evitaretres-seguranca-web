import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import * as Icons from "lucide-react";

const iconList = [
  "Shield", "Heart", "Activity", "Clipboard", "Users", "Award", "Target", "TrendingUp",
  "BookOpen", "GraduationCap", "Brain", "Lightbulb", "Rocket", "Star", "Zap", "Crown",
  "CheckCircle2", "ThumbsUp", "Sparkles", "Trophy", "Medal", "Flag", "MapPin", "Map",
  "Briefcase", "Building", "Building2", "Factory", "Warehouse", "Store", "ShoppingBag",
  "FileText", "FilePlus", "FileCheck", "ClipboardCheck", "ClipboardList", "ListChecks",
  "Settings", "Tool", "Wrench", "Hammer", "Cog", "Cpu", "HardDrive", "Server",
  "Stethoscope", "Syringe", "Pill", "Thermometer", "HeartPulse", "Microscope", "TestTube",
  "Eye", "Search", "SearchCheck", "Scan", "ScanEye", "Focus", "Crosshair", "Camera",
  "BarChart", "BarChart2", "BarChart3", "LineChart", "PieChart", "TrendingDown",
  "Calendar", "Clock", "Timer", "AlarmClock", "Hourglass", "Watch",
  "Phone", "Mail", "MessageSquare", "MessageCircle", "Send", "Inbox",
  "Lock", "Unlock", "Key", "ShieldCheck", "ShieldAlert", "AlertTriangle",
  "CheckCircle", "XCircle", "AlertCircle", "Info", "HelpCircle", "Plus",
  "Minus", "X", "Check", "ChevronRight", "ChevronLeft", "ArrowRight",
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [search, setSearch] = useState("");
  
  const filteredIcons = iconList.filter(icon => 
    icon.toLowerCase().includes(search.toLowerCase())
  );
  
  const IconComponent = (Icons as any)[value] || Icons.Star;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 border-2 border-primary/20 transition-all"
        >
          <IconComponent className="h-10 w-10 text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-4">
          <Input
            placeholder="Buscar ícone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <ScrollArea className="h-96">
            <div className="grid grid-cols-6 gap-2 p-2">
              {filteredIcons.map((iconName) => {
                const Icon = (Icons as any)[iconName];
                return (
                  <Button
                    key={iconName}
                    variant={value === iconName ? "default" : "ghost"}
                    className="h-12 w-12 p-0"
                    onClick={() => onChange(iconName)}
                    title={iconName}
                  >
                    <Icon className="h-6 w-6" />
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};
