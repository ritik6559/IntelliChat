import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {polarClient} from "@/lib/ploar";

export const premiumRouter = createTRPCRouter({
    getFreeUsage: protectedProcedure.query(async ({ ctx }) => {

        const customer = await polarClient.customers.getStateExternal({
            externalId: ctx.auth.user.id
        });


    })
})
