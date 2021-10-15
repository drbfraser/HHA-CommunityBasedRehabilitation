export const handleNewWebAlertSubmit = async () => {
    // validate the input
    // call backend
};

export const handleDiscard = (resetForm: () => void) => {
    if (window.confirm("Are you sure you want to clear the form?")) {
        resetForm();
    }
};

export const handleSave = async () => {
    // validate the input
    // call backend
};
