import { APIFetchFailError } from "../endpoints";

/**
 * For use with {@link APIFetchFailError.buildFormError}, exposed for unit testing purposes due to
 * issues with extending native classes.
 */
const buildFormErrorInternal = (
    error: APIFetchFailError,
    formLabels: Record<string, string>
): string => {
    if (!error.response) {
        return error.message;
    }

    const errResponseEntries = Object.entries(error.response);
    return errResponseEntries.length > 0
        ? errResponseEntries.reduce<string>((previousPartialError, [field, message], index) => {
              return (
                  previousPartialError +
                  `${index !== 0 ? "\n" : ""}${formLabels[field] ?? field}: ${message}`
              );
          }, "")
        : error.message;
};

export default buildFormErrorInternal;
