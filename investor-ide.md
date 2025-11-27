Here's the version I'd bet on:

An investor IDE is not "ChatGPT for VCs."
It is a system where **thesis is code, the firm's network is memory, and workflows execute from intent**.

A good one-liner:

"Cursor for investors: describe the outcome, not the workflow."

Today, the market is already crowded with strong point solutions: Affinity covers CRM, relationship intelligence, and AI-assisted deal work; Harmonic covers startup discovery and now markets an investor agent; PitchBook covers private-market data and research; Carta, Juniper Square, and Visible cover fund, portfolio, and investor reporting workflows. So the open space is **not another database or another CRM**. The real gap is the **orchestration layer** that sits above those systems and turns intent into trusted actions. ([Affinity][1])

## The core concept

Think of the IDE metaphor like this:

| IDE Concept | Investor Equivalent                                                                  |
| ----------- | ------------------------------------------------------------------------------------ |
| Repo        | a deal, company, or fund workspace                                                   |
| Files       | notes, memos, models, call transcripts, market maps                                  |
| Extensions  | PitchBook, Harmonic, Affinity, Gmail, Calendar, Drive, Slack, Carta, Visible         |
| Run         | execute a sourcing, diligence, or reporting workflow                                 |
| Tests       | thesis checks, red-flag checks, ownership targets, stage fit                         |
| Debugger    | why this company ranked high, what data is missing, which source supports each claim |
| Git history | who changed the memo, who approved the action, what changed since last week          |

That is the product shape. Not a chatbot. A workspace + command layer + memory + action engine.

## Features worth putting in

### 1. A command bar for investor work

This is the "Cursor moment."

Examples:

- "Find seed-stage AI security startups in India with repeat founders and at least one warm path."
- "Turn yesterday's founder meeting into notes, CRM updates, next steps, and a partner summary."
- "Build an IC memo on this company and compare it to the last 15 devtools deals we passed."
- "Prepare my Monday pipeline review with only deals that changed meaningfully since last week."
- "Draft the quarterly LP update with portfolio deltas and notable follow-on rounds."

### 2. Thesis-as-code

This is a real differentiator.

Each partner or fund should be able to encode:

- sectors they care about
- stage and geography
- ownership targets
- preferred founder patterns
- anti-thesis patterns
- diligence questions
- memo templates
- watchlist rules

So instead of "search manually every week," the system continuously runs the thesis.

### 3. Deal workspace

For each company/deal:

- all notes, emails, meetings, docs, transcripts, cap table snippets, comps, and memos in one place
- auto-generated company brief
- competitor map
- timeline of changes
- relationship map to founders, angels, and other funds
- open questions and diligence checklist
- confidence level and missing-data warnings

### 4. Meeting-to-memo automation

This is probably the sharpest wedge.

After a founder call:

- transcribe and summarize
- pull out metrics, asks, concerns, risks
- update CRM automatically
- draft follow-up email
- create tasks for references / market checks / product diligence
- generate a partner-ready memo from the conversation and prior context

### 5. Relationship intelligence

VC is still relationship-heavy. Your product should make that visible, not pretend it disappears.

Useful things:

- warm intro path finder
- who at the firm knows this founder or customer
- network overlap across angels, operators, alumni, prior founders
- relationship freshness score
- reminder engine for nurture workflows

Historically, early-stage sourcing has been strongly shaped by networks and referrals, which is exactly why a firm-memory layer matters so much. ([Harmonic][2])

### 6. Diligence copilot with citations

It should:

- summarize data rooms
- extract risks from contracts and decks
- build competitor grids
- flag inconsistencies across founder statements, metrics, and prior materials
- draft reference-call questions
- generate investment memos where every important claim links back to a source

No source trace, no trust.

### 7. Portfolio and LP workflows

Later, not first.

Good expansions:

- portfolio KPI ingestion
- anomaly alerts
- board meeting prep
- intros engine for hiring, partnerships, fundraising
- LP update drafts
