import { useParams } from "react-router-dom";
import { LoginScreen } from "@/components/sinapse/screens/LoginScreen";
import { FeedScreenDemo } from "@/components/sinapse/screens/FeedScreenDemo";
import { AvisosScreenDemo } from "@/components/sinapse/screens/AvisosScreenDemo";
import { VagasScreen } from "@/components/sinapse/screens/VagasScreen";
import { MensagensScreen } from "@/components/sinapse/screens/MensagensScreen";
import { PerfilScreenDemo } from "@/components/sinapse/screens/PerfilScreenDemo";
import { BottomNav, type Tab } from "@/components/sinapse/BottomNav";

const map: Record<string, { node: React.ReactNode; tab?: Tab }> = {
  login: { node: <LoginScreen /> },
  feed: { node: <FeedScreenDemo />, tab: "feed" },
  avisos: { node: <AvisosScreenDemo />, tab: "avisos" },
  vagas: { node: <VagasScreen />, tab: "vagas" },
  mensagens: { node: <MensagensScreen />, tab: "mensagens" },
  perfil: { node: <PerfilScreenDemo />, tab: "perfil" },
};

const Shot = () => {
  const { screen = "login" } = useParams();
  const entry = map[screen] ?? map.login;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 overflow-y-auto">{entry.node}</div>
      {entry.tab && <BottomNav active={entry.tab} onChange={() => {}} />}
    </div>
  );
};

export default Shot;
