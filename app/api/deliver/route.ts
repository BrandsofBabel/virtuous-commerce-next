// Verify a paid Stripe Checkout session and return a time-limited signed
// download link to the private 2000x2000 deliverable. Page-download fulfillment
// (no email service needed). Ported from the legacy site's api/deliver.js; the
// two best-effort writes are awaited here because serverless may not finish
// fire-and-forget fetches after the response is returned.
// Env required: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id") || "";
  if (!sessionId.startsWith("cs_"))
    return json({ ok: false, error: "missing session_id" }, 400);

  const STRIPE = process.env.STRIPE_SECRET_KEY;
  const SUPA =
    process.env.SUPABASE_URL ?? "https://qcbqpuooybnernorbhtv.supabase.co";
  const SVC = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!STRIPE || !SVC) {
    console.error("deliver: missing env");
    return json({ ok: false, error: "server not configured" }, 500);
  }

  try {
    // 1) verify the session with Stripe (server-side, secret key)
    const sr = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${STRIPE}` } }
    );
    if (!sr.ok) {
      console.error("stripe", sr.status);
      return json({ ok: false, error: "verify failed" }, 502);
    }
    const s = await sr.json();
    const paid = s.payment_status === "paid" || s.status === "complete";
    if (!paid) return json({ ok: false, error: "not paid" }, 402);

    const slug = (s.client_reference_id || "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    if (!slug) return json({ ok: false, error: "no_reference", email: true }, 200); // fallback: manual email

    // 2) signed URL to the private deliverable (service key), 7-day expiry
    const path = `${slug}_main_2000.png`;
    const sg = await fetch(
      `${SUPA}/storage/v1/object/sign/pro-deliverables/${path}`,
      {
        method: "POST",
        headers: {
          apikey: SVC,
          Authorization: `Bearer ${SVC}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expiresIn: 604800 }),
      }
    );
    if (!sg.ok) {
      console.error("sign", sg.status);
      return json({ ok: false, error: "no_file", email: true }, 200);
    }
    const signed = await sg.json();
    const downloadUrl = `${SUPA}/storage/v1${signed.signedURL}`;

    // 3) log the order (idempotent on session id) — best effort
    const cd = s.customer_details || {};
    const cf = Array.isArray(s.custom_fields) ? s.custom_fields : [];
    type CustomField = { key?: string; label?: { custom?: string }; text?: { value?: string } };
    const biz =
      (cf as CustomField[]).find((f) =>
        /compan|business/i.test(f.key || f.label?.custom || "")
      ) || ({} as CustomField);
    await fetch(`${SUPA}/rest/v1/pro_orders?on_conflict=stripe_session_id`, {
      method: "POST",
      headers: {
        apikey: SVC,
        Authorization: `Bearer ${SVC}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify([
        {
          stripe_session_id: sessionId,
          slug,
          customer_email: cd.email || null,
          customer_name: cd.name || null,
          business_name: biz?.text?.value || null,
          amount_total: s.amount_total || null,
          currency: s.currency || null,
        },
      ]),
    }).catch(() => {});

    // 4) close the loop on the /pipeline brand — mark the PRO pitch purchased (best effort)
    await fetch(
      `${SUPA}/rest/v1/pipeline_brands?pro_pitch_slug=eq.${encodeURIComponent(slug)}`,
      {
        method: "PATCH",
        headers: {
          apikey: SVC,
          Authorization: `Bearer ${SVC}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ pro_pitch_status: "purchased" }),
      }
    ).catch(() => {});

    return json({ ok: true, download_url: downloadUrl, slug, brand: slug }, 200);
  } catch (e) {
    console.error("deliver error", e);
    return json({ ok: false, error: "error" }, 500);
  }
}
