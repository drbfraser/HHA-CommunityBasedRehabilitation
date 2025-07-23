from django.urls import reverse
from cbr_api.tests.helpers import RiskViewsTestCase


class RiskDetailViewTests(RiskViewsTestCase):
    def test_get_risk_detail(self):
        url = reverse("risk-detail", kwargs={"pk": self.risk1.id})
        response = self.client_api.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], str(self.risk1.id))
        self.assertEqual(response.data["risk_type"], self.risk1.risk_type)
        self.assertEqual(response.data["risk_level"], self.risk1.risk_level)

    def test_get_nonexistent_risk(self):
        url = reverse("risk-detail", kwargs={"pk": 1234})  # PK does not exist
        response = self.client_api.get(url)

        self.assertEqual(response.status_code, 404)
