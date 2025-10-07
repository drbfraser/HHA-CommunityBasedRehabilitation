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
