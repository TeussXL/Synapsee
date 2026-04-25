import { Bookmark, Building2, MapPin, Users } from "lucide-react";
import { TopBar } from "../TopBar";
import { jobs } from "@/lib/mockData";

export const VagasScreen = () => {
  return (
    <div className="flex flex-col">
      <TopBar showLogo={false} title="Oportunidades" showSearch />

      {/* Highlight stat */}
      <div className="mx-4 mt-3 flex items-center justify-between rounded-2xl border border-hairline bg-gradient-card p-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-text-faint">Vagas abertas para Módulo</p>
          <p className="mt-1 font-display text-2xl font-semibold">128 oportunidades</p>
          <p className="mt-1 text-xs text-text-subtle">Atualizado agora</p>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-foreground text-background">
          <Building2 className="h-6 w-6" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {["Para você", "Estágio", "Trainee", "Aprendiz", "CLT júnior"].map((c, i) => (
          <button
            key={c}
            className={
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-smooth " +
              (i === 0 ? "bg-foreground text-background" : "bg-secondary text-text-subtle hover:bg-accent")
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* Lista de vagas */}
      <section className="space-y-3 px-4 pb-2">
        {jobs.map((j) => (
          <article
            key={j.id}
            className="rounded-2xl border border-hairline bg-surface-elevated p-4 transition-smooth hover:bg-surface-overlay"
          >
            <header className="flex items-start gap-3">
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${j.logoColor} font-display text-lg font-bold text-zinc-900`}
              >
                {j.company[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-text-subtle">{j.company}</p>
                <h3 className="mt-0.5 font-display text-base font-semibold leading-tight">{j.role}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-text-faint">
                  <MapPin className="h-3 w-3" />
                  <span>{j.location}</span>
                </div>
              </div>
              <button className="text-text-faint hover:text-foreground" aria-label="Salvar">
                <Bookmark className="h-5 w-5" />
              </button>
            </header>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {j.tags.map((t) => (
                <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-text-subtle">
                  {t}
                </span>
              ))}
            </div>

            <footer className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
              <div className="flex items-center gap-3 text-[11px] text-text-faint">
                <span className="font-semibold text-foreground">{j.salary}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {j.applicants}</span>
                <span>·</span>
                <span>{j.posted}</span>
              </div>
              <button className="rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background transition-smooth hover:bg-foreground/90">
                Candidatar
              </button>
            </footer>
          </article>
        ))}
      </section>
    </div>
  );
};
