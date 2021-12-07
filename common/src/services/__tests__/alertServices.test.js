/*
  TODO:

    this is just an example of how to capsualte and make service layer testable.
    But because the system is not using Jest. I will leave the code here for further resigning decisions.
*/

/*
import alertServices from "../alertServices";
import mockAxios from "axios";
import { isTokenValid } from "../../util/auth";
jest.mock("axios");
import { getAuthToken } from "../../util/auth";

describe("test alertServices", () => {
    afterEach(() => {
        mockAxios.mockClear();
    });

    it("verify called as expected", async () => {
        mockAxios.mockResolvedValueOnce();
        const res = await alertServices.showAlerts();

        const authToken = await getAuthToken();
        if (authToken === null) {
            return Promise.reject("unable to get an access token");
        }

        expect(mockAxios).toBeCalledWith({
            method: "get",
            headers: {
                //Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
            url: `http://localhost:8000/api/alerts`,
        });
    });
});
*/
