from django.apps import apps
from django.contrib import admin

# Register your models here.
from cbr_api.models import UserCBR

# Customize interface below if needed
@admin.register(UserCBR)
class UserCBRManager(admin.ModelAdmin):
    pass


# Recommended to register models individually like UserCBRManager above if needed
models = apps.get_models()
for model in models:
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        # Some models (ie. UserCBR) may already be registered
        pass
