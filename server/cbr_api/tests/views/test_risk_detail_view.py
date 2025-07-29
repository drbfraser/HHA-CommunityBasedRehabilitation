from django.urls import reverse
from cbr_api.tests.helpers import RiskViewsTestCase
from cbr_api.models import ClientRisk, GoalOutcomes, RiskLevel, RiskType


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

    def test_update_risk_full(self):
        url = reverse("risk-detail", kwargs={"pk": self.risk1.id})
        data = {
            "client_id": self.client.id,
            "risk_type": RiskType.HEALTH,
            "risk_level": RiskLevel.HIGH,
            "goal_status": GoalOutcomes.CONCLUDED,
        }

        response = self.client_api.put(url, data, format="json")

        self.assertEqual(response.status_code, 200)
        # Verify the risk was updated
        self.risk1.refresh_from_db()
        self.assertEqual(self.risk1.risk_level, RiskLevel.HIGH)
        self.assertEqual(self.risk1.goal_status, GoalOutcomes.CONCLUDED)

    def test_update_risk_with_invalid_data(self):
        url = reverse("risk-detail", kwargs={"pk": self.risk1.id})
        data = {
            "risk_type": RiskType.HEALTH,
            "risk_level": "INVALID_LEVEL",
        }

        response = self.client_api.patch(url, data, format="json")

        self.assertEqual(response.status_code, 400)
        # Verify risk was not changed
        original_level = self.risk1.risk_level
        self.risk1.refresh_from_db()
        self.assertEqual(self.risk1.risk_level, original_level)

    def test_delete_risk(self):
        fake_id_url = reverse("risk-detail", kwargs={"pk": 1234})
        response = self.client_api.delete(fake_id_url)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(ClientRisk.objects.count(), 2)  # No risks should be deleted

        valid_id_url = reverse("risk-detail", kwargs={"pk": self.risk1.id})
        response = self.client_api.delete(valid_id_url)

        self.assertEqual(response.status_code, 204)
        # Verify the risk was deleted
        self.assertFalse(ClientRisk.objects.filter(id=self.risk1.id).exists())
        self.assertEqual(ClientRisk.objects.count(), 1)  # Only risk2 should remain

    def test_unauthenticated_access_denied(self):
        self.client_api.force_authenticate(user=None)
        url = reverse("risk-detail", kwargs={"pk": self.risk1.id})

        response = self.client_api.get(url)
        self.assertEqual(response.status_code, 401)

        response = self.client_api.put(url, {})
        self.assertEqual(response.status_code, 401)

        response = self.client_api.patch(url, {})
        self.assertEqual(response.status_code, 401)

        response = self.client_api.delete(url)
        self.assertEqual(response.status_code, 401)
