export type UserRole = "aluno" | "professor" | "instituicao" | "empresa";

export interface MockUser {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: UserRole;
  course?: string;
  semester?: string;
  bio?: string;
  avatarColor: string;
}

export const currentUser: MockUser = {
  id: "u1",
  name: "Lucas Andrade",
  handle: "lucas.andrade",
  email: "lucas.andrade@aluno.modulo.edu.br",
  role: "aluno",
  course: "Engenharia de Software",
  semester: "5º semestre",
  bio: "Aluno de Engenharia de Software · Apaixonado por IA e back-end · Buscando estágio para 2026.",
  avatarColor: "from-zinc-300 to-zinc-500",
};

export const feedPosts = [
  {
    id: "p1",
    author: "Profª. Helena Martins",
    handle: "prof.helena",
    course: "Engenharia · Coordenação",
    timeAgo: "8min",
    avatarColor: "from-zinc-300 to-zinc-500",
    isTeacher: true,
    content:
      "Pessoal de Algoritmos II: subi os slides da aula de hoje no portal. Quem quiser revisar a parte de complexidade de Big-O, recomendo refazer os exercícios 4 a 7. Dúvidas, abram thread aqui mesmo 👇",
    likes: 184,
    comments: 32,
    liked: true,
  },
  {
    id: "p2",
    author: "Marina Costa",
    handle: "marina.costa",
    course: "Design Digital · 4º sem",
    timeAgo: "1h",
    avatarColor: "from-zinc-200 to-zinc-400",
    isTeacher: false,
    content:
      "Finalizei o protótipo do app de controle financeiro pra Interação Humano-Computador 🎨\n\nFoquei em micro-interações e modo escuro. Aceito feedbacks brutalmente honestos antes de entregar sexta!",
    likes: 142,
    comments: 23,
    liked: false,
  },
  {
    id: "p3",
    author: "Rafael Lima",
    handle: "rafa.dev",
    course: "Engenharia de Software · 6º sem",
    timeAgo: "3h",
    avatarColor: "from-zinc-400 to-zinc-600",
    isTeacher: false,
    content:
      "Procurando 1 pessoa de hardware pro time do Hackathon Módulo (10–12 de maio). Já temos 2 devs back-end e 1 designer. Bora montar algo com IoT? 🤖⚙️",
    likes: 58,
    comments: 14,
    liked: false,
  },
  {
    id: "p4",
    author: "Centro Acadêmico Módulo",
    handle: "ca.modulo",
    course: "Conta oficial · CA",
    timeAgo: "ontem",
    avatarColor: "from-zinc-100 to-zinc-300",
    isTeacher: false,
    content:
      "Sextou na Módulo! 🎉 Hoje tem encontro aberto do CA no pátio às 18h — apresentação dos projetos do semestre, food truck e show da banda dos veteranos. Tragam os calouros!",
    likes: 312,
    comments: 47,
    liked: true,
  },
];

export const stories = [
  { id: "s0", name: "Seu story", isOwn: true, color: "from-zinc-700 to-zinc-900" },
  { id: "s1", name: "marina.c", color: "from-zinc-200 to-zinc-400" },
  { id: "s2", name: "rafa.dev", color: "from-zinc-400 to-zinc-600" },
  { id: "s3", name: "ca.modulo", color: "from-zinc-100 to-zinc-300" },
  { id: "s4", name: "prof.helena", color: "from-zinc-300 to-zinc-500" },
  { id: "s5", name: "joao.p", color: "from-zinc-500 to-zinc-700" },
  { id: "s6", name: "bia.dsg", color: "from-zinc-200 to-zinc-500" },
];

export const announcements = [
  {
    id: "a1",
    author: "Profª. Helena Martins",
    department: "Coordenação de Engenharia",
    timeAgo: "20min",
    title: "Prova de Algoritmos remarcada",
    body: "A avaliação prevista para sexta (29/11) foi remarcada para terça (03/12), mesmo horário, sala 304. Conteúdo permanece o mesmo.",
    tag: "Acadêmico",
    pinned: true,
  },
  {
    id: "a2",
    author: "Prof. Eduardo Ramos",
    department: "Departamento de Design",
    timeAgo: "2h",
    title: "Inscrições para a Mostra de TCC abertas",
    body: "Alunos do último semestre devem se inscrever até 10/12 pelo portal acadêmico. A mostra acontece dia 18/12 no auditório principal.",
    tag: "Eventos",
    pinned: false,
  },
  {
    id: "a3",
    author: "Direção Acadêmica",
    department: "Faculdade Módulo",
    timeAgo: "ontem",
    title: "Recesso de fim de ano",
    body: "Aulas suspensas entre 23/12 e 05/01. Secretaria atende com horário reduzido. Bom descanso a todos!",
    tag: "Aviso geral",
    pinned: false,
  },
];

export const jobs = [
  {
    id: "j1",
    company: "Nubank",
    role: "Estágio em Engenharia de Software",
    location: "São Paulo · Híbrido",
    type: "Estágio",
    salary: "R$ 2.800",
    posted: "há 2 dias",
    tags: ["React", "Node.js", "TypeScript"],
    applicants: 187,
    logoColor: "from-zinc-300 to-zinc-500",
  },
  {
    id: "j2",
    company: "iFood",
    role: "Estágio em Design de Produto",
    location: "Remoto",
    type: "Estágio",
    salary: "R$ 2.500",
    posted: "há 5 dias",
    tags: ["Figma", "UX Research", "Design System"],
    applicants: 92,
    logoColor: "from-zinc-200 to-zinc-400",
  },
  {
    id: "j3",
    company: "Ambev Tech",
    role: "Trainee em Dados",
    location: "São Paulo · Presencial",
    type: "Trainee",
    salary: "R$ 4.200",
    posted: "há 1 semana",
    tags: ["Python", "SQL", "Power BI"],
    applicants: 412,
    logoColor: "from-zinc-400 to-zinc-600",
  },
  {
    id: "j4",
    company: "Magalu",
    role: "Jovem Aprendiz — Marketing",
    location: "São Paulo · Presencial",
    type: "Aprendiz",
    salary: "R$ 1.600",
    posted: "há 3 dias",
    tags: ["Marketing", "Social Media"],
    applicants: 58,
    logoColor: "from-zinc-100 to-zinc-300",
  },
];

export const conversations = [
  {
    id: "c1",
    name: "Marina Costa",
    lastMessage: "boa! manda o link do projeto pf 🙌",
    time: "agora",
    unread: 2,
    online: true,
    avatarColor: "from-zinc-200 to-zinc-400",
  },
  {
    id: "c2",
    name: "Grupo · Hackathon Módulo",
    lastMessage: "Rafael: definimos terça às 19h então",
    time: "12min",
    unread: 5,
    online: false,
    avatarColor: "from-zinc-400 to-zinc-600",
  },
  {
    id: "c3",
    name: "Profª. Helena Martins",
    lastMessage: "Lucas, recebi seu trabalho. Ótimo!",
    time: "1h",
    unread: 0,
    online: true,
    avatarColor: "from-zinc-300 to-zinc-500",
  },
  {
    id: "c4",
    name: "João Pereira",
    lastMessage: "vamo estudar pra prova hoje?",
    time: "3h",
    unread: 0,
    online: false,
    avatarColor: "from-zinc-500 to-zinc-700",
  },
  {
    id: "c5",
    name: "CA Módulo",
    lastMessage: "Reunião confirmada amanhã 18h",
    time: "ontem",
    unread: 0,
    online: false,
    avatarColor: "from-zinc-100 to-zinc-300",
  },
];
