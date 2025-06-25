## **Django Integration Testing Guidelines**

## 1. Build‑Server Job & Django Integration Testing

We run our full Django integration tests as the **final step** in the existing `build-server` job in **.github/workflows/maincicd.yml**. By placing tests last, we ensure a **fail‑fast** pipeline:

**How it works:**

1. **Checkout**: clone the repo into `/isolated_build/repo/`
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Code style**: `python -m black --check .`
4. **System checks**: `python manage.py check`
5. **Migration checks**: `python manage.py makemigrations --check`
6. **Run Django Test Suite**:

   ```bash
   python manage.py test --verbosity=2 --no-input
   ```

   - `--verbosity=2`: prints each test’s name and result (`OK`/`FAIL`).
   - `--no-input`: disables any interactive prompts, ideal for CI.

If **any** of steps 1–5 exit non‑zero, the job stops immediately, saving CI time by skipping the test suite.

---

## 2. Test Directory Structure

Each Django app gets its own **tests/** package, with subfolders by test type. For `cbr_api` we adopt:

```
cbr_api/
└── tests/
    ├── __init__.py
    ├── helpers.py         # classes and functions to use across many tests
    ├── models/
    │   ├── __init__.py
    │   ├── test_client_model.py
    │   ├── test_usercbr_model.py
    │   └── test_disability_model.py
    ├── serializers/
    │   ├── __init__.py
    │   ├── test_client_serializer.py
    │   └── test_referral_serializer.py
    └── views/
        ├── __init__.py
        ├── test_client_viewset.py
        └── test_visit_endpoints.py
```

### Naming conventions

- **File names**: `test_<thing>_*.py`, matching the component under test.
- **Test classes**: `<Thing>Tests` (e.g. `ClientModelTests`).
- **Methods**: start with `test_`, each covering one behavior.

---

## 3. Adding New Tests

Whenever developers introduce or modify functionality, they must add or update tests in the appropriate folder:

- **Models** (`tests/models/`):

  - New or changed fields, managers, `save()` overrides, signals, validators.
  - E.g. adding a new field or changing existing fields by adding constraints.

- **Serializers** (`tests/serializers/`):

  - E.g. create and update methods in the serializer for POST requests.

- **Views & ViewSets** (`tests/views/`):

  - Endpoint CRUD operations, permissions, and authentication flows.

- **Helpers** (`tests/helpers.py`):

  - Any classes or functions which can be used to setup tests.
  - E.g. create_client function in helpers.py used to create client objects across test files.

**When to add tests**:

- **Feature branches**: tests for every new model, serializer, or endpoint.
- **Schema changes**: ensure migrations preserve API behavior via integration tests.

---

## 4. Running Tests

- **Locally** (inside Docker):

  ```bash
  docker exec cbr_django python manage.py test
  ```

- **CI**: the `build-server` job in **maincicd.yml** automatically runs `python manage.py test ...` in an isolated container on pushes to `main`, enforcing that no backend changes break existing functionality.

---

## 5. References

- Django REST Framework testing guide: [https://www.django-rest-framework.org/api-guide/testing/](https://www.django-rest-framework.org/api-guide/testing/)
- NetNinja Django testing series: [https://youtu.be/OfiCALrGE14?si=EJ0Uw5AdNSVikHpa](https://youtu.be/OfiCALrGE14?si=EJ0Uw5AdNSVikHpa)
- Django Rest Framework API testing overview: [https://youtu.be/sRluxnmZ-H8?si=OkpXTJTAPz2MFNLe](https://youtu.be/sRluxnmZ-H8?si=OkpXTJTAPz2MFNLe)
