'use client'

import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";

const Page = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const {
        data: session,
    } = authClient.useSession();

    const onSubmit = () => {
        authClient.signUp.email({
            email,
            name,
            password,
        }, {
            onError: () => {
                window.alert("Error")
            },
            onSuccess: () => {
                window.alert("Success")
            },
        })
    }

    if( session ) {
        return (
            <div>
                Logged in as {session.user.name
            }
            </div>
        )
    }

    return (
        <div>
            <Input
                placeholder={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                placeholder={"name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input
                placeholder={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                onClick={onSubmit}
            >
                Create user
            </Button>
        </div>
    );
};

export default Page;
