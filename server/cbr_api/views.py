from django.http import JsonResponse


def example(request):
    if request.method == "GET":
        return JsonResponse({"status": "ok"})
