import z from "zod";
import { Role,RecordType } from "../../prisma/generated/prisma/client";


export const registerSchema = z.object({
    email: z.email('Invalid email format').toLowerCase(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    name: z.string().min(2, 'Name must be at least 2 characters long').max(100).optional(),
    role: z.enum(Role, 'Invalid role specified').optional(),
}).strict();

export const loginSchema = z.object({
    email: z.email('Invalid email format').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters long')
}).strict();

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>