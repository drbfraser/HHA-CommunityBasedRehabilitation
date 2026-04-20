let bugReportFlashMessage: string | null = null;

export const setBugReportFlashMessage = (message: string) => {
    bugReportFlashMessage = message;
};

export const consumeBugReportFlashMessage = () => {
    const nextMessage = bugReportFlashMessage;
    bugReportFlashMessage = null;
    return nextMessage;
};
