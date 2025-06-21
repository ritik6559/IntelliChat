'use client'

import React from 'react';
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import {MeetingsViewLoading} from "@/modules/meetings/ui/view/meetings-view";

const HomeView = () => {

    const { data: session } = authClient.useSession();
    const router = useRouter();

    if( !session ){
        return (
            <MeetingsViewLoading />
        )
    }

    router.push("/meetings");
};

export default HomeView;
