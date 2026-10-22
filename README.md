# EY Tax Advisor For AI Clients

Prepare an EY tax enquiry in your AI assistant, review exactly what will be shared, submit it with your approval, and follow progress. This repository contains only the client advisor app. It is a fictional engineering demonstration; an EY expert remains responsible for any tax advice.

## Download and install

Choose your assistant from [the latest release](https://github.com/imitation-ai/EY-Tax-Advisor-For-AI-Clients/releases/latest):

| Assistant | Download |
| --- | --- |
| Claude Chat, Cowork or Code | `ey-tax-advisor-for-ai-clients-claude-VERSION.zip` |
| ChatGPT / Codex | `ey-tax-advisor-for-ai-clients-chatgpt-VERSION.zip` |
| Microsoft Copilot Chat / Cowork | `ey-tax-advisor-for-ai-clients-cowork-VERSION.zip` |

Each ZIP installs only **EY Tax Advisor For AI Clients**. Choose the ZIP for your assistant; the downloads are formats of the same app.

In Claude, open **Customize → Plugins → Add → Upload plugin** and select the Claude ZIP. Alternatively, add `imitation-ai/EY-Tax-Advisor-For-AI-Clients` as a Git marketplace. It lists one app: **EY Tax Advisor For AI Clients**.

In ChatGPT or Codex, add this repository as a plugin marketplace where supported, or upload the ChatGPT ZIP where available. Microsoft users install the Cowork ZIP using their organisation’s supported app installation route.

## Connect

1. Open the app’s **Connectors** tab and select **Connect**.
2. Choose **Continue to Microsoft sign-in**. Use the username and initial password your administrator created in the platform. Complete any password change or MFA on Microsoft’s page.
3. Return to your AI assistant and reconnect if prompted. Ask **“Check my EY Tax Advisor connection.”** This uses a read-only check and does not submit an enquiry.

If Connect is disabled or says **Connects in sessions**, add a custom connector under **Customize → Connectors**, using this server URL:

`https://ey-tax-advisor.redbay-b1f1e95a.uksouth.azurecontainerapps.io/mcp`

Choose OAuth, **Sign in now** and **Register automatically** where asked. Leave client credentials empty. Passwords belong only on Microsoft’s page. Installation is separate from account sign-in; each host surface needs its own verification.

## Updating

Upload the new Claude ZIP, or refresh this marketplace before updating its one plugin:

```sh
claude plugin marketplace update ey-tax-advisor-for-ai-clients
claude plugin update ey-tax-advisor-for-ai-clients@ey-tax-advisor-for-ai-clients
```

Start a new session to load an updated package. Remove older installations before installing this renamed app to avoid duplicate connectors.

`SHA256SUMS` accompanies each release. Run `shasum -a 256 -c SHA256SUMS` beside the downloaded ZIPs to check them. Maintainers can build the three host formats with Node.js 24+, `zip`, `unzip` and `node scripts/build-plugins.mjs`.
