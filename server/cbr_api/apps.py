from django.apps import AppConfig


class CbrApiConfig(AppConfig):
    name = "cbr_api"

    def ready(self):
        import cbr_api.auth_custom
        import cbr_api.auth_logging  # Import the signals module
