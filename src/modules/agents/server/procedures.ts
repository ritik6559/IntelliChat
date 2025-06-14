import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {db} from "@/db";
import {agents} from "@/db/schema";
import {agentInsertSchema} from "@/modules/agents/schemas";
import {z} from "zod";
import {eq, getTableColumns, sql} from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({
        id: z.string()
    })).query(async ({ input }) => {
        const [data] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, input.id))

        return data;
    }),
    getMany: protectedProcedure.query(async () => {
        const data = await db
            .select({
                ...getTableColumns(agents),
                meetingCount: sql`5`
            })
            .from(agents)

        return data;
    }),
    create: protectedProcedure
        .input(agentInsertSchema)
        .mutation(async ({ input, ctx }) => {

            const [ createdAgent ] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id
                })
                .returning();

            return createdAgent
        })
});
