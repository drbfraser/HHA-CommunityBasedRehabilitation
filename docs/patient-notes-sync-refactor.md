# Offline-First Sync Refactor — Pattern Guide

> Derived from branch `889-patient-notes-sync-refactor-feature` (vs `main`).
> Use this as a template for converting **any** "online-only API feature" into an
> **offline-first, WatermelonDB-synced** feature.

## 1. What this branch actually did

`PatientNote` previously worked like a normal REST feature: the mobile app called
`apiFetch(Endpoint.PATIENT_NOTES, ...)` directly against the server on every read
and write. That breaks when the device is offline and bypasses the app's existing
sync engine.

This branch **moved PatientNote into the same sync pipeline already used by
Users, Clients, Visits, Improvements, Alerts, etc.** Now the mobile app reads and
writes PatientNotes from its local WatermelonDB database, and those records are
pushed/pulled to the server during the normal `sync` cycle.

The change spans three layers: **server model/sync**, **mobile local DB schema**,
and **mobile UI (swap API calls for local DB queries)**.

---

## 2. Server-side changes (Django / DRF)

### 2.1 Make the model sync-compatible — `server/cbr_api/models.py`

The synced tables share two conventions. PatientNote was brought in line:

```python
class PatientNote(models.Model):
    # Was: UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id = models.CharField(primary_key=True, max_length=100, default=generate_id)
    ...
    created_at = models.BigIntegerField(default=current_milli_time)
    # NEW: server-stamped time, set during sync push
    server_created_at = models.BigIntegerField(default=current_milli_time)
```

**Why the `id` change matters:** sync records are *created on the mobile device*,
which generates the primary key locally and sends it up. A server-side
auto-generated `UUIDField` would clobber/reject that. `CharField` + `generate_id`
matches every other syncable table and lets the client own the ID.

`server_created_at` records when the *server* received the record (vs `created_at`,
which is when the *device* created it). This is what `get_model_changes` uses to
decide what's "new" for other devices pulling.

### 2.2 Migrations — `server/cbr_api/migrations/`

Three migrations, each one schema change (this is the safe ordering):

1. `0085_patientnote_server_created_at` — add `server_created_at` (default `0`).
2. `0086_alter_patientnote_id_charfield` — convert `id` UUID → CharField.
3. `0087_alter_patientnote_server_created_at` — switch the default to
   `cbr_api.util.current_milli_time`.

> Note the split: a field is added with a static default first, then altered to a
> callable default. Generate these with `python manage.py makemigrations` rather
> than hand-writing, but expect this shape.

### 2.3 Sync serializers — `server/cbr_api/serializers.py`

Add a per-table sync serializer + a "multi" wrapper (created/updated/deleted),
exactly mirroring `Alert`:

```python
class PatientNoteSyncSerializer(serializers.ModelSerializer):
    id = serializers.CharField(validators=[])   # validators=[] => allow client-supplied PK
    client_id = serializers.CharField()

    class Meta:
        model = models.PatientNote
        fields = ["id", "client_id", "note", "created_at"]


class multiPatientNoteSerializer(serializers.Serializer):
    created = PatientNoteSyncSerializer(many=True)
    updated = PatientNoteSyncSerializer(many=True)
    deleted = PatientNoteSyncSerializer(many=True)
```

Register the multi-serializer on the **pull** response:

```python
class tableSerializer(serializers.Serializer):
    ...
    alert = multiAlertSerializer()
    patient_notes = multiPatientNoteSerializer()   # NEW
```

Add a **push** serializer that delegates to a `util` creator:

```python
class pushPatientNoteSerializer(serializers.Serializer):
    patient_notes = multiPatientNoteSerializer()

    def create(self, validated_data):
        create_patient_note_data(
            validated_data, self.context["user"], self.context.get("sync_time")
        )
        return self
```

### 2.4 Push handler — `server/cbr_api/util.py`

```python
def create_patient_note_data(validated_data, user, sync_time):
    table_data = validated_data.get("patient_notes")
    created_data = table_data.pop("created")
    for data in created_data:
        data["created_by"] = models.UserCBR.objects.get(username=user)
        record = models.PatientNote.objects.create(**data)
        record.server_created_at = sync_time   # stamp server receive time
        record.save()
```

> This branch only handles **created** records. `updated`/`deleted` are accepted
> by the serializer but not processed yet — add loops for them if the feature
> needs edit/delete sync.

### 2.5 Wire into the sync view — `server/cbr_api/views.py`

**Pull** (server → device), in the changes-assembly block:

```python
reply.changes["patient_notes"] = get_model_changes(request, models.PatientNote)
```

**Push** (device → server), in the request-processing block:

```python
patient_note_serializer = serializers.pushPatientNoteSerializer(
    data=request.data,
    context={"sync_time": sync_time, "user": request.user},
)
if patient_note_serializer.is_valid():
    patient_note_serializer.save()
else:
    validation_fail(patient_note_serializer)
```

---

