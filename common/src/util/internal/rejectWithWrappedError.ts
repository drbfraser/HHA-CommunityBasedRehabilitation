import { commonConfiguration } from "../../init";

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
                ? await commonConfiguration.fetchErrorWrapper(Error(`The request has timed out.`))
                : Error(`The request has timed out.`)
        );
    };

    return Promise.reject<Response>(
        commonConfiguration.fetchErrorWrapper && e instanceof Error
            ? await commonConfiguration.fetchErrorWrapper(e)
            : e
    );
};

export default rejectWithWrappedError;
