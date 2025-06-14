import React from 'react';
import {AgentGetOne} from "@/modules/agents/types";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {agentInsertSchema} from "@/modules/agents/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import GeneratedAvatar from "@/components/generated-avatar";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

interface Props {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: Props) => {

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({})
                );

                if( initialValues?.id ){
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({
                            id: initialValues.id
                        })
                    )
                }

                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);

            }
        })
    )

    const form = useForm<z.infer<typeof agentInsertSchema>>({
        resolver: zodResolver(agentInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? ""
        }
    });

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending;

    const onSubmit = async (values: z.infer<typeof agentInsertSchema>) => {
        if ( isEdit ) {
            console.log("TODO: UPDATE")
        } else {
            createAgent.mutate(values)
        }
    }

    return (
        <Form
            {...form}
        >
            <form
                className={"space-y-4"}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <GeneratedAvatar seed={form.watch("name")} variant={"bottsNeutral"} className={"border size-16"} />
                <FormField
                    name={"name"}
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder={"Enter agent name"} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name={"instructions"}
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder={"Enter instructions for agent to follow."} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className={"flex justify-between gap-x-2"} >
                    {
                        onCancel && (
                            <Button
                                variant={"ghost"}
                                disabled={isPending}
                                type={"button"}
                                onClick={() => onCancel()}
                            >
                                Cancel
                            </Button>
                        )
                    }

                    <Button
                        disabled={isPending}
                        type={"submit"}
                    >
                        { isEdit ? "Update" : "Create" }
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default AgentForm;
