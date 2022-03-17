import { clientPrioritySort, IClientSummary } from "../../src/util/clients";
import { RiskLevel } from "../../src/util/risks";

const unusedClientSummaryProps: Omit<
    IClientSummary,
    "health_risk_level" | "educat_risk_level" | "social_risk_level" | "nutrit_risk_level" | "last_visit_date"
> = {
    id: 0,
    full_name: "",
    zone: 0,
    user_id: 1,
};

const createClientWithAllRisksAsGivenLevel = (riskLevel: RiskLevel): IClientSummary => {
    return {
        ...unusedClientSummaryProps,
        health_risk_level: riskLevel,
        educat_risk_level: riskLevel,
        social_risk_level: riskLevel,
        nutrit_risk_level: riskLevel,
        last_visit_date: 0,
    };
};
const createPossibleClientsWithASingleExtremeRisk = (riskLevel: RiskLevel): IClientSummary[] => {
    const clientWithAllLowRisks: IClientSummary = {
        ...unusedClientSummaryProps,
        health_risk_level: RiskLevel.LOW,
        educat_risk_level: RiskLevel.LOW,
        social_risk_level: RiskLevel.LOW,
        nutrit_risk_level: RiskLevel.LOW,
        last_visit_date: 0,
    };
    return [
        { ...clientWithAllLowRisks, health_risk_level: riskLevel },
        { ...clientWithAllLowRisks, educat_risk_level: riskLevel },
        { ...clientWithAllLowRisks, social_risk_level: riskLevel },
        { ...clientWithAllLowRisks, nutrit_risk_level: riskLevel },
    ];
};

describe("clients.ts", () => {
    describe("clientPrioritySort", () => {
        it("should sort correctly by risk level if they're different", () => {
            // 1 high > 3 mediums, as specified by customer
            const clientsWithOneHighRisk: IClientSummary[] =
                createPossibleClientsWithASingleExtremeRisk(RiskLevel.HIGH);
            const clientWithThreeMediumRisk = createClientWithAllRisksAsGivenLevel(
                RiskLevel.MEDIUM
            );

            // descending order
            for (const highRiskClient of clientsWithOneHighRisk) {
                expect(
                    clientPrioritySort(clientWithThreeMediumRisk, highRiskClient)
                ).toBeGreaterThan(0);
                expect(clientPrioritySort(highRiskClient, clientWithThreeMediumRisk)).toBeLessThan(
                    0
                );
            }

            // 1 critical > 3 highs, as specified by customer
            const clientsWithOneCriticalRisk: IClientSummary[] =
                createPossibleClientsWithASingleExtremeRisk(RiskLevel.CRITICAL);

            const clientWithThreeHighRisk = createClientWithAllRisksAsGivenLevel(RiskLevel.HIGH);

            for (const criticalRiskClient of clientsWithOneCriticalRisk) {
                expect(
                    clientPrioritySort(clientWithThreeHighRisk, criticalRiskClient)
                ).toBeGreaterThan(0);
                expect(
                    clientPrioritySort(criticalRiskClient, clientWithThreeHighRisk)
                ).toBeLessThan(0);
            }
        });

        it("should sort correctly if risk levels are the same", () => {
            // 1 high > 3 mediums, as specified by customer
            const lessRecentClient: IClientSummary = {
                ...createClientWithAllRisksAsGivenLevel(RiskLevel.MEDIUM),
                last_visit_date: 1233344345,
            };

            const moreRecentClient: IClientSummary = {
                ...createClientWithAllRisksAsGivenLevel(RiskLevel.MEDIUM),
                last_visit_date: 1611111111,
            };

            // ascending order: moreRecentClient > lessRecentClient
            expect(clientPrioritySort(moreRecentClient, lessRecentClient)).toBeGreaterThan(0);
            expect(clientPrioritySort(lessRecentClient, moreRecentClient)).toBeLessThan(0);
            expect(clientPrioritySort(lessRecentClient, lessRecentClient)).toBe(0);
        });
    });
});
