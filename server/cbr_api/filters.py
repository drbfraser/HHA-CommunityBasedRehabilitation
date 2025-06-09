from cbr_api import models
import django_filters
import django.db


class ClientFilter(django_filters.FilterSet):
    class Meta:
        model = models.Client
        fields = [
            "full_name",
            "zone",
            "id",
            "health_risk_level",
            "social_risk_level",
            "educat_risk_level",
            "nutrit_risk_level",
            "mental_risk_level",
            "user_id",
            "is_active",
            "hcr_type",
        ]
        filter_overrides = {
            django.db.models.CharField: {
                "filter_class": django_filters.CharFilter,
                "extra": lambda f: {
                    "lookup_expr": "icontains",
                },
            }
        }
