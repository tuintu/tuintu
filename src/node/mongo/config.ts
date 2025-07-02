import { z } from 'zod';

export type MongoSshConfig = z.output<typeof mongoSshConfigZod>;
export const mongoSshConfigZod = z.object({
    host: z.string(),
    port: z.number(),
    username: z.string(),
    keyPath: z.string(),
});

export type MongoConfig = z.output<typeof mongoConfigZod>;
export const mongoConfigZod = z.object({
    url: z.string(),
    ssh: mongoSshConfigZod.optional(),
});
