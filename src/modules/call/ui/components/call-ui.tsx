import React, {useState} from 'react';
import {StreamTheme, useCall} from "@stream-io/video-react-sdk";
import CallLobby from "@/modules/call/ui/components/call-lobby";

interface Props {
    meetingName: string;
}

const CallUi = ({
    meetingName,
}: Props) => {
    const call = useCall();
    const [ show, setShow ] = useState<"lobby" | "call" | "ended">("lobby");

    const handleJoin = async () => {
        if( !call ){
            return;
        }

        await call.join();

        setShow("call");
    }

    const handleLeave = () => {
        if( !call ){
            return;
        }

        call.endCall()

        setShow("ended");
    }

    return (
        <StreamTheme className={"h-full"} >
            { show === "lobby" && <CallLobby onJoin={handleJoin} /> }
            { show === "call" && <p>Call</p> }
            { show === "ended" && <p>Ended</p> }
        </StreamTheme>
    );
};

export default CallUi;
