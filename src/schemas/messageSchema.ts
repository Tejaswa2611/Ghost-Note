import {z} from 'zod';

export const messageSchema = z.object({
    content: z
    .string()
    .min(2, "Message must be at least 2 characters long.")
    .max(200, "Message must be at most 200 characters long."),
    category: z
    .enum(['constructive', 'appreciation', 'suggestion', 'question', 'general'])
    .optional()
    .default('general')
})