## 3. Mobile-side changes (React Native / WatermelonDB)

### 3.1 Register the table name — `mobile/src/models/constant.ts`

```ts
export enum modelName {
    ...
    patient_notes = "patient_notes",   // NEW
}
```

### 3.2 New WatermelonDB model — `mobile/src/models/PatientNote.ts`

Implements `SyncableModel` (must expose `getBriefIdentifier`), declares columns and
the relation to `Client`:

```ts
export default class PatientNote extends Model implements SyncableModel {
    static table = modelName.patient_notes;
    static associations = {
        clients: { type: mobileGenericField.belongs_to, key: tableKey.client_id },
    } as const;

    @text("note") note;
    @readonly @date(mobileGenericField.created_at) createdAt;
    @relation(modelName.clients, tableKey.client_id) client;

    getBriefIdentifier = async (): Promise<string> => {
        const fetchedClient: Client = await this.client.fetch();
        return `Patient note for ${fetchedClient.getBriefIdentifier()}`;
    };
}
```

### 3.3 Register the model — `mobile/src/models/index.ts`

Import it and add to the `dbModels` array.

### 3.4 Schema + migration — `mobile/src/models/schema.ts` & `migrations.ts`

**Bump the schema version** and add the `tableSchema` (columns must match the
server fields you sync):

```ts
// schema.ts
version: 9,   // was 8
...
tableSchema({
    name: modelName.patient_notes,
    columns: [
        { name: tableKey.client_id, type: "string", isIndexed: true },
        { name: "note", type: "string" },
        { name: mobileGenericField.created_at, type: "number" },
    ],
}),
```

```ts
// migrations.ts — must match the new schema version
{
    toVersion: 9,
    steps: [
        createTable({
            name: modelName.patient_notes,
            columns: [
                { name: "client_id", type: "string", isIndexed: true },
                { name: "note", type: "string" },
                { name: "created_at", type: "number" },
            ],
        }),
    ],
},
```

> **Critical:** `schema.ts version` and `migrations.ts toVersion` must be the same
> number, or WatermelonDB will crash on launch.

### 3.5 Swap API calls for local DB — UI components

This is the largest mechanical part. Every `apiFetch(Endpoint.X, ...)` becomes a
WatermelonDB query/write. Pattern:

**Read (latest):**
```ts
const notes = await database
    .get(modelName.patient_notes)
    .query(Q.where("client_id", clientId), Q.sortBy("created_at", Q.desc), Q.take(1))
    .fetch();
```

**Read (history):** same query without `Q.take(1)`.

**Write (create):**
```ts
await database.write(async () => {
    const client = await database.get(modelName.clients).find(clientId);
    await database.get(modelName.patient_notes).create((note: any) => {
        note.note = localNote;
        note.client.set(client);
    });
});
```

Files touched in this branch:
- `mobile/src/components/PatientNoteModals/PatientNoteModal.tsx` — read/history/save
- `mobile/src/screens/ClientDetails/ClientDetails.tsx` — latest-note display

Both used `useDatabase()` from `@nozbe/watermelondb/hooks` and dropped the
`apiFetch`/`Endpoint` imports. Date fields became real `Date` objects (`createdAt`)
instead of ISO strings, so a `formatDate` helper replaced inline `new Date(...)`.

### 3.6 Tests — `server/cbr_api/tests/.../test_patient_note_model.py`

The model test was updated because `id` is no longer a UUID:
```python
# self.assertIsInstance(note.id, uuid.UUID)
self.assertTrue(len(note.id) > 0)
```

---

## 4. Replication checklist for a NEW feature

To convert feature `Foo` to offline-first sync, mirror the above:

**Server**
- [ ] `models.py`: `id = CharField(primary_key, max_length=100, default=generate_id)`
- [ ] `models.py`: add `server_created_at = BigIntegerField(default=current_milli_time)`
- [ ] `makemigrations` (expect: add field → alter id → alter default)
- [ ] `serializers.py`: `FooSyncSerializer` (with `id = CharField(validators=[])`) + `multiFooSerializer` (created/updated/deleted)
- [ ] `serializers.py`: register `foos = multiFooSerializer()` on `tableSerializer`
- [ ] `serializers.py`: `pushFooSerializer` calling `create_foo_data`
- [ ] `util.py`: `create_foo_data(validated_data, user, sync_time)`
- [ ] `views.py` pull: `reply.changes["foos"] = get_model_changes(request, models.Foo)`
- [ ] `views.py` push: instantiate `pushFooSerializer`, `is_valid()` → `save()` / `validation_fail`

**Mobile**
- [ ] `constant.ts`: add `foos` to `modelName` enum
- [ ] `models/Foo.ts`: new `SyncableModel` with columns, associations, `getBriefIdentifier`
- [ ] `models/index.ts`: import + add to `dbModels`
- [ ] `schema.ts`: bump `version`, add `tableSchema`
- [ ] `migrations.ts`: add `toVersion` (== schema version) with `createTable`
- [ ] UI: replace `apiFetch(Endpoint.FOO, ...)` with `database.get(...).query/create`
- [ ] adjust date handling (real `Date` objects now)

