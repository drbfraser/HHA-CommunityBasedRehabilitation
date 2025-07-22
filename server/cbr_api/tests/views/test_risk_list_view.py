from django.urls import reverse
from rest_framework.test import APIClient
from cbr_api.tests.helpers import RiskViewsTestCase, create_client
from cbr_api.models import (
    Client,
    ClientRisk,
    GoalOutcomes,
    RiskLevel,
    RiskType,
    UserCBR,
    Zone,
)


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
        valid_client_id_response = self.client_api.get(
            url, {"client_id": self.client.id}
        )

        self.assertEqual(valid_client_id_response.status_code, 200)
        self.assertEqual(len(valid_client_id_response.data), 2)

        for risk_data in valid_client_id_response.data:
            self.assertEqual(risk_data["client_id"], str(self.client.id))

        invalid_client_id_response = self.client_api.get(
            url, {"client_id": "invalid-id"}
        )

        self.assertEqual(invalid_client_id_response.status_code, 200)
        self.assertEqual(len(invalid_client_id_response.data), 0)

    def test_create_new_risk(self):
        url = reverse("risk-list")

        invalid_risk_data = {
            "client_id": 9999,
            "risk_type": "INVALID_TYPE",
            "risk_level": RiskLevel.LOW,
        }
        invalid_risk_data_response = self.client_api.post(
            url, invalid_risk_data, format="json"
        )

        self.assertEqual(invalid_risk_data_response.status_code, 400)
        self.assertEqual(ClientRisk.objects.count(), 2)

        incomplete_risk_data = {
            "risk_type": RiskType.HEALTH,
            # Missing client_id and risk_level
        }
        incomplete_risk_data_response = self.client_api.post(
            url, incomplete_risk_data, format="json"
        )

        self.assertEqual(incomplete_risk_data_response.status_code, 400)
        self.assertEqual(ClientRisk.objects.count(), 2)

        valid_risk_data = {
            "client_id": str(self.client.id),
            "risk_type": RiskType.EDUCAT,
            "risk_level": RiskLevel.MEDIUM,
            "goal_name": "Education Support",
            "goal_status": GoalOutcomes.ONGOING,
        }
        valid_response = self.client_api.post(url, valid_risk_data, format="json")
        created_risk = ClientRisk.objects.get(id=valid_response.data["id"])

        self.assertEqual(valid_response.status_code, 201)
        self.assertEqual(ClientRisk.objects.count(), 3)  # 2 previous risks + 1 new risk
        self.assertEqual(str(created_risk.client_id), str(self.client))
        self.assertEqual(created_risk.risk_type, RiskType.EDUCAT)
        self.assertEqual(created_risk.risk_level, RiskLevel.MEDIUM)
        self.assertEqual(created_risk.goal_name, "Education Support")
        self.assertEqual(created_risk.goal_status, GoalOutcomes.ONGOING)

    def test_unauthenticated_access_denied(self):
        url = reverse("risk-list")
        self.client_api.force_authenticate(user=None)  # unauthenticates

        unauthenticated_get_response = self.client_api.get(url)
        unauthenticated_post_response = self.client_api.post(url, {})

        self.assertEqual(unauthenticated_get_response.status_code, 401)
        self.assertEqual(unauthenticated_post_response.status_code, 401)

    def test_user_can_access_own_zone_risks(self):
        other_zone = Zone.objects.create(zone_name="Other Zone")
        other_user = UserCBR.objects.create_user(
            username="otheruser",
            password="otherpass123",
            zone=other_zone.id,
        )
        other_client = create_client(
            user=other_user,
            first="Jane",
            last="Smith",
            contact="6045551718",
            zone=other_zone,
            gender=Client.Gender.FEMALE,
        )
        other_client_api = APIClient()
        other_client_api.force_authenticate(user=other_user)

        url = reverse("risk-list")
        response = self.client_api.get(url, {"client_id": self.client.id})
        # user defined in helpers.py only sees their two risks for their client
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        other_client_response = other_client_api.get(
            url, {"client_id": other_client.id}
        )
        # other user defined in in this testcase sees no risks because their client has none
        self.assertEqual(other_client_response.status_code, 200)
        self.assertEqual(len(other_client_response.data), 0)

    def test_empty_post_data(self):
        url = reverse("risk-list")
        response = self.client_api.post(url, {}, format="json")

        self.assertEqual(response.status_code, 400)
