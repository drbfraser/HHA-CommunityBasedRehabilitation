import { useCallback, useEffect, useRef } from "react";

/**
 * Hook to check if the component is still mounted.
 *
 * Replacing https://github.com/hupe1980/react-is-mounted-hook, which is
 * not supported for Node 18+.  Referencing https://usehooks-ts.com/react-hook/use-is-mounted.
 */
export function useIsMounted(): () => boolean {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    return useCallback(() => isMounted.current, []);
}
