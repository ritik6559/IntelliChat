import React from 'react';
import {authClient} from "@/lib/auth-client";
import LoadingState from "@/components/loading-state";
import ChatUi from "@/modules/meetings/ui/components/chat-ui";

interface Props {
    meetingId: string,
    meetingName: string
}

const ChatProvider = ({
    meetingId,
    meetingName
}: Props) => {

    const {  data, isPending } = authClient.useSession();

    if( isPending || !data?.user) {
        return (
            <LoadingState
                title={"Loading..."}
                description={"Please wait while we load the chat"}
            />
        )
    }

    return (
        <ChatUi
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id}
            username={data.user.name}
            userImage={data.user.image ?? ""}
        />
    );
};

export default ChatProvider;
