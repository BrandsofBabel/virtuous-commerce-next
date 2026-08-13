// Create a Stripe Checkout Session and redirect to it. Ported from the legacy
// site's api/checkout.js. Replaces the static Payment Link so we control
// success_url -> GUARANTEES ?session_id on the redirect (Payment Links don't
// reliably append it). "Claim the pilot" buttons point here: /api/checkout?slug=<slug>.
// Env: STRIPE_SECRET_KEY.

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const slug = (q.get("slug") || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  const STRIPE = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE) {
    console.error("checkout: missing STRIPE_SECRET_KEY");
    return new Response("Not configured", { status: 500 });
  }

  const base = "https://www.virtuouscommerce.com";
  const p = new URLSearchParams();
  p.append("mode", "payment");
  // SINGLE post-payment redirect for ALL brands (matches the one-field constraint
  // of a Stripe Payment Link). /order-confirmed is a ROUTER: it reads the session's
  // client_reference_id (slug) and forwards the buyer to their per-brand
  // /<slug>-enrolled page. One URL here; per-brand destinations downstream.
  p.append("success_url", base + "/order-confirmed?session_id={CHECKOUT_SESSION_ID}");
  p.append("cancel_url", base + "/" + (slug || ""));
  if (slug) p.append("client_reference_id", slug);
  p.append("line_items[0][quantity]", "1");
  p.append("line_items[0][price_data][currency]", "usd");
  p.append("line_items[0][price_data][unit_amount]", "10000");
  p.append("line_items[0][price_data][product_data][name]", "Shelf Diagnosis + Rebuild Pilot");
  // keep the Company-name field for human-readable identification in the dashboard
  p.append("custom_fields[0][key]", "company");
  p.append("custom_fields[0][label][type]", "custom");
  p.append("custom_fields[0][label][custom]", "Company name");
  p.append("custom_fields[0][type]", "text");

  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: p.toString(),
    });
    const s = await r.json();
    if (!r.ok || !s.url) {
      console.error("checkout create failed", s.error || r.status);
      return new Response("Checkout error", { status: 502 });
    }
    return new Response(null, { status: 303, headers: { Location: s.url } });
  } catch (e) {
    console.error("checkout error", e);
    return new Response("Error", { status: 500 });
  }
}
