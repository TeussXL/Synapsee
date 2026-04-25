import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  LogOut,
  Mail,
  MoreVertical,
  Settings,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "../Avatar";
import { TopBar } from "../TopBar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SinapseProfile, SinapseRole } from "@/hooks/useAuth";

interface PerfilScreenProps {
  onLogout: () => void;
  onDeleteAccount: () => Promise<{ error: string | null }>;
  profile: SinapseProfile | null;
  role: SinapseRole | null;
  emailVerified: boolean;
}

const roleLabel: Record<SinapseRole, string> = {
  aluno: "Aluno(a)",
  professor: "Professor(a)",
  instituicao: "Instituição",
  empresa: "Empresa",
  admin: "Admin",
};

export const PerfilScreen = ({
  onLogout,
  onDeleteAccount,
  profile,
  role,
  emailVerified,
}: PerfilScreenProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-text-faint">
        Carregando perfil…
      </div>
    );
  }

  const handle = profile.handle ?? profile.email.split("@")[0];

  return (
    <div className="flex flex-col">
      <TopBar
        showLogo={false}
        title={`@${handle}`}
        rightSlot={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full p-2 transition-smooth hover:bg-secondary"
                aria-label="Abrir menu de perfil"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                className="gap-2"
                onSelect={() => toast.message("Configurações em breve.")}
              >
                <Settings className="h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2" onSelect={() => onLogout()}>
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Deletar conta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <section className="px-4 pt-5">
        <div className="flex items-center gap-4">
          <Avatar
            name={profile.display_name}
            color="from-zinc-300 to-zinc-500"
            size="xl"
            ring
          />
          <div className="grid flex-1 grid-cols-3 gap-2 text-center">
            {[
              { n: "0", l: "posts" },
              { n: "0", l: "conexões" },
              { n: "0", l: "seguindo" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-lg font-semibold">{s.n}</p>
                <p className="text-[11px] text-text-faint">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-semibold">
              {profile.display_name}
            </h2>
            {role && (role === "professor" || role === "admin") && (
              <span
                className="grid h-4 w-4 place-items-center rounded-full bg-foreground text-background"
                title="Verificado"
              >
                <ShieldCheck className="h-3 w-3" />
              </span>
            )}
          </div>
          {role && (
            <p className="mt-0.5 text-[11px] uppercase tracking-wider text-text-faint">
              {roleLabel[role]}
            </p>
          )}
          {(profile.course || profile.semester) && (
            <p className="mt-0.5 text-xs text-text-subtle">
              {[profile.course, profile.semester].filter(Boolean).join(" · ")}
            </p>
          )}
          {profile.bio && (
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Email card */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-hairline bg-surface-elevated p-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background">
            <Mail className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wider text-text-faint">
              E-mail institucional
            </p>
            <p className="truncate text-sm font-semibold">{profile.email}</p>
          </div>
          {emailVerified ? (
            <span className="shrink-0 rounded-full bg-online/20 px-2 py-0.5 text-[10px] font-semibold text-online">
              verificado
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-semibold text-destructive">
              pendente
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background transition-smooth hover:bg-foreground/90">
            Editar perfil
          </button>
          <button className="rounded-xl bg-secondary py-2.5 text-sm font-semibold text-foreground transition-smooth hover:bg-accent">
            Compartilhar
          </button>
        </div>

        {(profile.course || profile.semester) && (
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-hairline bg-gradient-card p-3.5">
              <GraduationCap className="h-5 w-5 text-text-subtle" />
              <p className="mt-2 text-[11px] text-text-faint">Curso</p>
              <p className="text-sm font-semibold">{profile.course || "—"}</p>
            </div>
            <div className="rounded-2xl border border-hairline bg-gradient-card p-3.5">
              <BookOpen className="h-5 w-5 text-text-subtle" />
              <p className="mt-2 text-[11px] text-text-faint">Período</p>
              <p className="text-sm font-semibold">{profile.semester || "—"}</p>
            </div>
          </div>
        )}
      </section>

      <div className="mt-6 flex border-y border-hairline">
        {["Publicações", "Salvos", "Vagas"].map((t, i) => (
          <button
            key={t}
            className={
              "flex-1 py-3 text-xs font-semibold transition-smooth " +
              (i === 0
                ? "border-t-2 border-foreground -mt-px text-foreground"
                : "text-text-faint")
            }
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gradient-accent ring-1 ring-hairline"
          />
        ))}
      </div>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!deleting) setDeleteOpen(open);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Deletar conta?</DialogTitle>
            <DialogDescription>
              Essa ação apaga seu perfil, posts, comentários e acesso. Depois
              disso, você terá que criar a conta novamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              disabled={deleting}
              onClick={() => setDeleteOpen(false)}
              className="rounded-xl border border-hairline bg-secondary px-4 py-2.5 text-sm font-semibold transition-smooth hover:bg-accent disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                const result = await onDeleteAccount();
                setDeleting(false);
                if (result.error) {
                  toast.error(result.error);
                  return;
                }
                toast.success("Conta deletada com sucesso.");
                setDeleteOpen(false);
              }}
              className="rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-background transition-smooth hover:bg-destructive/90 disabled:opacity-60"
            >
              {deleting ? "Deletando..." : "Sim, deletar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
