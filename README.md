# EY Enquiry Intake

Collect facts in the dedicated EY agent inside Microsoft Copilot Chat or Teams. Every reply passes through the EY service. The agent asks fixed intake questions, shows the exact enquiry for approval and confirms a successful submission for an EY human expert to answer. It never gives tax advice. Fictional demonstration data only.

## Install and start

Download `ey-tax-advisor-for-ai-clients-copilot-VERSION.zip` from [the latest release](https://github.com/imitation-ai/EY-Tax-Advisor-For-AI-Clients/releases/latest). Install it through your organisation's approved Microsoft app route, then open **EY Enquiry Intake** in Copilot Chat. This replaces the earlier client Cowork intake plugin.

Sign in with your assigned EY client account when the agent prompts you. This account can differ from your main Microsoft 365 account. Credentials belong only on Microsoft's sign-in page.

Use the reply box on each EY intake card and choose **Send reply**. This carries the exact intake context securely with every response. You can say that information is unknown, choose **Prepare EY review now**, or cancel. When ready, review the exact included conversation and use **Approve and send to EY**. Typing “yes” in another chat does not approve a disclosure. Successful submission displays the EY case ID. If sending fails, retry the same approved submission in the agent.

## Pausing and resuming

Inactivity pauses an intake; it never submits it. Use **Continue / restore this intake** on the latest EY card to restore its encrypted conversation context after a service restart. Old cards cannot overwrite newer information or approve changed content. Unapproved conversation content is processed only for the current request; it is not kept in a server-side draft cache or persisted in the EY database.

This version sends text enquiries. Selected documents are never silently included or dropped: the agent explains the channel limitation and requires explicit approval of a text enquiry with document gaps for EY to follow up.

## Other AI clients

The Claude and ChatGPT/Codex ZIPs are entry-point plugins. They direct the user to the dedicated EY agent. They do not conduct intake, research answers or submit enquiries in a general assistant conversation. Earlier connector intake writes are rejected by the service.

`SHA256SUMS` accompanies each release. Maintainers can build all three formats with Node.js 24+, `zip`, `unzip` and `node scripts/build-plugins.mjs`.
