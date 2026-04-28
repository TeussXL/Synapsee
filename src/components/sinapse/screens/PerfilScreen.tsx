import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  KeyRound,
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
import { supabase } from "@/integrations/supabase/client";
import type { SinapseProfile, SinapseRole } from "@/hooks/useAuth";

const isRateLimitError = (message: string) => {
  const text = message.toLowerCase();
  return text.includes("rate limit") || text.includes("too many requests");
};

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
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileUsername, setProfileUsername] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftUsername, setDraftUsername] = useState("");
  const [profileCourse, setProfileCourse] = useState("");
  const [draftCourse, setDraftCourse] = useState("");
  const [profileSemester, setProfileSemester] = useState("");
  const [draftSemester, setDraftSemester] = useState("");
  const [draftEmailLocal, setDraftEmailLocal] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lastUsernameChange, setLastUsernameChange] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!profile) return;
    setProfileName(profile.display_name);
    setDraftName(profile.display_name);
    setProfileUsername(profile.handle ?? profile.email.split("@")[0] ?? "");
    setDraftUsername(profile.handle ?? profile.email.split("@")[0] ?? "");
    setProfileCourse(profile.course ?? "");
    setDraftCourse(profile.course ?? "");
    setProfileSemester(profile.semester ?? "");
    setDraftSemester(profile.semester ?? "");
    setDraftEmailLocal(profile.email.split("@")[0] ?? "");
    setLastUsernameChange(profile.last_username_change ?? null);
  }, [profile]);

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-text-faint">
        Carregando perfil…
      </div>
    );
  }

  const emailParts = profile.email.split("@");
  const currentEmailLocal = emailParts[0] ?? "";
  const currentEmailDomain = emailParts.slice(1).join("@");
  const previewEmail = `${draftEmailLocal || currentEmailLocal}@${currentEmailDomain}`;
  const emailLocalValue = draftEmailLocal.slice(0, 15);
  const emailLimitReached = emailLocalValue.length >= 15;
  const usernameValue = profileUsername.trim().slice(0, 24);
  const courseValue = draftCourse.replace(/[^a-zA-Z\s]/g, "").slice(0, 50);
  const semesterValue = draftSemester.replace(/\D/g, "").slice(0, 2);

  return (
    <div className="flex flex-col">
      <TopBar
        showLogo={false}
        title={usernameValue ? `@${usernameValue}` : "Sem nome de usuário"}
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
                onSelect={(event) => {
                  event.preventDefault();
                  setSettingsOpen(true);
                }}
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
            name={profileName}
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
              {profileName}
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
          <button
            onClick={() => {
              setDraftName(profileName);
              setEditOpen(true);
            }}
            className="rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background transition-smooth hover:bg-foreground/90"
          >
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
        open={editOpen}
        onOpenChange={(open) => {
          if (!savingName) setEditOpen(open);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Altere o nome, curso e período do seu perfil.
            </DialogDescription>
          </DialogHeader>

          <label className="space-y-1">
            <span className="text-xs font-medium text-text-faint">Nome</span>
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              maxLength={80}
              className="w-full rounded-xl border border-hairline bg-surface-elevated px-3 py-2.5 text-sm placeholder:text-text-faint focus:border-foreground/60 focus:outline-none"
              placeholder="Digite seu nome"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-1">
              <span className="text-xs font-medium text-text-faint">Curso</span>
              <input
                value={courseValue}
                onChange={(e) =>
                  setDraftCourse(
                    e.target.value.replace(/[^a-zA-Z\s]/g, "").slice(0, 50),
                  )
                }
                maxLength={50}
                className="w-full rounded-xl border border-hairline bg-surface-elevated px-3 py-2.5 text-sm placeholder:text-text-faint focus:border-foreground/60 focus:outline-none"
                placeholder="Ex: Engenharia"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-text-faint">
                Período
              </span>
              <input
                value={semesterValue}
                onChange={(e) =>
                  setDraftSemester(
                    e.target.value.replace(/\D/g, "").slice(0, 2),
                  )
                }
                inputMode="numeric"
                maxLength={2}
                className="w-full rounded-xl border border-hairline bg-surface-elevated px-3 py-2.5 text-sm placeholder:text-text-faint focus:border-foreground/60 focus:outline-none"
                placeholder="Ex: 5"
              />
            </label>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              disabled={savingName}
              onClick={() => {
                setDraftName(profileName);
                setDraftCourse(profileCourse);
                setDraftSemester(profileSemester);
                setEditOpen(false);
              }}
              className="rounded-xl border border-hairline bg-secondary px-4 py-2.5 text-sm font-semibold transition-smooth hover:bg-accent disabled:opacity-60"
            >
              Não salvar
            </button>
            <button
              type="button"
              disabled={savingName}
              onClick={async () => {
                const trimmed = draftName.trim();
                if (trimmed.length < 2) {
                  toast.error("Digite um nome válido.");
                  return;
                }

                const courseText = draftCourse
                  .replace(/[^a-zA-Z\s]/g, "")
                  .trim();
                const semesterDigits = draftSemester
                  .replace(/\D/g, "")
                  .slice(0, 2);

                setSavingName(true);
                const { error } = await supabase
                  .from("profiles")
                  .update({
                    display_name: trimmed,
                    course: courseText || null,
                    semester: semesterDigits || null,
                  })
                  .eq("user_id", profile.user_id);
                setSavingName(false);

                if (error) {
                  toast.error(error.message);
                  return;
                }

                setProfileName(trimmed);
                setProfileCourse(courseText);
                setProfileSemester(semesterDigits);
                setEditOpen(false);
                toast.success("Perfil atualizado com sucesso.");
              }}
              className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-smooth hover:bg-foreground/90 disabled:opacity-60"
            >
              {savingName ? "Salvando..." : "Salvar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={settingsOpen}
        onOpenChange={(open) => {
          if (!updatingPassword) {
            setSettingsOpen(open);
            if (!open) {
              setSecurityOpen(false);
              setEmailOpen(false);
              setUsernameOpen(false);
              setDraftEmailLocal(currentEmailLocal);
              setDraftUsername(profileUsername);
            }
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Configurações</DialogTitle>
            <DialogDescription>Gerencie sua conta.</DialogDescription>
          </DialogHeader>

          {!securityOpen && !emailOpen && !usernameOpen ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setUsernameOpen(true)}
                className="flex w-full items-center justify-between rounded-xl border border-hairline bg-surface-elevated px-3 py-3 text-left text-sm font-semibold transition-smooth hover:bg-accent"
              >
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Nome de usuário
                </span>
                <ChevronRight className="h-4 w-4 text-text-faint" />
              </button>
              <button
                type="button"
                onClick={() => setEmailOpen(true)}
                className="flex w-full items-center justify-between rounded-xl border border-hairline bg-surface-elevated px-3 py-3 text-left text-sm font-semibold transition-smooth hover:bg-accent"
              >
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Atualizar e-mail
                </span>
                <ChevronRight className="h-4 w-4 text-text-faint" />
              </button>
              <button
                type="button"
                onClick={() => setSecurityOpen(true)}
                className="flex w-full items-center justify-between rounded-xl border border-hairline bg-surface-elevated px-3 py-3 text-left text-sm font-semibold transition-smooth hover:bg-accent"
              >
                <span className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Senha e Segurança
                </span>
                <ChevronRight className="h-4 w-4 text-text-faint" />
              </button>
            </div>
          ) : usernameOpen ? (
            <div className="mx-auto w-full max-w-[320px] space-y-3">
              <label className="space-y-1">
                <span className="text-xs font-medium text-text-faint">
                  Nome de usuário
                </span>
                <div className="flex w-full max-w-full items-stretch overflow-hidden rounded-xl border border-hairline bg-surface-elevated">
                  <span className="border-r border-hairline px-3 py-2.5 text-sm text-text-faint">
                    @
                  </span>
                  <input
                    value={draftUsername}
                    onChange={(e) =>
                      setDraftUsername(
                        e.target.value
                          .replace(/[^a-z0-9._-]/gi, "")
                          .slice(0, 24),
                      )
                    }
                    placeholder="usuario"
                    maxLength={24}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm placeholder:text-text-faint focus:outline-none"
                  />
                </div>
              </label>
              <p className="text-[11px] text-text-faint">
                O nome de usuário é diferente do nome exibido.
              </p>

              {lastUsernameChange &&
                (() => {
                  const lastChange = new Date(lastUsernameChange);
                  const nextChange = new Date(
                    lastChange.getTime() + 30 * 24 * 60 * 60 * 1000,
                  );
                  const now = new Date();
                  const canChange = now >= nextChange;
                  const daysLeft = Math.ceil(
                    (nextChange.getTime() - now.getTime()) /
                      (24 * 60 * 60 * 1000),
                  );

                  return (
                    <div
                      className={`rounded-xl border px-3 py-2 text-xs ${
                        canChange
                          ? "border-green-500/30 bg-green-500/10 text-green-700"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-700"
                      }`}
                    >
                      {canChange ? (
                        <p>✓ Você pode alterar seu nome de usuário agora.</p>
                      ) : (
                        <p>
                          Você poderá alterar em{" "}
                          <span className="font-semibold">
                            {daysLeft} dia{daysLeft !== 1 ? "s" : ""}
                          </span>
                          .
                        </p>
                      )}
                    </div>
                  );
                })()}

              <DialogFooter className="gap-2 sm:gap-0">
                <button
                  type="button"
                  disabled={savingUsername}
                  onClick={() => {
                    setDraftUsername(
                      profile.handle ?? profile.email.split("@")[0] ?? "",
                    );
                    setUsernameOpen(false);
                  }}
                  className="rounded-xl border border-hairline bg-secondary px-4 py-2.5 text-sm font-semibold transition-smooth hover:bg-accent disabled:opacity-60"
                >
                  Não salvar
                </button>
                <button
                  type="button"
                  disabled={
                    savingUsername ||
                    (() => {
                      if (!lastUsernameChange) return false;
                      const lastChange = new Date(lastUsernameChange);
                      const nextChange = new Date(
                        lastChange.getTime() + 30 * 24 * 60 * 60 * 1000,
                      );
                      return new Date() < nextChange;
                    })()
                  }
                  onClick={async () => {
                    const username = draftUsername.trim().toLowerCase();
                    if (username.length < 3) {
                      toast.error("Digite um nome de usuário válido.");
                      return;
                    }

                    if (!/^[a-z0-9._-]+$/i.test(username)) {
                      toast.error(
                        "Use apenas letras, números, ponto, hífen ou underline.",
                      );
                      return;
                    }

                    setSavingUsername(true);
                    const { error } = await supabase
                      .from("profiles")
                      .update({ handle: username })
                      .eq("user_id", profile.user_id);
                    setSavingUsername(false);

                    if (error) {
                      toast.error(error.message);
                      return;
                    }

                    setProfileUsername(username);
                    setLastUsernameChange(new Date().toISOString());
                    setUsernameOpen(false);
                    toast.success("Nome de usuário atualizado com sucesso.");
                  }}
                  className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-smooth hover:bg-foreground/90 disabled:opacity-60"
                >
                  {savingUsername ? "Salvando..." : "Salvar"}
                </button>
              </DialogFooter>
            </div>
          ) : emailOpen ? (
            <div className="mx-auto w-full max-w-[320px] space-y-3">
              <label className="space-y-1">
                <span className="text-xs font-medium text-text-faint">
                  E-mail
                </span>
                <div className="flex w-full max-w-full flex-col overflow-hidden rounded-xl border border-hairline bg-surface-elevated sm:flex-row sm:items-stretch">
                  <input
                    value={emailLocalValue}
                    onChange={(e) =>
                      setDraftEmailLocal(e.target.value.slice(0, 15))
                    }
                    placeholder="modulo"
                    maxLength={15}
                    className={
                      "min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm placeholder:text-text-faint focus:outline-none " +
                      (emailLimitReached ? "text-destructive" : "")
                    }
                  />
                  <div className="break-all border-t border-hairline px-3 py-2.5 text-sm text-text-faint sm:border-l sm:border-t-0 sm:whitespace-nowrap">
                    @{currentEmailDomain}
                  </div>
                </div>
              </label>
              <p
                className={
                  "text-[11px] " +
                  (emailLimitReached ? "text-destructive" : "text-text-faint")
                }
              >
                Limite de caracteres: 15. Você pode alterar apenas a parte antes
                do @.
              </p>
              <p className="break-words rounded-xl border border-hairline bg-secondary px-3 py-2 text-xs text-text-subtle">
                Novo e-mail:{" "}
                <span className="font-semibold text-foreground">
                  {previewEmail}
                </span>
              </p>

              <DialogFooter className="gap-2 sm:gap-0">
                <button
                  type="button"
                  disabled={savingEmail}
                  onClick={() => {
                    setDraftEmailLocal(currentEmailLocal);
                    setEmailOpen(false);
                  }}
                  className="rounded-xl border border-hairline bg-secondary px-4 py-2.5 text-sm font-semibold transition-smooth hover:bg-accent disabled:opacity-60"
                >
                  Não salvar
                </button>
                <button
                  type="button"
                  disabled={savingEmail}
                  onClick={async () => {
                    const localPart = draftEmailLocal.trim().toLowerCase();
                    if (localPart.length < 2) {
                      toast.error("Digite uma parte válida antes do @.");
                      return;
                    }

                    if (!/^[a-z0-9._-]+$/i.test(localPart)) {
                      toast.error(
                        "Use apenas letras, números, ponto, hífen ou underline.",
                      );
                      return;
                    }

                    const nextEmail = `${localPart}@${currentEmailDomain}`;
                    if (nextEmail === profile.email) {
                      toast.message("O e-mail já está igual ao atual.");
                      return;
                    }

                    setSavingEmail(true);
                    const [{ error: authError }, { error: profileError }] =
                      await Promise.all([
                        supabase.auth.updateUser({ email: nextEmail }),
                        supabase
                          .from("profiles")
                          .update({ email: nextEmail })
                          .eq("user_id", profile.user_id),
                      ]);
                    setSavingEmail(false);

                    if (authError) {
                      if (isRateLimitError(authError.message)) {
                        toast.error(
                          "Supabase limitou a troca de e-mail por enquanto. Tente mais tarde.",
                        );
                      } else {
                        toast.error(authError.message);
                      }
                      return;
                    }

                    if (profileError) {
                      toast.error(profileError.message);
                      return;
                    }

                    setEmailOpen(false);
                    toast.success("E-mail atualizado com sucesso.");
                  }}
                  className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-smooth hover:bg-foreground/90 disabled:opacity-60"
                >
                  {savingEmail ? "Salvando..." : "Salvar"}
                </button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="space-y-1">
                <span className="text-xs font-medium text-text-faint">
                  Nova senha
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-xl border border-hairline bg-surface-elevated px-3 py-2.5 text-sm placeholder:text-text-faint focus:border-foreground/60 focus:outline-none"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium text-text-faint">
                  Confirmar nova senha
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full rounded-xl border border-hairline bg-surface-elevated px-3 py-2.5 text-sm placeholder:text-text-faint focus:border-foreground/60 focus:outline-none"
                />
              </label>

              <DialogFooter className="gap-2 sm:gap-0">
                <button
                  type="button"
                  disabled={updatingPassword}
                  onClick={() => {
                    setSecurityOpen(false);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="rounded-xl border border-hairline bg-secondary px-4 py-2.5 text-sm font-semibold transition-smooth hover:bg-accent disabled:opacity-60"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  disabled={updatingPassword}
                  onClick={async () => {
                    if (newPassword.length < 8) {
                      toast.error(
                        "A nova senha precisa ter no mínimo 8 caracteres.",
                      );
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      toast.error("As senhas não conferem.");
                      return;
                    }

                    setUpdatingPassword(true);
                    const { error } = await supabase.auth.updateUser({
                      password: newPassword,
                    });
                    setUpdatingPassword(false);

                    if (error) {
                      toast.error(error.message);
                      return;
                    }

                    toast.success("Senha atualizada com sucesso.");
                    setNewPassword("");
                    setConfirmPassword("");
                    setSecurityOpen(false);
                    setSettingsOpen(false);
                  }}
                  className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-smooth hover:bg-foreground/90 disabled:opacity-60"
                >
                  {updatingPassword ? "Salvando..." : "Alterar senha"}
                </button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
