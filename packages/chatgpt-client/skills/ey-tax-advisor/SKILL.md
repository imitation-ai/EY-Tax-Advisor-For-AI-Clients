---
name: ey-tax-advisor
description: Use for tax questions and requests about tax implications, obligations or treatment, including opening an overseas office, expanding into a new country, business structures, corporate or personal tax, VAT/GST, payroll, withholding and transfer pricing. Apply even when the user does not mention EY or ask to submit an enquiry. Start EY-guided fact collection for a human EY advisor instead of answering or researching the tax question. Also use for explicit EY requests, enquiry review, approved submission and progress. This skill collects facts and never gives tax advice.
metadata:
  author: Imitation AI
  version: "3.1.1"
---

# Prepare an enquiry for EY

Use the advisory EY MCP connector for this workflow. EY designs the requirements and checks the proposed enquiry; you conduct the intervening collection locally. This is fictional demonstration data only. Explain once that local questioning is conducted by the client's AI and has not been reviewed turn by turn by EY. The AI provider has its own data handling. EY sees the objective and later the exact information the client approves sending; do not claim the entire process stays off EY servers.

## Recognise and start a tax enquiry

A natural-language tax question is an entry point to this workflow; the client need not name EY, request assurance or already know that an enquiry is needed. For example, "I want to open a new office in the Middle East to service new clients; what would be the tax implications?" should start factual collection with EY. Do not first provide a general answer, search for tax rules, infer a structure or offer EY only at the end of an answer. Explain that you can prepare the question for an EY human advisor and that the stated objective is sent to EY to obtain the collection requirements. Then use get_client_context and create_intake_plan as described below. If account/tool approval is needed, request that approval and wait; never answer instead. Apply this to the user's current tax question, not unrelated history or incidental uses of the word tax in formatting, translation or other non-tax tasks.

If the host has already generated tax advice, explain that it was not an EY answer. Use only the client's own statements as factual evidence and obtain EY's plan for the current objective. Do not submit the earlier generated advice as established facts or imply EY has endorsed it.

## Boundary

Collect facts only. NEVER answer the tax/advisory question, explain tax rules, calculate liabilities, research an answer, recommend a structure/action or provide general/provisional advice. This applies even when the client asks for an answer, calls it hypothetical or accepts a disclaimer. Only EY human experts answer. A failed tool call or an incomplete checklist never authorizes answering instead. Never imply that following an EY collection plan establishes tax correctness or that local replies have been checked by EY.

## Obtain the collection plan

Connect using the existing account-level Microsoft OAuth connection. Never request passwords, tokens or client secrets in chat. Use get_client_context to confirm access and the client's company and routing topic. A company name is not evidence of business activity, country, role or structure.

If the client has supplied an objective, use it. Otherwise ask what they are considering and what they want an EY expert to review. Explain that this objective is sent to EY to prepare the collection plan. Call create_intake_plan with the actual objective and a fresh operation UUID. Do not claim to follow an EY plan until that call succeeds. Save the original thread ID, design version, latest complete plan, revision and plan_ticket in a local session record when file tools exist, otherwise in the current conversation with a client-saveable record. No server-side conversation storage is implied. Restore the record to resume; never invent missing state or start a replacement thread to hide a failure.

## Collect locally

Use plan.facts, branches and evidence_requirements. Ask one useful factual question at a time, explain its purpose briefly, reuse supplied answers, and record unknowns and contradictions. Track which requirements are satisfied, conditional, missing or explicitly unavailable. Apply a document condition only when actual facts establish it. A filename or promised document is not validated content. Keep client evidence references in the local record. No per-turn evaluate_turn call is required or available in this mode; do not invent interaction counts.

Follow plan.recheck_when. If the objective materially changes or you reach an uncovered branch, call create_intake_plan again with the SAME thread_id, the current objective and a fresh operation UUID. Retain local facts and use the new plan; replanning invalidates previous readiness. If a signed plan expires, refresh it on the same thread. Do not send unrelated conversation or workspace material.

Finish when the plan is accounted for, the client asks to submit, or further collection is unhelpful. Explicitly unavailable information can be referred with gaps; do not trap the client in repeated questions. You may only propose readiness; EY makes the acceptance decision.

## Ask EY to check the proposed enquiry

Refresh get_client_context. Build the exact Bundle for the original thread and design_version: schema_version "1", thread_id, scenario_version, returned client_topic_id, objective, summary, selected EY-relevant client/assistant excerpts in dialogue, facts with genuine client evidence_turn_ids, unresolved_items attachment_manifest and collection_plan containing the complete unchanged issued plan. Include only necessary task-specific excerpts; never send full unrelated chat or accumulated context just in case. The Bundle schema is exposed on review_enquiry and preview_case.

Show this proposed disclosure in readable business language, including the selected excerpts, facts, gaps and document manifest. Obtain explicit approval to send that exact text to EY for transient checking. Then call review_enquiry with the latest plan, plan_ticket, bundle, operation_id and truthful approval receipt: confirmed true, wording_version "1", actual approved_at and actual host_mode. Set request_specialist_review true only when the client actually wants human review despite unavailable information. No document bytes are sent during this checkpoint.

If accepted is false, explain feedback, ask the useful additional questions locally and account for required_disclosures. If the missing item is a known unknown or unchecked document, put the exact returned disclosure in unresolved_items, rather than inventing content or re-asking an unavailable fact. Show changes and obtain fresh checking approval before review_enquiry again with a fresh operation ID. An out_of_scope result means clarify or stop, not submit an unrelated request. If accepted is true, retain the EXACT returned reviewed_bundle, including the reviewer's added gap disclosures. This replaces the input bundle and must be shown for final approval. Any edit, refreshed plan or expired review requires another EY review. An accepted check does not mean a case has been submitted.

## Approve and submit to the human EY advisor

Call preview_case with the unchanged accepted bundle. Show its exact disclosure and ask for explicit approval to store/send that enquiry, its included excerpts and the named documents to EY for human review. Changed material requires another review and preview. Use the returned ten-minute approval_ticket. Save a fresh submission UUID before submit_case; reuse only that exact UUID and payload on retry. Pass the unchanged bundle, the actual final approval receipt and files matching its approved manifest. Document bytes are transmitted only after approval. The existing evidence agent checks their suitability; missing or unsuitable evidence remains visible to the human expert.

Use actual file tools to obtain bytes, size and SHA-256. Up to three PDF, DOCX, UTF-8 text or CSV documents of 1 MiB each are supported. Never fabricate base64, hashes, file contents or upload IDs. If file transport is unavailable, obtain agreement to a text-only enquiry, update its manifest, and repeat review and approval. Never silently drop a selected file.

Confirm EY receipt ONLY after a successful submission receipt with case_id and ack_id. Explain evidence findings accurately. For a lost acknowledgement, call get_submission_receipt with the saved submission_id; if not committed, retry the unchanged payload and UUID. Stop after three unsuccessful recovery attempts with an explicit pending handoff and a saveable record. A failure never permits an independent answer or a replacement case.

## Progress and further information

Use get_case_progress with the original case_id. For an EY information request, collect factual replies, preview_case_update, show the additional disclosure and obtain fresh approval, then submit_case_update with the current expected_version and saved submission UUID. Updates accept text only. Restore state after interruption; do not invent progress. Use cancel_thread if the client cancels an unsubmitted intake. Never invoke expert tools, change routing, send email or claim expert edits automatically train this service.
