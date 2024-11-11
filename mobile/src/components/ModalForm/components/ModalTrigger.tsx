import React, { FC, ReactNode } from "react";
import { HelperText, TextInput } from "react-native-paper";
import useStyles from "../ModalForm.styles";

interface IProps {
    label: string;
    displayText: string;
    hasError: boolean;
    errorMsg: string;
    children: ReactNode;
    disabled?: boolean;
}

const ModalTrigger: FC<IProps> = ({
    label,
    displayText,
    hasError,
    errorMsg,
    children,
    disabled = false,
}) => {
    return (
        <>
            <TextInput
                mode="outlined"
                disabled={disabled}
                label={label}
                value={displayText}
                error={hasError}
                render={() => children}
            />
            {hasError && <HelperText type="error">{errorMsg}</HelperText>}
        </>
    );
};

export default ModalTrigger;
