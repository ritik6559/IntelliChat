import {createTRPCRouter, premiumProcedure, protectedProcedure} from "@/trpc/init";
import {db} from "@/db";
import {agents} from "@/db/schema";
import {agentInsertSchema, agentsUpdateSchema} from "@/modules/agents/schemas";
import {z} from "zod";
import {and, count, desc, eq, getTableColumns, ilike, sql} from "drizzle-orm";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE} from "@/constants";
import {TRPCError} from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    update: protectedProcedure
        .input(agentsUpdateSchema)
        .mutation(async ({ ctx, input }) => {

            const [update] = await db
                .update(agents)
                .set(input)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id)
                    )
                )
                .returning();

            if( !update ) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found"
                })
            }

            return update;

        }),
    remove: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const [remove] = await db
                .delete(agents)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id)
                    )
                )
                .returning();

            if( !remove ) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found"
                })
            }

            return remove;
        }),
    getOne: protectedProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        const [data] = await db
            .select({
                ...getTableColumns(agents),
                meetingCount: sql<number>`5`
            })
            .from(agents)
            .where(
                and(
                    eq(agents.id, input.id),
                    eq(agents.userId, ctx.auth.user.id)
                )
            );
        if( !data ) throw new TRPCError(
            {
                code: "NOT_FOUND",
                message: "Agent not found"
            },
        )

        return data;
    }),
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish()
        }))
        .query(async ({ ctx, input }) => {

            const { search, page, pageSize } = input;

            const data = await db
                .select({
                    ...getTableColumns(agents),
                    meetingCount: sql<number>`5`
                })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined,

                    )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)

            const [total] = await db
                .select({ count: count() })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined,

                    )
                )

            const totalPages = Math.ceil(total.count / pageSize);

            return {
                items: data,
                total: total.count,
                totalPages,
            };
        }),
    create: premiumProcedure("agents")
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
