/* eslint-disable */
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type SuggestTaskRequest = {
  intent: 'suggest_tasks';
  project: { id: string; name: string; description?: string };
  phase: { id: string; name: string; description?: string };
  tasks: Array<{ id: string; title: string; status?: string; priority?: string; phaseId?: string }>;
  options?: { maxSuggestions?: number; model?: string; temperature?: number };
};

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return json({ ok: false, code: 'METHOD_NOT_ALLOWED' }, 405);
  }

  try {
    const body = (await request.json()) as SuggestTaskRequest;
    const validation = validateSuggestRequest(body);

    if (!validation.ok) {
      return json({ ok: false, code: 'INVALID_INPUT', message: validation.message }, 400);
    }

    const model = body.options?.model || 'openai/gpt-4o-mini';
    const temperature = body.options?.temperature ?? 0.4;
    const maxSuggestions = Math.min(Math.max(body.options?.maxSuggestions ?? 6, 1), 10);

    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openRouterKey) {
      return json({ ok: false, code: 'CONFIG_ERROR', message: 'OPENROUTER_API_KEY is missing.' }, 500);
    }

    const prompt = buildPrompt(body, maxSuggestions);

    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are an assistant for project planning. Return strict JSON with shape: {"tasks":[{"title":"","description":"","priority":"low|medium|high|critical"}]}.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!upstream.ok) {
      return json({ ok: false, code: 'UPSTREAM_ERROR', message: 'OpenRouter request failed.' }, 502);
    }

    const data = await upstream.json();
    const message = data?.choices?.[0]?.message?.content ?? '{"tasks":[]}';
    const parsed = safeParse(message);

    return json({
      ok: true,
      intent: 'suggest_tasks',
      model,
      output: {
        tasks: Array.isArray(parsed?.tasks) ? parsed.tasks : [],
      },
      usage: data?.usage ?? null,
    });
  } catch (_error) {
    return json({ ok: false, code: 'UNEXPECTED_ERROR' }, 500);
  }
});

function validateSuggestRequest(input: any) {
  if (!input || input.intent !== 'suggest_tasks') {
    return { ok: false, message: 'Only suggest_tasks intent is supported.' };
  }

  if (!input.project?.id || !input.project?.name) {
    return { ok: false, message: 'Project id and name are required.' };
  }

  if (!input.phase?.id || !input.phase?.name) {
    return { ok: false, message: 'Phase id and name are required.' };
  }

  if (!Array.isArray(input.tasks)) {
    return { ok: false, message: 'Tasks must be an array.' };
  }

  return { ok: true };
}

function buildPrompt(input: SuggestTaskRequest, maxSuggestions: number) {
  const tasks = input.tasks
    .slice(0, 200)
    .map((task) => `- [${task.status || 'todo'}] ${task.title} (${task.priority || 'medium'})`)
    .join('\n');

  return [
    `Project: ${input.project.name}`,
    `Project description: ${input.project.description || 'N/A'}`,
    `Target phase: ${input.phase.name}`,
    `Phase description: ${input.phase.description || 'N/A'}`,
    'Existing tasks:',
    tasks || '- none',
    `Generate ${maxSuggestions} actionable tasks for this phase.`,
    'Return JSON only.',
  ].join('\n');
}

function safeParse(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    return { tasks: [] };
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
