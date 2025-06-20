import React from 'react';
import {useTRPC} from "@/trpc/client";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {MeetingGetOne} from "@/modules/meetings/types";
import {meetingsInsertSchema} from "@/modules/meetings/schemas";
import CommandSelect from "@/components/command-select";
import GeneratedAvatar from "@/components/generated-avatar";
import NewAgentDialog from "@/modules/agents/ui/components/new-agent-dialog";
import {useRouter} from "next/navigation";

interface Props {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}

const MeetingForm = ({
                         onSuccess,
                         onCancel,
                         initialValues,
                     }: Props) => {

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const router = useRouter();

    const [openNewAgentDialog, setOpenNewAgentDialog] = React.useState(false);
    const [agentSearch, setAgentSearch] = React.useState<string>("");

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch
        }),
    )

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );
                await queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions()
                )

                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message);

                if(error.data?.code === "FORBIDDEN"){
                    router.push("/upgrade")
                }

            }
        })
    )

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );

                if( initialValues?.id ){
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({
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

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId ?? ""
        }
    });

    const isEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = async (values: z.infer<typeof meetingsInsertSchema>) => {
        if ( isEdit ) {
            updateMeeting.mutate({...values, id: initialValues.id})
        } else {
            createMeeting.mutate(values)
        }
    }

    return (
        <>
            <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog}/>
            <Form
                {...form}
            >
                <form
                    className={"space-y-4"}
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        name={"name"}
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder={"Enter meeting name"} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name={"agentId"}
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agent</FormLabel>
                                <FormControl>
                                    <CommandSelect
                                        options={(agents.data?.items ?? []).map((item) => ({
                                            id: item.id,
                                            value: item.id,
                                            children: (
                                                <div>
                                                    <div className={"flex items-center gap-x-2"} >
                                                        <GeneratedAvatar seed={item.name} variant={"bottsNeutral"} className={"border size-6"} />
                                                        <span>{item.name}</span>
                                                    </div>
                                                </div>
                                            )
                                        }))}
                                        onSelect={field.onChange}
                                        onSearch={setAgentSearch}
                                        value={field.value}
                                        placeholder={"Select an agent"}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Not found what you are looking for?{" "}
                                    <button
                                        type={"button"}
                                        className={"text-primary hover:underline"}
                                        onClick={() => setOpenNewAgentDialog(true)}
                                    >
                                        Create new agent
                                    </button>
                                </FormDescription>
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
        </>
    );
};

export default MeetingForm;
