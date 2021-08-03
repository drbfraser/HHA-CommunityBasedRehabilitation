import React, { useEffect, useRef, useState } from "react";
import { NavigationAction } from "@react-navigation/routers";
import { useNavigation } from "@react-navigation/core";
import ConfirmDialog, { Props as BaseConfirmDialogProps } from "./ConfirmDialog";

type Props = Omit<BaseConfirmDialogProps, "onConfirm" | "onDismiss" | "visible"> & {
    /** Whether the dialog should be bypassed when the current screen is about to be removed. */
    bypassDialog: boolean;
};

/**
 * A variant of {@link ConfirmDialog} where it shows the dialog before the current screen
 * is removed to ask the user to confirm whether they want to leave the screen. This component
 * manages the visibility by itself.
 */
const ConfirmDialogWithNavListener = (props: Props) => {
    const navigation = useNavigation();
    const [discardDialogAction, setDiscardDialogAction] = useState<NavigationAction>();
    const hideConfirmDiscardDialog = () => setDiscardDialogAction(undefined);

    useEffect(() => {
        if (props.bypassDialog) {
            return;
        }

        return navigation.addListener("beforeRemove", (e) => {
            if (props.bypassDialog) {
                return;
            }
            e.preventDefault();
            setDiscardDialogAction(e.data.action);
        });
    }, [navigation, props.bypassDialog]);

    return (
        <ConfirmDialog
            {...props}
            visible={discardDialogAction !== undefined}
            onDismiss={hideConfirmDiscardDialog}
            onConfirm={() => {
                if (discardDialogAction) {
                    hideConfirmDiscardDialog();
                    navigation.dispatch(discardDialogAction);
                }
            }}
        />
    );
};

export default ConfirmDialogWithNavListener;
