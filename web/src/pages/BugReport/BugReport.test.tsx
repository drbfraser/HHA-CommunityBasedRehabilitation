import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock(
    "@cbr/common/util/endpoints",
    () => {
        class MockAPIFetchFailError extends Error {
            readonly status: number;
            readonly response?: Readonly<any>;
            readonly details?: string;

            constructor(message: string, status: number, response?: any) {
                super(message);
                this.name = "APIFetchFailError";
                this.status = status;
                this.response = response;

                const details = response?.details ?? response?.detail;
                if (details) {
                    this.details = typeof details === "string" ? details : JSON.stringify(details);
                }
            }
        }

        return {
            Endpoint: {
                BUG_REPORT: "bug_report/",
            },
            APIFetchFailError: MockAPIFetchFailError,
            apiFetch: jest.fn(),
        };
    },
    { virtual: true }
);

jest.mock("./BugReport.styles", () => ({
    bugReportStyles: {},
}));

const BugReport = require("./BugReport").default;
const { apiFetch, APIFetchFailError, Endpoint } = jest.requireMock("@cbr/common/util/endpoints");

const apiFetchMock = apiFetch as jest.Mock;

describe("BugReport", () => {
    beforeAll(() => {
        Object.defineProperty(global.URL, "createObjectURL", {
            writable: true,
            value: jest.fn(() => "blob:preview-url"),
        });
        Object.defineProperty(global.URL, "revokeObjectURL", {
            writable: true,
            value: jest.fn(),
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("keeps submit disabled when description is empty or whitespace", async () => {
        render(<BugReport />);

        const submitButton = screen.getByRole("button", { name: /submit bug report/i });
        const descriptionInput = screen.getByPlaceholderText(
            /what happened, where it happened, and what you expected instead/i
        );

        expect(submitButton).toBeDisabled();
        await userEvent.type(descriptionInput, "   ");
        expect(submitButton).toBeDisabled();
    });

    it("submits a bug report with trimmed description and shows success", async () => {
        apiFetchMock.mockResolvedValueOnce({ ok: true });
        render(<BugReport />);

        const descriptionInput = screen.getByPlaceholderText(
            /what happened, where it happened, and what you expected instead/i
        );
        await userEvent.type(descriptionInput, "  app crashes on submit  ");

        await userEvent.click(screen.getByRole("button", { name: /submit bug report/i }));

        await waitFor(() => expect(apiFetchMock).toHaveBeenCalledTimes(1));
        const [endpoint, urlParams, options] = apiFetchMock.mock.calls[0];

        expect(endpoint).toBe(Endpoint.BUG_REPORT);
        expect(urlParams).toBe("");
        expect(options.method).toBe("POST");
        expect(options.body).toBeInstanceOf(FormData);

        const payload = options.body as FormData;
        expect(payload.get("report_type")).toBe("bug_report");
        expect(payload.get("description")).toBe("app crashes on submit");

        expect(
            await screen.findByText(/your bug report email has been submitted/i)
        ).toBeInTheDocument();
    });

    it("submits suggestion with image attachment", async () => {
        apiFetchMock.mockResolvedValueOnce({ ok: true });
        render(<BugReport />);

        await userEvent.click(screen.getByRole("button", { name: /^suggestion$/i }));

        const descriptionInput = screen.getByPlaceholderText(
            /what happened, where it happened, and what you expected instead/i
        );
        await userEvent.type(descriptionInput, "Consider adding filters");

        const imageFile = new File(["fake-image"], "screenshot.jpg", { type: "image/jpeg" });
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        await userEvent.upload(fileInput, imageFile);

        expect(await screen.findByText(/screenshot\.jpg/i)).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: /submit suggestion/i }));

        await waitFor(() => expect(apiFetchMock).toHaveBeenCalledTimes(1));
        const [, , options] = apiFetchMock.mock.calls[0];
        const payload = options.body as FormData;

        expect(payload.get("report_type")).toBe("suggestion");
        expect(payload.get("description")).toBe("Consider adding filters");
        expect(payload.get("image")).toBe(imageFile);
    });

    it("shows backend details when submission fails", async () => {
        apiFetchMock.mockRejectedValueOnce(
            new APIFetchFailError("request failed", 400, {
                details: "Bug report email settings are incomplete.",
            })
        );
        render(<BugReport />);

        const descriptionInput = screen.getByPlaceholderText(
            /what happened, where it happened, and what you expected instead/i
        );
        await userEvent.type(descriptionInput, "Cannot save client profile");
        await userEvent.click(screen.getByRole("button", { name: /submit bug report/i }));

        expect(
            await screen.findByText("Bug report email settings are incomplete.")
        ).toBeInTheDocument();
    });
});
