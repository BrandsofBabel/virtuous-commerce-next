// Serve a PRO prospect landing page from Supabase (pro_landing_pages).
// Ported from the legacy site's api/p.js (vercel.json rewrote /:slug there);
// here the dynamic segment plays that role — static files and explicit routes
// win first, everything else tries Supabase. Only published rows are served
// (RLS also enforces this with the publishable key). Private pages: noindex.

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: raw } = await params;
  const slug = (raw || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!slug) return new Response("Not found", { status: 404 });

  const SUPABASE_URL =
    process.env.SUPABASE_URL ?? "https://qcbqpuooybnernorbhtv.supabase.co";
  const KEY =
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    "sb_publishable_TV5q7BFAZzPqb02Pjq0lbg_Jg4IEKnY"; /* publishable: safe to ship, RLS-guarded */

  try {
    const url =
      `${SUPABASE_URL}/rest/v1/pro_landing_pages` +
      `?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=html&limit=1`;
    const r = await fetch(url, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    });
    if (!r.ok) {
      console.error("Supabase error", r.status);
      return new Response("Upstream error", { status: 502 });
    }
    const rows = (await r.json()) as Array<{ html?: string }>;
    if (!Array.isArray(rows) || rows.length === 0 || !rows[0].html) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(rows[0].html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    console.error("landing fn error", e);
    return new Response("Error", { status: 500 });
  }
}