**Tests**
- [ ] Update any test asserting `id` is a UUID.

---

## 5. Known gaps / follow-ups in this branch

- **Push only handles `created`.** `updated` and `deleted` records are validated
  but silently dropped in `create_patient_note_data`. Edit/delete sync needs
  explicit loops.
- **`(notes[0] as any).note` casts** are used in the UI to dodge typing on the
  WatermelonDB model — fine, but worth typing properly if reused widely.
- **`created_by` on pull** isn't included in `PatientNoteSyncSerializer.fields`,
  so the history view dropped the "- username" suffix it previously showed.

---

## 6. Second application: Success Stories (`894-success-stories-sync-refactor-feature`)

The same pattern was applied to the **Success Stories** feature. It is a more
complex case than PatientNote, so it exercises parts of the pattern PatientNote
did not. Notable deltas worth reusing when converting other rich features:

### What carried over unchanged
- `id` UUIDField → `CharField(default=generate_id)` + new `server_created_at`.
- Three migrations (add `server_created_at` default `0` → alter `id` → alter
  `server_created_at` default to `current_milli_time`): `0088`–`0090`.
- `<Feature>SyncSerializer` + `multi<Feature>Serializer`, registered on
  `tableSerializer`, plus a `push<Feature>Serializer` → `create_<feature>_data`.
- `views.py` pull (`get_model_changes`) + push wiring.
- Mobile: `modelName` enum entry, new `SyncableModel`, `dbModels` registration,
  schema `version` bump (9 → **10**) + matching migration `toVersion: 10`.

### New things this feature needed (reusable sub-patterns)

1. **Create *and* Update push.** Unlike PatientNote (create-only),
   `create_success_story_data` also loops `updated` (sets `updated_at = sync_time`,
   pops the immutable `client_id`/`created_by_user_id`, then `.filter(pk=...).update(**data)`).
   For updates to propagate on **pull**, the model must also be added to the
   create+update branch of `get_model_changes` (alongside Client/UserCBR/Referral).

2. **Foreign-key field naming.** SuccessStory's FKs are literally named
   `client_id` and `created_by_user_id` (so their DB attnames are `client_id_id` /
   `created_by_user_id_id`). Letting `ModelSerializer` treat them as auto
   `PrimaryKeyRelatedField` means validated_data carries **model instances**, so
   `Model.objects.create(client_id=<instance>, created_by_user_id=<instance>)`
   works directly. `created_by_user_id` is declared `required=False` and stamped
   server-side from the request user.

3. **Server-derived display fields.** The old REST serializer computed
   `written_by_name`, `beneficiary_age`, `beneficiary_gender`, `hcr_status`,
   `client_name` server-side. Offline, these are **recomputed on the device** in
   [successStoryApi.ts](../mobile/src/screens/SuccessStories/successStoryApi.ts)
   (`toISuccessStory`) from the related local `clients`/`users` records, mirroring
   the server logic. Pattern: keep a mapper that hydrates the synced model into the
   screen's existing interface so the screens barely change.

4. **A second `belongs_to` relation.** The model has both `client` (→ `clients`)
   and `createdByUser` (→ `users`), using a new `tableKey.created_by_user_id`.

5. **Binary photo kept online-only.** The `photo` `ImageField` is **excluded from
   the sync serializer** (binary blobs aren't synced). On mobile a local, optional
   `photo` column holds the picked image URI for on-device preview; the View/Edit
   screens prefer that local URI and otherwise fall back to the existing
   `SUCCESS_STORY_PHOTO` download endpoint (works once the record has synced).
   **Limitation:** a photo captured on-device does **not** propagate to the server
   or other devices via sync — that remains the online/web flow.

### Files changed (Success Stories)
- Server: [models.py](../server/cbr_api/models.py),
  migrations `0088`–`0090`,
  [serializers.py](../server/cbr_api/serializers.py),
  [util.py](../server/cbr_api/util.py) (`create_success_story_data` +
  `get_model_changes` branch), [views.py](../server/cbr_api/views.py), and the
  model test (`id` is no longer a UUID).
- Mobile: [constant.ts](../mobile/src/models/constant.ts),
  [SuccessStory.ts](../mobile/src/models/SuccessStory.ts),
  [index.ts](../mobile/src/models/index.ts),
  [schema.ts](../mobile/src/models/schema.ts),
  [migrations.ts](../mobile/src/models/migrations.ts),
  [successStoryApi.ts](../mobile/src/screens/SuccessStories/successStoryApi.ts)
  (now DB-backed), and the three screens (`SuccessStoriesList`, `SuccessStoryView`,
  `NewSuccessStory`) + `ClientDetails` (which also lists stories).

> Branch base: created off `889-patient-notes-sync-refactor-feature`, so its diff
> includes the PatientNote changes as the in-tree reference.
