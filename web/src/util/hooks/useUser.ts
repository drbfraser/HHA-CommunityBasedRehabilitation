import { useEffect, useState } from "react";
import { IUser } from "@cbr/common/util/users";
import { apiFetch, APIFetchFailError, Endpoint } from "@cbr/common/util/endpoints";

export const useUser = (userId: string): [IUser | null, string | null] => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user: IUser = (await (await apiFetch(Endpoint.USER, userId)).json()) as IUser;
                setUser(user);
            } catch (e) {
                setLoadingError(
                    e instanceof APIFetchFailError && e.details ? `${e}: ${e.details}` : String(e),
                );
            }
        };
        fetchUser();
    }, [userId]);

    return [user, loadingError];
};
