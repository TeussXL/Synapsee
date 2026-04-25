import { PenSquare, Search } from "lucide-react";
import { Avatar } from "../Avatar";
import { TopBar } from "../TopBar";
import { conversations } from "@/lib/mockData";

export const MensagensScreen = () => {
  return (
    <div className="flex flex-col">
      <TopBar
        showLogo={false}
        title="Mensagens"
        rightSlot={
          <button className="rounded-full p-2 transition-smooth hover:bg-secondary" aria-label="Nova conversa">
            <PenSquare className="h-5 w-5" />
          </button>
        }
      />

      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
          <Search className="h-4 w-4 text-text-faint" />
          <input
            placeholder="Buscar conversa"
            className="w-full bg-transparent text-sm placeholder:text-text-faint focus:outline-none"
          />
        </div>
      </div>

      {/* Online row */}
      <div className="flex gap-4 overflow-x-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {conversations.filter((c) => c.online).map((c) => (
          <div key={c.id} className="flex flex-col items-center gap-1.5">
            <div className="relative">
              <Avatar name={c.name} color={c.avatarColor} size="md" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-online" />
            </div>
            <span className="max-w-[60px] truncate text-[11px] text-text-subtle">{c.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>

      {/* Lista de conversas */}
      <ul className="divide-y divide-hairline">
        {conversations.map((c) => (
          <li key={c.id}>
            <button className="flex w-full items-center gap-3 px-4 py-3 transition-smooth hover:bg-secondary/60">
              <div className="relative">
                <Avatar name={c.name} color={c.avatarColor} size="md" />
                {c.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-online" />
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <span className="shrink-0 text-[10px] text-text-faint">{c.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-text-subtle">{c.lastMessage}</p>
                  {c.unread > 0 && (
                    <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-foreground px-1.5 text-[10px] font-bold text-background">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
