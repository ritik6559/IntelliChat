import React, {Suspense} from 'react';
import AgentsView, {AgentsViewError, AgentsViewLoading} from "@/modules/agents/ui/view/agents-view";
import {getQueryClient, trpc} from "@/trpc/server";
import {HydrationBoundary, dehydrate} from "@tanstack/react-query";
import {ErrorBoundary} from "react-error-boundary";

const Page = async () => {

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

    return (
        <HydrationBoundary
            state={dehydrate(queryClient)}
        >
            <Suspense
                fallback={<AgentsViewLoading />} >
                <ErrorBoundary fallback={<AgentsViewError/>}>
                    <AgentsView />
                </ErrorBoundary>
            </Suspense>

        </HydrationBoundary>
    );
};

export default Page;
