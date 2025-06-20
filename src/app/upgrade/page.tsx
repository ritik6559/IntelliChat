import React from 'react';
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

const Page = () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if( !session ) {
        redirect('/sign-in')
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.premium.getCurrentSubscription.queryOptions()
    );
    void queryClient.prefetchQuery(
        trpc.premium.getProducts.queryOptions()
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)} >

        </HydrationBoundary>
    );
};

export default Page;
