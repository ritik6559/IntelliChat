import React from 'react';
import ResponsiveDialog from "@/components/responsive-dialog";
import MeetingForm from "@/modules/meetings/ui/components/meeting-form";
import {MeetingGetOne} from "@/modules/meetings/types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: MeetingGetOne;
}

const UpdateMeetingDialog = ({
                              open,
                              onOpenChange,
    initialValues
                          }: Props) => {


    return (
        <ResponsiveDialog
            title={"Edit Meeting"}
            description={"Edit meeting details"}
            open={open}
            onOpenChange={onOpenChange}
        >
            <MeetingForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValues}
            />
        </ResponsiveDialog>
    );
};

export default UpdateMeetingDialog;
