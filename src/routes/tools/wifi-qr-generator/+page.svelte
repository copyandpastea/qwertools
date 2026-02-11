<script lang="ts">
    import QRCode from "qrcode";

    type Auth = "WPA" | "WEP" | "nopass";

    let ssid = "";
    let password = "";
    let auth: Auth = "WPA";
    let hidden = false;

    let qrText = "";
    let dataUrl = "";
    let error = "";

    // WiFi QR format: WIFI:T:WPA;S:SSID;P:password;H:true;;
    function escapeWifiValue(v: string) {
        // Escape: \ ; , :
        return v
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/:/g, "\\:");
    }

    function buildWifiString() {
        const S = escapeWifiValue(ssid.trim());
        const T = auth;
        const H = hidden ? "true" : "";
        const P = auth === "nopass" ? "" : escapeWifiValue(password);

        // H is optional. String should end with a trailing semicolon.
        return `WIFI:T:${T};S:${S};P:${P};${H ? `H:${H};` : ""};`;
    }

    async function generate() {
        error = "";
        dataUrl = "";

        if (!ssid.trim()) {
            error = "SSID is required.";
            qrText = "";
            return;
        }
        if (auth !== "nopass" && !password) {
            error = "Password is required for WPA/WEP networks.";
            qrText = "";
            return;
        }

        qrText = buildWifiString();

        try {
            dataUrl = await QRCode.toDataURL(qrText, {
                errorCorrectionLevel: "M",
                margin: 2,
                scale: 8,
            });
        } catch (e: any) {
            error = e?.message ?? "Failed to generate QR code.";
        }
    }

    async function copyText() {
        if (!qrText) return;
        try {
            await navigator.clipboard?.writeText(qrText);
        } catch {
            // ignore
        }
    }

    function downloadPng() {
        if (!dataUrl) return;
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `wifi-qr-${ssid.trim() || "network"}.png`;
        a.click();
    }

    // Auto-generate on input changes (client only)
    $: {
        if (typeof window !== "undefined") {
            if (!ssid.trim()) {
                dataUrl = "";
                qrText = "";
                error = "";
            } else {
                generate();
            }
        }
    }
</script>

<div class="wiki-h1">WiFi QR Code Generator</div>
<div class="text-sm text-zinc-700 mb-4">
    Scan to join WiFi instantly (no login required).
</div>

{#if error}
    <div class="wiki-notice wiki-notice-danger mb-4">
        <b>Error:</b>
        {error}
    </div>
{/if}

<div class="grid gap-4 md:grid-cols-2">
    <!-- Left: Form -->
    <div class="grid gap-4">
        <div class="wiki-field">
            <label class="wiki-label">SSID (Network Name)</label>
            <input
                class="wiki-input"
                bind:value={ssid}
                placeholder="e.g. MyHomeWiFi"
            />
        </div>

        <div class="wiki-field">
            <label class="wiki-label">Security</label>
            <select class="wiki-select" bind:value={auth}>
                <option value="WPA">WPA/WPA2/WPA3 (Recommended)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">No Password (Open Network)</option>
            </select>
        </div>

        <div class="wiki-field">
            <label class="wiki-label">Password</label>
            <input
                class="wiki-input"
                bind:value={password}
                placeholder={auth === "nopass"
                    ? "Open network — no password"
                    : "Enter password"}
                disabled={auth === "nopass"}
            />
            <div class="wiki-help">
                This QR code contains connection details. Share it only with
                people you trust.
            </div>
        </div>

        <div class="wiki-field">
            <label class="wiki-label">Hidden Network (Hidden SSID)</label>
            <div class="flex items-center gap-2">
                <input
                    type="checkbox"
                    class="h-4 w-4 border-zinc-400"
                    bind:checked={hidden}
                />
                <span class="text-sm">This network is hidden</span>
            </div>
        </div>

        <div class="">
            <button class="wiki-btn wiki-btn-primary" type="button" on:click={generate}>
              Regenerate
            </button>
          
            <button class="wiki-btn" type="button" on:click={copyText} disabled={!qrText}>
              Copy WiFi String
            </button>
          
            <button class="wiki-btn" type="button" on:click={downloadPng} disabled={!dataUrl}>
              Download PNG
            </button>
          </div>
          

        {#if qrText}
            <div class="wiki-notice wiki-notice-info">
                <div class="font-semibold mb-1">WiFi String</div>
                <div class="text-xs break-all font-mono">{qrText}</div>
            </div>
        {/if}
    </div>

    <!-- Right: Preview -->
    <div class="grid gap-3">
        <div class="wiki-h2">Preview WiFi QR Code</div>

        {#if dataUrl}
            <div class="wiki-thumb">
                <img
                    src={dataUrl}
                    alt="WiFi QR Code"
                    class="w-full max-w-[360px] object-contain"
                />
                <div class="mt-2 text-xs text-zinc-600">
                    Use your camera (or a QR scanner) to join this network.
                </div>
            </div>
        {:else}
            <div class="wiki-thumb">
                <div class="text-sm text-zinc-600">
                    Enter an SSID to generate a preview.
                </div>
            </div>
        {/if}

        <div class="wiki-notice">
            <b>Tip:</b> Most iOS/Android devices support this format. If scanning
            fails, it’s often due to special characters in SSID/password. Escaping
            is applied, but simpler names/passwords may work more reliably on older
            devices.
        </div>
    </div>
</div>
