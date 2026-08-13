/*
  "Book a call" form handler: stores submissions in the Virtuous Commerce
  Supabase project (public.site_booking_requests, insert-only via RLS).
  Env: SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY in .env.local.
  Optional later: notification email (Resend) on top of the insert.
*/
export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const name = String(data.name ?? "").slice(0, 200).trim();
  const email = String(data.email ?? "").slice(0, 320).trim();
  const brand = String(data.brand ?? "").slice(0, 300).trim();
  const note = String(data.note ?? "").slice(0, 4000).trim();

  if (!name || !email.includes("@")) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL ?? "https://qcbqpuooybnernorbhtv.supabase.co";
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    "sb_publishable_TV5q7BFAZzPqb02Pjq0lbg_Jg4IEKnY"; /* publishable: safe to ship, RLS-guarded */
  if (!url || !key) {
    console.error("[book-a-call] missing Supabase env");
    return Response.json({ ok: false }, { status: 500 });
  }

  const res = await fetch(`${url}/rest/v1/site_booking_requests`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name, email, brand: brand || null, note: note || null }),
  });

  if (!res.ok) {
    console.error("[book-a-call] insert failed", res.status, await res.text());
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}
