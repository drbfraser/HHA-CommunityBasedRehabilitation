from django.urls import reverse
from cbr_api.tests.helpers import RiskViewsTestCase


class RiskListViewTests(RiskViewsTestCase):
    def setUp(self):
        super().setUp()
        
    def test_get_all_risks(self):
        url = reverse("risk-list")
        response = self.client_api.get(url)
        print(response.data)