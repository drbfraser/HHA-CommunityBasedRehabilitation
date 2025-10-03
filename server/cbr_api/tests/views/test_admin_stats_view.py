from django.urls import reverse
from rest_framework import status
from cbr_api.tests.helpers import AdminStatsSetUp


class AdminStatsViewTests(AdminStatsSetUp):
    def setUp(self):
        super().setUp()
        self.client.force_authenticate(user=self.user)
        self.url = reverse("admin-stats")

    def test_visits_categorized_by_zone_group_gender_host(self):
        resp = self.client.get(
            self.url,
            {
                "categorize_by": "zone",
                "group_by": "gender, host_status",
            },
        )
        assert resp.status_code == status.HTTP_200_OK
        data = resp.json()["visits"]

        def to_map(series):
            return {
                row["name"]: {d["name"]: d["value"] for d in row["data"]}
                for row in series
            }

        expected = {
            "BidiBidi Zone 1": {
                "Male host": 2,
                "Male refugee": 0,
                "Female host": 1,
                "Female refugee": 0,
            },
            "BidiBidi Zone 2": {
                "Male host": 0,
                "Male refugee": 3,
                "Female host": 1,
                "Female refugee": 0,
            },
        }
        actual = to_map(data)
        print(actual)
        for zone, bars in expected.items():
            assert zone in actual
            for name, value in bars.items():
                assert actual[zone].get(name, 0) == value
