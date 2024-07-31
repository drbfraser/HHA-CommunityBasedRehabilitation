import { commonConfiguration } from "../../init";
import i18n from "i18next";


/**
 * An `onRejected` handler intended for re-rejecting errors caught from {@link fetch} calls, usually
 * with more description.
 *
 * @return An Promise that rejects to an error that is possibly wrapped by
 * {@link CommonConfiguration.fetchErrorWrapper}.
 * @param e An error from the {@link fetch} call to be parsed to possibly have a descriptive error
 * for rejection reason if applicable.
 */
const rejectWithWrappedError = async (e: any): Promise<Response> => {
    if (e.name === "AbortError") {
        return Promise.reject<Response>(
            commonConfiguration.fetchErrorWrapper && e instanceof Error
                ? await commonConfiguration.fetchErrorWrapper(Error(i18n.t("common.general.requestTimedOut")))
                : Error(i18n.t("common.general.requestTimedOut"))
        );
    }

    return Promise.reject<Response>(
        commonConfiguration.fetchErrorWrapper && e instanceof Error
            ? await commonConfiguration.fetchErrorWrapper(e)
            : e
    );
};

export default rejectWithWrappedError;
