import time
from django.test import TestCase
from django.core.exceptions import ValidationError
from cbr_api.models import (
    Client,
    UserCBR,
    Zone,
    Disability,
    RiskType,
    RiskLevel,
    GoalOutcomes,
    RiskChangeType,
    ClientRisk,
)
from cbr_api.tests.helpers import create_client


class ClientRiskModelTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.super_user = UserCBR.objects.create(
            username="root",
            password="root",
            is_superuser=True,
            zone=self.zone,
        )
        self.client = create_client(
            user=self.super_user,
            first="John",
            last="Doe",
            gender=Client.Gender.MALE,
            contact="604-555-0000",
            zone=self.zone,
        )

    def _create_client_risk(self, **kwargs):
        defaults = {
            "id": "RISK001",
            "client_id": self.client,
            "timestamp": int(time.time() * 1000),
            "risk_type": RiskType.HEALTH,
            "risk_level": RiskLevel.LOW,
        }
        defaults.update(kwargs)
        return ClientRisk.objects.create(**defaults)
    
    def test_client_risk_creation_with_required_fields(self):
        risk = self._create_client_risk(
            timestamp=1234567890,
            risk_level=RiskLevel.HIGH,
        )

        self.assertEqual(risk.id, "RISK001")
        self.assertEqual(risk.client_id, self.client)
        self.assertEqual(risk.timestamp, 1234567890)
        self.assertEqual(risk.start_date, 1234567890)  # should be auto set
        self.assertEqual(risk.end_date, 0)
        self.assertEqual(risk.risk_type, RiskType.HEALTH)
        self.assertEqual(risk.risk_level, RiskLevel.HIGH)
        self.assertEqual(risk.requirement, "No requirement set")
        self.assertEqual(risk.goal_name, "No goal set")
        self.assertEqual(risk.goal_status, GoalOutcomes.NOT_SET)
        self.assertEqual(risk.change_type, RiskChangeType.INITIAL)
        self.assertEqual(risk.cancellation_reason, "")

    def test_unique_id_enforced(self):
        self._create_client_risk(
            id="RISK018",
            timestamp=9999999999,
            risk_level=RiskLevel.MEDIUM,
        )

        with self.assertRaises(Exception):
            self._create_client_risk(
                id="RISK018",
                timestamp=9999999999,
                risk_type=RiskType.MENTAL,
                risk_level=RiskLevel.LOW,
            )

    def test_end_date_set_when_cancelled_on_save(self):
        risk = self._create_client_risk(
            id="RISK003",
            timestamp=4444444444,
            risk_level=RiskLevel.CRITICAL,
            goal_status=GoalOutcomes.CANCELLED,
            cancellation_reason="Client moved away",
        )

        self.assertNotEqual(risk.end_date, 0)
        self.assertEqual(risk.cancellation_reason, "Client moved away")
        # end_date is set in milliseconds and should be greater than the provided timestamp
        self.assertGreater(risk.end_date, risk.timestamp)

    def test_start_date_preserved_if_non_zero(self):
        risk = self._create_client_risk(
            id="RISK004",
            timestamp=5555555555,
            start_date=5555550000,
            risk_type=RiskType.SOCIAL,
        )

        self.assertEqual(risk.start_date, 5555550000)

    def test_change_type_can_be_set_and_persisted(self):
        risk = self._create_client_risk(
            id="RISK005",
            timestamp=6666666666,
            risk_type=RiskType.MENTAL,
            risk_level=RiskLevel.MEDIUM,
            change_type=RiskChangeType.BOTH,
        )

        self.assertEqual(risk.change_type, RiskChangeType.BOTH)

    def test_creating_with_concluded_sets_end_date(self):
        risk = self._create_client_risk(
            id="RISK006",
            timestamp=7777777777,
            risk_type=RiskType.NUTRIT,
            risk_level=RiskLevel.HIGH,
            goal_status=GoalOutcomes.CONCLUDED,
        )

        self.assertNotEqual(risk.end_date, 0)
        self.assertGreater(risk.end_date, risk.timestamp)

    def test_risk_level_change_does_not_set_end_date(self):
        risk = self._create_client_risk(
            id="RISK007",
            timestamp=8888888888,
            goal_status=GoalOutcomes.NOT_SET,
        )

        risk.risk_level = RiskLevel.HIGH
        risk.save()

        # Since goal_status didn't change to CONCLUDED/CANCELLED, end_date should remain 0
        self.assertEqual(risk.end_date, 0)
