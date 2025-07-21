from django.urls import reverse
from cbr_api.tests.helpers import RiskViewsTestCase


class RiskListViewTests(RiskViewsTestCase):
    def setUp(self):
        super().setUp()

    def test_get_all_risks(self):
        url = reverse("risk-list")
        response = self.client_api.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        risk_ids = [risk["id"] for risk in response.data]
        self.assertIn(str(self.risk1.id), risk_ids)
        self.assertIn(str(self.risk2.id), risk_ids)
