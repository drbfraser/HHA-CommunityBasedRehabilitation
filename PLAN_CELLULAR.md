# Plan: First sync never runs on cellular

Status: draft for review (2026-10-26)
TODO: Also test airplane mode at startup.

## Symptom

On a fresh install of mobile 1.4.2-33 (versionCode 33) pointed at the production server
(`https://cbr.hopehealthaction.org`), the Dashboard shows:

> Unable to synchronize right now. Showing locally stored data only. Please connect to the internet and synchronize.

The device (Pixel 10 Pro Fold) was online over 5G cellular, not Wi-Fi.

## Findings

Observed via `adb logcat`, the device's `/proc/net/tcp6`, and requests to prod:

- **Server is healthy.** `GET /api/versioncheck/` returns 401 (expected without auth) in ~0.75s.
  Socket.io answers both polling (200) and websocket upgrade (101).
- **App reaches prod.** The app's uid held ESTABLISHED TLS connections to `78.141.211.44:443`
  (prod), so the server URL, DNS and TLS are fine.
- **No sync request was ever sent.** Logcat showed `[SyncDatabaseTask]: Scheduling Auto Sync`, but
  none of the `[SYNC PULL]` lines that `SyncDB` logs before its first fetch
  (`mobile/src/util/syncHandler.ts`).

### Root cause

1. `cellularSync` defaults to `false` (`mobile/src/App.tsx`, `useState<boolean>(false)`), and a fresh
   install has no saved preference.
2. In `AutoSyncDB` (`mobile/src/util/syncHandler.ts`), the `NetInfoStateType.cellular` case calls
   `SyncDB` only when `autoSync && cellularSync`. Otherwise it does nothing: no log and no
   notification.
3. `Dashboard.tsx` waits `FIRST_SYNC_START_WAIT_MILLIS` (15s) for a sync to start. None starts, so it
   falls back to local data and shows the "please connect to the internet" banner, which is
   misleading because the device is online.

So a new user on mobile data never completes a first sync and is told they're offline.

### Related problems found in the code

- **Manual sync is blocked too.** The Sync screen disables the Sync button when on cellular with
  `cellularSync` off (`mobile/src/screens/Sync/Sync.tsx`, `syncButtonDisabled`), so the user has no
  way to sync on mobile data without first finding the setting.
- **Turning on cellular sync doesn't reach the periodic auto-sync.**
  `SyncDatabaseTask.scheduleAutoSync` (`mobile/src/tasks/SyncDatabaseTask.ts`) captures
  `cellularSync` when it's called. `App.tsx` calls it only when `autoSync` changes or on login; the
  cellular toggle in `Sync.tsx` doesn't reschedule. So the 10-minute timer keeps skipping cellular
  until the app restarts.
- **Unknown reachability counts as offline.** NetInfo reports `isInternetReachable === null` while
  it is still checking, which is common right at startup. `AutoSyncDB` returns early on anything
  but `true` and shows "no internet", so the startup sync can also be skipped on Wi-Fi.
- **Other network types get a wrong message.** The `default:` branch of `AutoSyncDB` (ethernet,
  VPN, `unknown`, etc.) reports "Unable to connect to server" without trying to connect.

### Secondary observation (separate issue)

While the app was in the foreground, it opened a new TCP connection to prod roughly every 5 seconds
and never closed the old ones (34 → 37 in 8s). They all closed together when the app went to the
background. Logcat never showed `[SocketIO] Mobile user connected`. This points to the socket.io
client in `App.tsx` (`transports: ["websocket"]`) reconnecting repeatedly without completing the
handshake. It was not confirmed and is unrelated to the banner, but it wastes battery and mobile data.

## Plan

1. **Allow the first sync over cellular.** In `AutoSyncDB`, when on cellular and no sync has ever
   completed (`noPreviousSyncsPerformed()`), run `SyncDB` even if `cellularSync` is off. A device
   with no data can't do anything useful, and the first pull is the one sync a user can't skip.
   - Keep the existing version check: change the condition to
     `autoSync && (cellularSync || await noPreviousSyncsPerformed())` rather than adding a
     separate path that bypasses `lastVersionSyncedIsCurrentVersion()`.
   - `noPreviousSyncsPerformed()` reads `VersionLastSynced`, which is only written after a
     successful sync, so a failed first sync is retried on cellular next time. That's intended.
   - Apply the same exception to the Sync screen's button, so a manual first sync is allowed on
     cellular.
   - Open question: the first sync downloads every image. Downloads are already limited to
     `IMAGE_DOWNLOAD_CONCURRENCY` (4) at a time, so the concern is total data usage, not
     concurrency. Decide whether that's acceptable on mobile data, or whether the first cellular
     sync should skip images or ask the user first.
2. **Reschedule auto-sync when cellular sync changes.** Have `App.tsx` call
   `SyncDatabaseTask.scheduleAutoSync` when `cellularSync` changes (add it to the effect's
   dependencies), or have the timer read the current preference instead of a captured value.
3. **Treat unknown reachability as "not yet known".** In `AutoSyncDB`, skip with "no internet" only
   when `isInternetReachable === false`. When it's `null`, either try the sync anyway (it has its
   own timeout) or wait briefly for NetInfo to settle. In the `default:` branch, try the sync rather
   than reporting a failure.
4. **Stop skipping silently.** When auto-sync is skipped because cellular sync is off, log it and
   tell the user (e.g. "Auto-sync is off on mobile data. Enable cellular sync in Sync settings.").
   Don't say "tap Sync": the button is disabled in that state.
5. **Fix the Dashboard banner text.** Record why the last auto-sync was skipped (no internet,
   cellular sync off, error) where the Dashboard can read it, e.g. alongside the existing sync
   status. Show the "connect to the internet" banner only for no internet
   (`isInternetReachable === false`), and use wording that matches the real reason otherwise.
6. **Investigate the socket.io connection leak** as a separate ticket: capture the client's
   `connect_error` events, check the websocket path through Caddy → uvicorn on prod, and make sure
   failed attempts close their sockets.

## Verification

- Fresh install on cellular with no saved preferences: the first sync runs, logcat shows
  `[SYNC PULL]` → `[SYNC] Finished successfully`, and the Dashboard fills in.
- After the first sync, still on cellular with `cellularSync` off: auto-sync is skipped and the user
  sees the new message.
- After the first sync, on cellular: the Sync button is disabled while `cellularSync` is off.
  Turn cellular sync on with the app running, wait for the next 10-minute auto-sync, and confirm it
  runs without restarting the app.
- Fresh start on Wi-Fi: the startup sync runs even if NetInfo hasn't finished its reachability
  check (no "no internet" toast).
- In airplane mode: the original "connect to the internet" banner still shows.
- Watch the app's TCP connections (`adb shell cat /proc/net/tcp6`, filtered by the app's uid) to
  confirm the connection count stays flat once the socket.io fix lands.
