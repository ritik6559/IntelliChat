"use client"

import React, {useState} from 'react';
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import AgentIdViewHeader from "@/modules/agents/ui/components/agent-id-view-header";
import GeneratedAvatar from "@/components/generated-avatar";
import {Badge} from "@/components/ui/badge";
import {VideoIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import useConfirm from "@/modules/agents/hooks/use-confirm";
import UpdateAgentDialog from "@/modules/agents/ui/components/update-agent-dialog";

interface Props {
    agentId: string
}

const AgentIdView = ({
    agentId
}: Props) => {

    const router = useRouter();
    const queryClient = useQueryClient();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                await queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions()
                )

                router.push("/agents");
            },
            onError: (error) => {
                toast.error(error.message);
            }
        })
    );

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure you want to remove this agent?",
        "The agent will be removed from the system. This action cannot be undone."
    );

    const [ updateAgentDialogOpen, setUpdateAgentDialogOpen ] = useState(false);

    const handleRemove = async () => {
        const ok = await confirmRemove();

        if( !ok ){
            return;
        }

        await removeAgent.mutateAsync({ id: agentId })
    }

    return (
        <>
            <RemoveConfirmation />
            <UpdateAgentDialog
                open={updateAgentDialogOpen}
                onOpenChange={setUpdateAgentDialogOpen}
                initialValues={data}
            />
            <div
                className={"flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4"}
            >
                <AgentIdViewHeader
                    agentId={agentId}
                    agentName={data.name}
                    onEdit={() => setUpdateAgentDialogOpen(true)}
                    onRemove={handleRemove}
                />
                <div className={"bg-white rounded-lg border"} >
                    <div className={"px-4 py-5 gap-y-5 flex flex-col col-span-5"} >
                        <div className={"flex items-center gap-x-3"} >
                            <GeneratedAvatar seed={data.name} variant={"bottsNeutral"}  className={"size-10"}/>
                            <h2 className={"text-2xl font-medium"} >{data.name}</h2>
                        </div>
                        <Badge
                            variant={"outline"}
                            className={"flex items-center gap-x-2 [&>svg]:size-4"}
                        >
                            <VideoIcon className={"text-blue-700"} />
                            {data.meetingCount} {data.meetingCount === 1 ? "Meeting" : "Meetings"}
                        </Badge>
                        <div className={"flex flex-col gap-y-4"} >
                            <p className={"text-lg font-medium"} >Instructions</p>
                            <p className={"text-neutral-800"} >{data.instructions}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AgentIdView;

export const AgentsIdViewLoading = () => {
    return (
        <LoadingState
            title={"Loading Agent"}
            description={"This may take a few seconds"}
        />
    )
}

export const AgentsIdViewError = () => {
    return (
        <ErrorState
            title={"Error loading agent"}
            description={"Something went wrong"}
        />
    )
}
