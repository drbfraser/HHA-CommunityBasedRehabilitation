from django.urls import reverse
from rest_framework import status
from cbr_api.tests.helpers import AdminStatsSetUp


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
        print(m)
        assert m.get("Age 11-17", 0) == 3
        assert m.get("Age 6-10", 0) == 1
        # Adult bands should not appear
        assert "Age 18-25" not in m
        assert "Age 26-30" not in m
