# AI Service Plan (OpenRouter)

## Why this app needs a backend AI layer

PlanIt is currently a client-side React app with Supabase for auth and cloud state sync. The frontend has direct access only to the Supabase anon key and browser state. This is a good setup for CRUD, but **not** for direct LLM calls because OpenRouter API keys must never be exposed in the browser.

## Recommended architecture

Use a **Supabase Edge Function** as the AI gateway:

1. Frontend calls `supabase.functions.invoke("ai-assistant", ...)`.
2. Edge function validates auth and input.
3. Edge function composes context from the user's project/phase/task payload.
4. Edge function calls OpenRouter with a server-side secret key.
5. Edge function returns structured JSON to the client.
6. (Optional but recommended) Edge function stores usage logs in a table for observability and abuse control.

This keeps secrets server-side, lets you enforce per-user quotas/rate-limits, and gives a single place to tune prompts/models.

## API contract to implement first

Use one stable endpoint and make behavior explicit with an `intent` field.

### Request

```json
{
  "intent": "suggest_tasks",
  "project": { "id": "...", "name": "...", "description": "..." },
  "phases": [{ "id": "...", "name": "...", "description": "..." }],
  "tasks": [{ "id": "...", "title": "...", "status": "todo" }],
  "options": {
    "maxSuggestions": 6,
    "model": "openai/gpt-4o-mini",
    "temperature": 0.4
  }
}
```

### Response

```json
{
  "ok": true,
  "intent": "suggest_tasks",
  "model": "openai/gpt-4o-mini",
  "output": {
    "tasks": [
      { "title": "Define auth flows", "description": "...", "priority": "high" }
    ]
  },
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "total_tokens": 0
  }
}
```

Keep response JSON-only so the UI can render reliably without brittle text parsing.

## Suggested intents for PlanIt

Start small with 3 intents:

- `suggest_tasks`: Given project + phase context, generate actionable tasks.
- `summarize_project`: Produce a concise status summary from current tasks.
- `next_best_actions`: Recommend top 3 moves based on blocked/in-progress state.

These map directly to current PlanIt entities and provide immediate user value.

## Security requirements

- Store `OPENROUTER_API_KEY` in Supabase Edge Function secrets.
- Never call OpenRouter directly from frontend.
- Require authenticated users for AI calls.
- Validate payload shape and cap sizes (e.g., max 200 tasks, max text length).
- Add per-user rate limiting (e.g., simple DB counter per hour).
- Log prompt hash + token usage, not raw sensitive content, when possible.

## Reliability and UX

- Set reasonable timeout (15–25s) and return friendly retry messages.
- Add idempotency key support for repeated clicks.
- Return typed error codes (`RATE_LIMITED`, `INVALID_INPUT`, `UPSTREAM_TIMEOUT`).
- Expose model metadata in response for debugging and future A/B tests.

## Rollout plan

1. Build `suggest_tasks` only.
2. Add UI entry point in board header ("AI suggestions").
3. Let users review suggestions before creating tasks.
4. Track acceptance rate and tokens/task as success metrics.
5. Expand to `summarize_project` and `next_best_actions` after baseline quality is validated.

## Why OpenRouter specifically works well here

- Model routing flexibility without changing frontend contract.
- Easy experimentation (`model` override server-side).
- Can swap providers/models for cost/quality tuning while preserving one app integration.

## Minimal implementation checklist

- [ ] Create Supabase Edge Function `ai-assistant`.
- [ ] Add server secret: `OPENROUTER_API_KEY`.
- [ ] Implement strict request validation.
- [ ] Implement OpenRouter call with JSON-mode output.
- [ ] Add `ai_usage_logs` table (user_id, intent, model, tokens, latency_ms, created_at).
- [ ] Add frontend service wrapper and invoke function from UI.
- [ ] Add feature flag (`VITE_ENABLE_AI_ASSISTANT`) to gate release.
