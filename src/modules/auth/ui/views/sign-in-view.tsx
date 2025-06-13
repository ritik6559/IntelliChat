'use client'

import React from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Alert, AlertTitle} from "@/components/ui/alert";
import {OctagonAlertIcon} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import {FaGithub, FaGoogle} from "react-icons/fa";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
});

const SignInView = () => {

    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null);
        setLoading(true);

        authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: "/"
        },{
            onSuccess: () => {
                setLoading(false);
                router.push("/")

            },
            onError: ({error}) => {
                setError(error.message)
                setLoading(false);

            },
        });
    }

    const onSocialSubmit = (provider: "github" | "google") => {
        setError(null);
        setLoading(true);

        authClient.signIn.social({
            provider: provider,
            callbackURL: "/"
        },{
            onSuccess: () => {
                setLoading(false);

            },
            onError: ({error}) => {
                setError(error.message)
                setLoading(false);

            },
        });
    }

    return (
        <div
            className={"flex flex-col gap-6"}
        >
            <Card
                className={"overflow-hidden p-0"}
            >
                <CardContent
                    className={"grid p-0 md:grid-cols-2"}
                >
                    <Form
                        {...form}
                    >
                        <form
                            className={"p-6 md:p-8"}
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className={"flex flex-col gap-6"} >
                                <div
                                    className={"flex flex-col items-center text-center"}
                                >
                                    <h1 className={"text-2xl font-bold"} >
                                        Welcome back!
                                    </h1>
                                    <p className={"text-muted-foreground text-balance"} >
                                        Login to your account
                                    </p>
                                </div>

                                {/* email field */}
                                <div
                                    className={"grid gap-3"}
                                >
                                    <FormField
                                        name={"email"}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type={"email"}
                                                        placeholder={"xyz@example.com"}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* password field */}
                                <div
                                    className={"grid gap-3"}
                                >
                                    <FormField
                                        name={"password"}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type={"password"}
                                                        placeholder={"********"}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {
                                    !!error && (
                                        <Alert className={"bg-destructive/10 border-none"} >
                                            <OctagonAlertIcon className={"size-4 !text-destructive"} />
                                            <AlertTitle>{error}</AlertTitle>
                                        </Alert>
                                    )
                                }
                                <Button
                                    type={"submit"}
                                    className={"w-full"}
                                    disabled={loading}
                                >
                                    Sign In
                                </Button>
                                <div className={"after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"} >
                                    <span className={"bg-card text-muted-foreground relative z-10 px-2"} >
                                        Or continue with
                                    </span>
                                </div>

                                <div className={"grid grid-cols-2 gap-4"} >
                                    <Button
                                        variant={"outline"}
                                        type={"button"}
                                        className={"flex w-full cursor-pointer "}
                                        onClick={() => onSocialSubmit("google")}
                                    >
                                        <FaGoogle />
                                    </Button>
                                    <Button
                                        variant={"outline"}
                                        type={"button"}
                                        className={" flex w-full cursor-pointer "}
                                        onClick={() => onSocialSubmit("github")}
                                    >
                                        <FaGithub />
                                    </Button>
                                </div>
                                <div className={"text-center text-sm"} >
                                    Don&#39;t have an account?{" "}
                                    <Link href={"/sign-up"} className={"underline underline-offset-4"} >Sign up</Link>
                                </div>
                            </div>
                        </form>
                    </Form>


                    <div
                        className={"bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center"}
                    >
                        <img
                            src={"/logo.svg"}
                            alt={"Image"}
                            className={"h-[92px] w-[92p]"}
                        />
                        <p
                            className={"text-2xl font-semibold text-white"}
                        >
                            Intelli Chat
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>

    );
};

export default SignInView;
