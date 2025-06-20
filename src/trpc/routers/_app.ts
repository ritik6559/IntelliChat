import {createTRPCRouter } from '../init';
import { agentsRouter } from "@/modules/agents/server/procedures";
import {meetingsRouter} from "@/modules/meetings/server/procedures";
import {premiumRouter} from "@/modules/premium/server/route";

export const appRouter = createTRPCRouter({
    agents: agentsRouter,
    meetings: meetingsRouter,
    premium: premiumRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
