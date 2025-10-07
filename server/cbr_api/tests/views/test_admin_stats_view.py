from datetime import datetime, timezone
from django.urls import reverse
from rest_framework import status
from cbr_api.tests.helpers import AdminStatsSetUp
from cbr_api.models import ClientRisk, GoalOutcomes, RiskLevel, RiskType


class AdminStatsViewTests(AdminStatsSetUp):
    def setUp(self):
        super().setUp()
        self.client.force_authenticate(user=self.user)
        self.url = reverse("admin-stats")

    def _series_to_map(self, series):
        # Non-categorized: [{"name": "...", "value": N}, ...]
        return {row["name"]: row["value"] for row in series}

    def _categorized_to_map(self, series):
        # Categorized: [{"name": "<cat>", "data":[{"name": "...","value":N}, ...]}, ...]
        return {
            row["name"]: {d["name"]: d["value"] for d in row["data"]} for row in series
        }

    # VISITS
    def test_visits_group_by_all_no_filter_max_bars(self):
        resp = self.client.get(self.url, {"group_by": "gender, host_status, age_band"})
        assert resp.status_code == status.HTTP_200_OK
        m = self._series_to_map(resp.json()["visits"])
        # exactly the combos present in setup
        assert len(m) == 4
        assert m.get("Male host Age 26-30", 0) == 2
        assert m.get("Female host Age 18-25", 0) == 1
        assert m.get("Male refugee Age 11-17", 0) == 3
        assert m.get("Female host Age 6-10", 0) == 1

    def test_visits_categorized_by_zone_group_gender_host(self):
        resp = self.client.get(
            self.url,
            {
                "categorize_by": "zone",
                "group_by": "gender,host_status",
            },
        )
        assert resp.status_code == status.HTTP_200_OK
        data = resp.json()["visits"]
        m = self._categorized_to_map(data)

        # Zone 1: 2 male host, 1 female host
        assert m["BidiBidi Zone 1"].get("Male host", 0) == 2
        assert m["BidiBidi Zone 1"].get("Female host", 0) == 1
        # Zone 2: 3 male refugee, 1 female host
        assert m["BidiBidi Zone 2"].get("Male refugee", 0) == 3
        assert m["BidiBidi Zone 2"].get("Female host", 0) == 1

    def test_visits_group_by_age_band_child_filter(self):
        # Filter-only by child; explicitly group by age_band for bars
        resp = self.client.get(
            self.url,
            {
                "group_by": "age_band",
                "demographics": "child",
            },
        )
        assert resp.status_code == status.HTTP_200_OK
        series = resp.json()["visits"]
        m = self._series_to_map(series)
        assert m.get("Age 11-17", 0) == 3
        assert m.get("Age 6-10", 0) == 1
        # Adult bands should not appear
        assert "Age 18-25" not in m
        assert "Age 26-30" not in m

    def test_visits_group_by_age_band_adult_filter(self):
        resp = self.client.get(
            self.url,
            {
                "group_by": "age_band",
                "demographics": "adult",
            },
        )
        assert resp.status_code == status.HTTP_200_OK
        m = self._series_to_map(resp.json()["visits"])
        assert m.get("Age 26-30", 0) == 2
        assert m.get("Age 18-25", 0) == 1
        # Child bands should not appear
        assert "Age 11-17" not in m
        assert "Age 6-10" not in m

    def test_visits_group_by_selected_age_bands(self):
        # Only show 0-5 and 6-10; we expect only 6-10 to have a value (1)
        resp = self.client.get(
            self.url,
            {
                "group_by": "age_band",
                "age_bands": "0-5,6-10",
            },
        )
        assert resp.status_code == status.HTTP_200_OK
        m = self._series_to_map(resp.json()["visits"])
        assert m.get("Age 6-10", 0) == 1
        assert "Age 0-5" not in m  # zero-count bands don't appear

    def test_visits_categorized_by_zone_group_age_band(self):
        resp = self.client.get(
            self.url,
            {
                "categorize_by": "zone",
                "group_by": "age_band",
            },
        )
        assert resp.status_code == status.HTTP_200_OK
        cat = self._categorized_to_map(resp.json()["visits"])
        # Zone 1: ages 26-30 (2), 18-25 (1)
        assert cat["BidiBidi Zone 1"].get("Age 26-30", 0) == 2
        assert cat["BidiBidi Zone 1"].get("Age 18-25", 0) == 1
        # Zone 2: ages 11-17 (3), 6-10 (1)
        assert cat["BidiBidi Zone 2"].get("Age 11-17", 0) == 3
        assert cat["BidiBidi Zone 2"].get("Age 6-10", 0) == 1

    # REFERRALS
    def test_referrals_group_by_all_no_filter_max_bars(self):
        resp = self.client.get(self.url, {"group_by": "gender, host_status, resolved"})
        assert resp.status_code == status.HTTP_200_OK
        resolved_series = resp.json()["referrals_resolved"]
        unresolved_series = resp.json()["referrals_unresolved"]
        mr = self._series_to_map(resolved_series)
        mu = self._series_to_map(unresolved_series)
        # Bars should include the resolved state in the label
        assert mr.get("Male host Resolved", 0) == 1
        assert mu.get("Female host Unresolved", 0) == 1
        # Only those two combos exist with referrals
        assert len(mr) == 1
        assert len(mu) == 1

    def test_referrals_resolved_and_unresolved_split(self):
        # Ask split via resolved query param
        resolved_series = self.client.get(self.url, {"resolved": "true"}).json()[
            "referrals_resolved"
        ]
        unresolved_series = self.client.get(self.url, {"resolved": "false"}).json()[
            "referrals_unresolved"
        ]

        def total(series):
            if not series:
                return 0
            return {r["name"]: r["value"] for r in series}.get("Total", 0)

        assert total(resolved_series) == 1
        assert total(unresolved_series) == 1

    def test_referrals_categorize_by_resolved_group_gender_host(self):
        # Categorize by resolved; view still filters each set separately
        resp = self.client.get(
            self.url,
            {
                "categorize_by": "resolved",
                "group_by": "gender, host_status",
            },
        )
        assert resp.status_code == status.HTTP_200_OK
        resolved_cat = self._categorized_to_map(resp.json()["referrals_resolved"])
        unresolved_cat = self._categorized_to_map(resp.json()["referrals_unresolved"])
        # Each response will have only one category due to the resolved filter
        assert "Resolved" in resolved_cat
        assert resolved_cat["Resolved"].get("Male host", 0) == 1

        assert "Unresolved" in unresolved_cat
        assert unresolved_cat["Unresolved"].get("Female host", 0) == 1

    # NEW CLIENTS
    def test_new_clients_group_by_all_no_filter_max_bars(self):
        resp = self.client.get(self.url, {"group_by": "gender, host_status, age_band"})
        assert resp.status_code == status.HTTP_200_OK
        m = self._series_to_map(resp.json()["new_clients"])
        # One client in each group in setup
        assert len(m) == 4
        assert m.get("Male host Age 26-30", 0) == 1
        assert m.get("Female host Age 18-25", 0) == 1
        assert m.get("Male refugee Age 11-17", 0) == 1
        assert m.get("Female host Age 6-10", 0) == 1

    def test_new_clients_group_gender_host(self):
        resp = self.client.get(self.url, {"group_by": "gender, host_status"})
        assert resp.status_code == status.HTTP_200_OK
        m = self._series_to_map(resp.json()["new_clients"])
        # Male host (1), Female host (2), Male refugee (1)
        assert m.get("Male host", 0) == 1
        assert m.get("Female host", 0) == 2
        assert m.get("Male refugee", 0) == 1

    def test_new_clients_categorized_by_zone_totals(self):
        resp = self.client.get(self.url, {"categorize_by": "zone"})
        assert resp.status_code == status.HTTP_200_OK
        cat = self._categorized_to_map(resp.json()["new_clients"])
        # Each zone has 2 new clients
        assert cat["BidiBidi Zone 1"].get("Total", 0) == 2
        assert cat["BidiBidi Zone 2"].get("Total", 0) == 2

    # FOLLOW-UP VISITS
    def test_follow_ups_group_by_all_no_filter_max_bars(self):
        resp = self.client.get(self.url, {"group_by": "gender, host_status, age_band"})
        assert resp.status_code == status.HTTP_200_OK
        m = self._series_to_map(resp.json()["follow_up_visits"])
        # Only combos with >1 visits appear
        assert len(m) == 2
        assert m.get("Male host Age 26-30", 0) == 2
        assert m.get("Male refugee Age 11-17", 0) == 3

    def test_follow_up_visits_group_gender_host(self):
        # Use grouping to trigger HAVING > 1 behavior
        resp = self.client.get(self.url, {"group_by": "gender, host_status"})
        assert resp.status_code == status.HTTP_200_OK
        m = self._series_to_map(resp.json()["follow_up_visits"])
        # Male host (2), Female host (2), Male refugee (3) — all > 1
        assert m.get("Male host", 0) == 2
        assert m.get("Female host", 0) == 2
        assert m.get("Male refugee", 0) == 3

    def test_follow_up_visits_categorized_by_zone_totals(self):
        # Categorize to trigger GROUP BY + HAVING (> 1)
        resp = self.client.get(self.url, {"categorize_by": "zone"})
        assert resp.status_code == status.HTTP_200_OK
        cat = self._categorized_to_map(resp.json()["follow_up_visits"])
        assert cat["BidiBidi Zone 1"].get("Total", 0) == 3
        assert cat["BidiBidi Zone 2"].get("Total", 0) == 4

    # DISCHARGED CLIENTS
    def test_discharged_clients_categorized_by_zone_group_host(self):
        # Mark one client discharged via latest risk status CON and no GO
        now_ms = self.ms(datetime.now(timezone.utc))
        ClientRisk.objects.create(
            id="risk-1",
            client_id=self.c_host_m_adult,
            timestamp=now_ms,
            server_created_at=now_ms,
            risk_type=RiskType.HEALTH,
            risk_level=RiskLevel.LOW,
            goal_name="done",
            goal_status=GoalOutcomes.CONCLUDED,
        )

        resp = self.client.get(
            self.url,
            {
                "categorize_by": "zone",
                "group_by": "host_status",
            },
        )
        assert resp.status_code == status.HTTP_200_OK
        cat = self._categorized_to_map(resp.json()["discharged_clients"])
        # Zone 1 should have 1 discharged host client
        assert cat["BidiBidi Zone 1"].get("host", 0) == 1

    # DISABILITIES
    def test_disabilities_group_by_all_no_filter_max_bars(self):
        resp = self.client.get(self.url, {"group_by": "gender, host_status, age_band"})
        assert resp.status_code == status.HTTP_200_OK
        m = self._series_to_map(resp.json()["disabilities"])

        # Values are per disability row (M2M), see setup attachments
        assert len(m) == 4
        assert m.get("Male host Age 26-30", 0) == 1
        assert m.get("Female host Age 18-25", 0) == 1
        assert m.get("Male refugee Age 11-17", 0) == 2
        assert m.get("Female host Age 6-10", 0) == 1
