const http = require("http");

const BUNDLE_URL =
    "http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&modulesOnly=false&runModule=true&unstable_transformProfile=hermes-stable";
const TIMEOUT_MS = 5 * 60 * 1000;

console.log("Pre-warming Metro bundle...");

const req = http.get(BUNDLE_URL, (res) => {
    if (res.statusCode !== 200) {
        console.error(`Bundle request failed with status ${res.statusCode}`);
        process.exit(1);
    }
    res.resume();
    res.on("end", () => {
        console.log("Bundle ready.");
        process.exit(0);
    });
});

req.setTimeout(TIMEOUT_MS, () => {
    console.error("Bundle warm-up timed out.");
    req.destroy();
    process.exit(1);
});

req.on("error", (err) => {
    console.error("Bundle warm-up failed:", err.message);
    process.exit(1);
});
