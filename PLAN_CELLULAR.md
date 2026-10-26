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
   - Open question: the first sync downloads every image (`getImage` fetches them all in parallel
     with `Promise.all`, with no concurrency limit). Decide whether that's acceptable on mobile data,
     or whether the first cellular sync should skip images or ask the user first.
2. **Stop skipping silently.** When auto-sync is skipped because cellular sync is off, log it and
   tell the user (e.g. "Auto-sync is off on mobile data — tap Sync or enable cellular sync in
   settings").
3. **Fix the Dashboard banner text.** Show the "connect to the internet" message only when
   `isInternetReachable === false`. For the "no sync started" timeout, use wording that matches the
   real reason.
4. **Investigate the socket.io connection leak** as a separate ticket: capture the client's
   `connect_error` events, check the websocket path through Caddy → uvicorn on prod, and make sure
   failed attempts close their sockets.

## Verification

- Fresh install on cellular with no saved preferences: the first sync runs, logcat shows
  `[SYNC PULL]` → `[SYNC] Finished successfully`, and the Dashboard fills in.
- After the first sync, still on cellular with `cellularSync` off: auto-sync is skipped and the user
  sees the new message.
- In airplane mode: the original "connect to the internet" banner still shows.
- Watch the app's TCP connections (`adb shell cat /proc/net/tcp6`, filtered by the app's uid) to
  confirm the connection count stays flat once the socket.io fix lands.
