import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const emojiCategories = {
  "Pessoas": ["😀", "😃", "😄", "😁", "😊", "🙂", "😉", "😍", "🥰", "😘", "👋", "👍", "👏", "🙌", "👨", "👩", "👨‍💼", "👩‍💼", "👨‍🏫", "👩‍🏫"],
  "Objetos": ["📱", "💻", "⌨️", "🖥️", "🖨️", "📷", "📹", "📞", "☎️", "📠", "📺", "📻", "🎙️", "📡", "🔋", "🔌", "💡", "🔦", "📚", "📖"],
  "Trabalho": ["📊", "📈", "📉", "💼", "📋", "📌", "📍", "✏️", "✒️", "🖊️", "🖋️", "📝", "📄", "📃", "📑", "📁", "📂", "🗂️", "📇", "📅"],
  "Saúde": ["💊", "💉", "🩺", "🩹", "🌡️", "🧬", "🔬", "🧪", "🧫", "🏥", "⚕️", "❤️", "🫀", "🧠", "🦷", "🦴", "👁️", "👃", "👂", "🫁"],
  "Símbolos": ["✅", "❌", "⭐", "🌟", "💫", "✨", "🔥", "💥", "💯", "🎯", "🎓", "🏆", "🥇", "🥈", "🥉", "🔔", "🔕", "📣", "📢", "💬"],
  "Natureza": ["🌍", "🌎", "🌏", "🌐", "🗺️", "🌳", "🌲", "🌱", "🌿", "☘️", "🍀", "🌾", "🌵", "🌴", "🌊", "🔥", "❄️", "☀️", "🌤️", "⛅"],
};

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export const EmojiPicker = ({ value, onChange }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-20 h-20 text-4xl">
          {value || "😀"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="h-96">
          {Object.entries(emojiCategories).map(([category, emojis]) => (
            <div key={category} className="mb-4">
              <h4 className="text-sm font-semibold mb-2">{category}</h4>
              <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    className="h-10 w-10 p-0 text-2xl hover:bg-accent"
                    onClick={() => onChange(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
