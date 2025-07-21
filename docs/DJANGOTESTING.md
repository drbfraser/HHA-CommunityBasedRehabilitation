## **Django Integration Testing Guidelines**

## 1. Test-Server Job & Django Integration Testing

We run our full Django integration tests as the **test-server** job in **.github/workflows/maincicd.yml**. This job is picked up by a runner _only if the build-server job succeeds first_, ensuring a **fail‑fast** pipeline:

**How it works:**

1. Won’t start until the build-server job has completed successfully.

2. Runs on SFU GitHub server with Docker installed.

3. All steps execute inside a Python 3.9.1-buster container on the server.

4. Spins up a Postgres 13 sibling container named test_postgres.

5. Points Django at that Postgres service (POSTGRES_HOST=test_postgres, etc.) and sets a dummy SECRET_KEY.

6. Clones repo into **/isolated_build/repo/** on the container and installs dependencies using **requirements.txt**.

7. Runs `python manage.py test --verbosity=2 --no-input` inside **/isolated_build/repo/server**, which:

   - Creates a temporary test database on test_postgres.
   - Applies all migrations.
   - Runs every `test\_**.py` file in **tests/\*\***.

8. Tears down the test DB when finished.

If the **build-server** job fails first, the test-server job never runs to save pipeline resources.

---

## 2. Test Directory Structure

Each Django app gets its own **tests/** package, with subfolders by test type. For `cbr_api` we adopt:

```
cbr_api/
└── tests/
    ├── __init__.py
    ├── helpers.py # classes and functions to use across many tests
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
  docker exec cbr_django python manage.py test --verbosity=2 --no-input
  ```

- **CI**: the `test-server` job in **maincicd.yml** automatically runs `python manage.py test ...` in an isolated container on pushes to `main`, enforcing that no backend changes break existing functionality.

---

## 5. References

- Django REST Framework testing guide: [https://www.django-rest-framework.org/api-guide/testing/](https://www.django-rest-framework.org/api-guide/testing/)
- NetNinja Django testing series: [https://youtu.be/OfiCALrGE14?si=EJ0Uw5AdNSVikHpa](https://youtu.be/OfiCALrGE14?si=EJ0Uw5AdNSVikHpa)
- Django Rest Framework API testing overview: [https://youtu.be/sRluxnmZ-H8?si=OkpXTJTAPz2MFNLe](https://youtu.be/sRluxnmZ-H8?si=OkpXTJTAPz2MFNLe)
