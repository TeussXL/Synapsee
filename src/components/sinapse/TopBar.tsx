import { Bell, Heart, MessageCircle, Search } from "lucide-react";
import { SinapseLogo } from "./SinapseLogo";

interface TopBarProps {
  title?: string;
  showLogo?: boolean;
  showSearch?: boolean;
  rightSlot?: React.ReactNode;
}

export const TopBar = ({ title, showLogo = true, showSearch = false, rightSlot }: TopBarProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-background/85 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4">
        {showLogo ? <SinapseLogo /> : <h1 className="font-display text-lg font-semibold">{title}</h1>}
        <div className="flex items-center gap-1">
          {rightSlot ?? (
            <>
              <button className="rounded-full p-2 transition-smooth hover:bg-secondary" aria-label="Notificações">
                <Heart className="h-5 w-5" />
              </button>
              <button className="rounded-full p-2 transition-smooth hover:bg-secondary" aria-label="Mensagens">
                <MessageCircle className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
      {showSearch && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
            <Search className="h-4 w-4 text-text-faint" />
            <input
              placeholder="Buscar pessoas, vagas, avisos..."
              className="w-full bg-transparent text-sm placeholder:text-text-faint focus:outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
};
