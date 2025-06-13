'use client'

import React from 'react';
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";

const HomeView = () => {

    const { data: session } = authClient.useSession();
    const router = useRouter();

    if( !session ){
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div className={"flex flex-col p-4 gap-y-4"} >

        </div>
    );
};

export default HomeView;
