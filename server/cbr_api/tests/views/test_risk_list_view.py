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
    
    def test_get_risks_filtered_by_client_id(self):
        url = reverse("risk-list")
        valid_client_id_response = self.client_api.get(url, {"client_id": self.client.id})

        self.assertEqual(valid_client_id_response.status_code, 200)
        self.assertEqual(len(valid_client_id_response.data), 2)

        for risk_data in valid_client_id_response.data:
            self.assertEqual(risk_data["client_id"], str(self.client.id))

        invalid_client_id_response = self.client_api.get(url, {"client_id": "invalid-id"})

        self.assertEqual(invalid_client_id_response.status_code, 200)
        self.assertEqual(len(invalid_client_id_response.data), 0)
    
