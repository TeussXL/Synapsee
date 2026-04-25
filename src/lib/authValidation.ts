import { z } from "zod";

// Aceita qualquer e-mail @modulo.edu.br ou subdomínio (@aluno., @prof., @cs., @eng., etc.)
const MODULO_DOMAIN_REGEX = /@([a-z0-9-]+\.)*modulo\.edu\.br$/i;

export const isModuloEmail = (email: string) => MODULO_DOMAIN_REGEX.test(email.trim());

export const personSignUpSchema = z
  .object({
    display_name: z.string().trim().min(2, "Informe seu nome").max(80),
    email: z.string().trim().email("E-mail inválido").max(255),
    password: z.string().min(8, "Mínimo 8 caracteres").max(72),
    course: z.string().trim().max(80).optional().or(z.literal("")),
    semester: z.string().trim().max(40).optional().or(z.literal("")),
  })
  .refine((d) => isModuloEmail(d.email), {
    message: "Use seu e-mail @aluno.modulo.edu.br ou @prof.modulo.edu.br",
    path: ["email"],
  });

export const orgSignUpSchema = z.object({
  display_name: z.string().trim().min(2, "Informe o nome da organização").max(120),
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(8, "Mínimo 8 caracteres").max(72),
});

export const signInSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(1, "Digite sua senha").max(72),
});

export type PersonSignUp = z.infer<typeof personSignUpSchema>;
export type OrgSignUp = z.infer<typeof orgSignUpSchema>;
export type SignIn = z.infer<typeof signInSchema>;
