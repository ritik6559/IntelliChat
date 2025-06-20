"use client"

import React, {useState} from 'react';
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import MeetingIdViewHeader from "@/modules/meetings/ui/components/meeting-id-view-header";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import useConfirm from "@/modules/agents/hooks/use-confirm";
import UpdateMeetingDialog from "@/modules/meetings/ui/components/update-meeting-dialog";
import UpcomingState from "@/modules/meetings/ui/components/upcoming-state";
import ActiveState from "@/modules/meetings/ui/components/active-state";
import CancelledState from "@/modules/meetings/ui/components/cancelled-state";
import ProcessingState from "@/modules/meetings/ui/components/processing-state";
import CompletedState from "@/modules/meetings/ui/components/completed-state";

interface Props {
    meetingId: string
}

const MeetingIdView = ({
                           meetingId
                       }: Props) => {

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({
            id: meetingId,
        })
    )

    const router = useRouter()

    const queryClient = useQueryClient();

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                await queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions()
                )

                router.push("/meetings");
                },

            onError: (error) => {
                toast.error(error.message);
            }
        })
    )

    const [ RemoveConfirmation, confirmRemove ] = useConfirm(
        "Are you sure you want to remove this meeting?",
        "The meeting will be removed from the system. This action cannot be undone."
    )

    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();

        if( !ok ){
            return;
        }

        removeMeeting.mutate({id: meetingId})
    }

    const isActive = data.status === "active";
    const isUpcoming = data.status === "upcoming";
    const isCancelled = data.status === "cancelled";
    const isCompleted = data.status === "completed";
    const isProcessing = data.status === "processing";

    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog
                open={updateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={data}
            />
            <div className={"flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4"} >
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => setUpdateMeetingDialogOpen(true)}
                    onRemove={handleRemoveMeeting}
                />
                {isCancelled && <CancelledState />}
                {isProcessing && <ProcessingState />}
                {isCompleted && <CompletedState data={data} />}
                {isActive && <ActiveState meetingId={meetingId} />}
                {
                    isUpcoming && <UpcomingState
                        meetingId={meetingId}
                        onCancelMeeting={() => {}}
                        isCancelling={false}
                    />
                }
            </div>
        </>
    );
};

export default MeetingIdView;

export const MeetingIdViewLoading = () => {
    return (
        <LoadingState
            title={"Loading Meeting"}
            description={"This may take a few seconds"}
        />
    )
}

export const MeetingIdViewError = () => {
    return (
        <ErrorState
            title={"Error loading meeting"}
            description={"Something went wrong"}
        />
    )
}

