"use client";

/*
  Homepage draft v6 — "one sentence" split-screen scrollytelling.
  Motion (framer-motion) pass: spring FLIP reorder on the results grid,
  shared-element morph (your pack: SERP card → PDP hero, layoutId),
  AnimatePresence scene transitions, staggered card entrances, spring
  bars. Right half is a dense stylized-real Amazon browser: persistent
  dark chrome + department strip, filter rail, 3-col results cropped
  mid-scroll; consoles (ads/inventory/P&L) on a gray seller ground.
  Black / white / Amazon orange #FF9900 as mark color only.
  NO founder identity. Personal-stat bullet ("10+ years") kept by
  Devon's explicit call 2026-08-13. Figures illustrative. No Amazon
  logos/wordmarks. Copy traces to Strategy/BRANDSCRIPT.md.
*/

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
} from "motion/react";

const BOOK_HREF =
  "mailto:hello@virtuouscommerce.com?subject=Amazon%20channel%20call";

const FRAGMENTS = [
  <>We are an <em>Amazon</em>&nbsp;agency&#8230;</>,
  <>
    …that helps customers <em>find</em> your brand
  </>,
  <>
    …then turns more of them into <em>buyers</em>
  </>,
  <>
    …keeps your advertising <em>profitable</em>
  </>,
  <>
    …and your inventory <em>lean</em>
  </>,
  <>
    …until Amazon is your most <em>predictable</em>&nbsp;channel.
  </>,
];

const BULLETS: string[][] = [
  ["10+ years of Amazon experience", "Based in Seattle", "One senior operator, no handoffs"],
  ["Keyword & SEO strategy", "Organic rank growth", "Full-funnel media"],
  ["Conversion-rate optimization", "Data-driven creative", "Always-on A/B testing"],
  ["Incrementality analysis", "CAC & LTV measurement", "Amazon Marketing Cloud"],
  ["Demand planning", "Seasonality modeling", "FBA fee avoidance"],
  [],
];

const BEATS = [
  "Agency",
  "Discovery",
  "Conversion",
  "Advertising",
  "Inventory",
  "The P&L",
];

const N = FRAGMENTS.length;

type CardData = {
  name: string;
  title: string;
  price: [string, string];
  reviews: string;
  sponsored?: boolean;
  badge?: string;
  bought?: string;
  you?: boolean;
};

const CARDS: CardData[] = [
  {
    name: "a",
    title: "ProFuel Whey Protein Powder, Chocolate, 5 lb",
    price: ["54", "99"],
    reviews: "12,904",
    sponsored: true,
    badge: "Best Seller",
    bought: "2K+ bought in past month",
  },
  {
    name: "b",
    title: "IronPeak 100% Whey Isolate, Unflavored, 3 lb",
    price: ["42", "97"],
    reviews: "8,113",
    badge: "Top Rated",
  },
  {
    name: "c",
    title: "MuscleMax Mass Gainer, Cookies & Cream, 6 lb",
    price: ["36", "49"],
    reviews: "5,867",
    sponsored: true,
  },
  {
    name: "d",
    title: "PlantForm Organic Pea Protein, Vanilla, 1.8 lb",
    price: ["29", "99"],
    reviews: "3,404",
    bought: "1K+ bought in past month",
  },
  {
    name: "y",
    title: "Your Brand — Grass-Fed Whey, Vanilla, 2 lb",
    price: ["39", "95"],
    reviews: "1,213",
    bought: "500+ bought in past month",
    you: true,
  },
  {
    name: "e",
    title: "NutraBlend Collagen Peptides, Unflavored, 16 oz",
    price: ["24", "95"],
    reviews: "9,552",
  },
  {
    name: "f",
    title: "PeakForm Creatine Monohydrate, 500 g",
    price: ["27", "99"],
    reviews: "15,203",
    bought: "3K+ bought in past month",
  },
  {
    name: "g",
    title: "VitaCore Daily Greens & Multivitamin, 120 ct",
    price: ["19", "49"],
    reviews: "22,911",
    sponsored: true,
  },
  {
    name: "h",
    title: "LeanLife Meal Replacement Shake, Chocolate",
    price: ["33", "75"],
    reviews: "4,120",
  },
  {
    name: "i",
    title: "SummitFuel Electrolyte Powder, Citrus, 30 srv",
    price: ["21", "99"],
    reviews: "7,809",
  },
  {
    name: "j",
    title: "PureForm Casein Protein, Vanilla, 2 lb",
    price: ["34", "99"],
    reviews: "2,246",
  },
  {
    name: "k",
    title: "EverGreen Vegan Protein Blend, Chocolate, 2 lb",
    price: ["31", "49"],
    reviews: "6,013",
  },
];

const CARD_BY_NAME = Object.fromEntries(CARDS.map((c) => [c.name, c]));

const ORDER_BURIED = ["a", "b", "c", "d", "y", "e", "f", "g", "h", "i", "j", "k"];
const ORDER_RANKED = ["y", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

const spring = { type: "spring" as const, stiffness: 170, damping: 26 };

const URLS = [
  "amazon.com/s?k=protein+powder",
  "amazon.com/s?k=protein+powder",
  "amazon.com/dp/B0YOURBRND1",
  "mail.virtuouscommerce.com/weekly-recap",
  "mail.virtuouscommerce.com/weekly-recap",
  "mail.virtuouscommerce.com/weekly-recap",
];

function Pack({
  card,
  big,
}: {
  card: CardData;
  big?: boolean;
}) {
  if (card.you) {
    return (
      <motion.img
        src="/packs/y.webp"
        alt=""
        className={`pimg${big ? " pimg-big" : ""}`}
        layoutId="you-pack"
        transition={spring}
      />
    );
  }
  return <img src={`/packs/${card.name}.webp`} alt="" className="pimg" />;
}

function ResultCard({ card, ranked }: { card: CardData; ranked: boolean }) {
  return (
    <motion.div
      layout
      transition={spring}
      className={`card${card.you ? " card-you" : ""}`}
    >
      <div className="card-img">
        <Pack card={card} />
        {card.you && ranked ? (
          <Scan fit label="IMAGE &#183; B+" delay={0.9} />
        ) : null}
      </div>
      <div className="card-body">
        {card.sponsored ? <div className="card-sp">Sponsored</div> : null}
        {card.badge ? <div className="card-badge">{card.badge}</div> : null}
        <div className="card-title">{card.you && ranked ? (
            <Scan fit label="KEYWORDS 9/12" delay={1.15} />
          ) : null}
          {card.title}</div>
        <div className="card-rating">
          <span className="stars">★★★★★</span>
          <span className="count">{card.reviews}</span>
        </div>
        {card.bought ? <div className="card-bought">{card.bought}</div> : null}
        <div className="card-price">
          <span className="sym">$</span>
          {card.price[0]}
          <sup>{card.price[1]}</sup>
        </div>
        <div className="card-ship">FREE delivery Tue, Aug 18</div>
      </div>
      {card.you && ranked ? (
        <motion.span
          className="rank-chip"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring, delay: 0.45 }}
        >
          #1
        </motion.span>
      ) : null}
    </motion.div>
  );
}

function Bar({
  width,
  muted,
  delay = 0.35,
}: {
  width: string;
  muted?: boolean;
  delay?: number;
}) {
  return (
    <div className="bar">
      <motion.i
        className={muted ? "muted" : undefined}
        initial={{ width: 0 }}
        animate={{ width }}
        transition={{ ...spring, delay }}
      />
    </div>
  );
}


function Scan({
  label,
  x,
  y,
  w,
  h,
  fit,
  delay = 0.9,
}: {
  label: string;
  x?: string;
  y?: string;
  w?: string;
  h?: string;
  fit?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className={"scan" + (fit ? " scan-fit" : "")}
      style={fit ? undefined : { left: x, top: y, width: w, height: h }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <span className="scan-lbl">{label}</span>
    </motion.div>
  );
}

function IncrementalityChart() {
  return (
    <svg className="achart" viewBox="0 0 190 80" role="img" aria-label="Incremental sales from advertising growing above the organic baseline">
      <path className="area-muted" d="M8 58 C 60 56, 130 52, 182 50 L182 70 L8 70 Z" />
      <path className="area-accent" d="M8 54 C 60 46, 130 36, 182 28 L182 50 C 130 52, 60 56, 8 58 Z" />
      <text className="lab" x="12" y="68" textAnchor="start">organic</text>
      <text className="lab lab-strong" x="182" y="22" textAnchor="end">+38% incremental</text>
    </svg>
  );
}

function ForecastChart() {
  return (
    <svg className="achart" viewBox="0 0 210 92" role="img" aria-label="Weekly demand forecast with actual units tracking closely">
      <path className="band" d="M10 54 C 60 48, 140 36, 200 28 L200 44 C 140 50, 60 60, 10 64 Z" />
      <path className="ln-dash" d="M10 59 C 60 54, 140 43, 200 36" />
      <path className="ln" d="M10 62 C 45 58, 95 50, 148 44" />
      {[
        [10, 62],
        [45, 57],
        [80, 53],
        [114, 49],
        [148, 44],
      ].map(([cx, cy]) => (
        <circle key={cx} className="dot" cx={cx} cy={cy} r="2.6" />
      ))}
      <text className="lab" x="200" y="30" textAnchor="end">forecast</text>
      <text className="lab lab-strong" x="152" y="58" textAnchor="middle">actuals</text>
      {["W28", "W29", "W30", "W31", "W32", "W33"].map((w, i) => (
        <text key={w} className="tick" x={10 + i * 38} y="88" textAnchor="middle">
          {w}
        </text>
      ))}
    </svg>
  );
}

function WaterfallChart() {
  const S = 0.58;
  const cols = [
    { x: 10, top: 100, h: 100, cls: "wf-base", lbl: "Sales" },
    { x: 48, top: 100, h: 36, cls: "wf-drop", lbl: "Fees" },
    { x: 86, top: 64, h: 15, cls: "wf-drop", lbl: "Ads" },
    { x: 124, top: 49, h: 28.5, cls: "wf-drop", lbl: "COGS" },
    { x: 162, top: 20.5, h: 20.5, cls: "wf-end", lbl: "CM" },
  ];
  return (
    <svg className="achart" viewBox="0 0 200 92" role="img" aria-label="Contribution waterfall from sales to a 20.5 percent margin">
      <line className="ax" x1="6" y1="80" x2="194" y2="80" />
      {cols.map((c) => (
        <rect key={c.lbl} className={c.cls} x={c.x} width="28" y={80 - c.top * S} height={c.h * S} rx="2" />
      ))}
      {cols.map((c) => (
        <text key={c.lbl} className="tick" x={c.x + 14} y="89" textAnchor="middle">
          {c.lbl}
        </text>
      ))}
      <text className="lab lab-strong" x="176" y={80 - 20.5 * 0.58 - 5} textAnchor="middle">
        20.5%
      </text>
    </svg>
  );
}

function TrendChart() {
  return (
    <svg className="achart trend" viewBox="0 0 190 48" role="img" aria-label="Contribution margin trending up over six months">
      <line className="ax" x1="6" y1="38" x2="184" y2="38" />
      <path className="ln" d="M10 32 C 40 31, 70 27, 100 25 C 130 23, 152 18, 174 12" />
      <circle className="dot" cx="174" cy="12" r="2.6" />
      <text className="lab lab-strong" x="172" y="8" textAnchor="middle">20.5%</text>
      <text className="tick" x="10" y="46" textAnchor="start">Mar</text>
      <text className="tick" x="184" y="46" textAnchor="end">Aug</text>
    </svg>
  );
}

function LtvChart() {
  /* AMC-style: share of 12-mo customers by purchase-frequency bucket */
  return (
    <svg className="achart" viewBox="0 0 190 88" role="img" aria-label="Share of customers by twelve month purchase frequency">
      <line className="ax" x1="6" y1="70" x2="184" y2="70" />
      <rect className="wf-drop" x="16" y="24.2" width="30" height="45.8" rx="2" />
      <rect className="wf-end" x="60" y="48.9" width="30" height="21.1" rx="2" />
      <rect className="wf-end" x="104" y="56.8" width="30" height="13.2" rx="2" />
      <rect className="wf-end" x="148" y="62.1" width="30" height="7.9" rx="2" />
      <text className="lab" x="31" y="19" textAnchor="middle">52%</text>
      <text className="lab lab-strong" x="75" y="44" textAnchor="middle">24%</text>
      <text className="lab lab-strong" x="119" y="52" textAnchor="middle">15%</text>
      <text className="lab lab-strong" x="163" y="57" textAnchor="middle">9%</text>
      <text className="tick" x="31" y="80" textAnchor="middle">1&#215;</text>
      <text className="tick" x="75" y="80" textAnchor="middle">2&#215;</text>
      <text className="tick" x="119" y="80" textAnchor="middle">3&#8211;4&#215;</text>
      <text className="tick" x="163" y="80" textAnchor="middle">5&#215;+</text>
      <text className="lab lab-strong" x="184" y="10" textAnchor="end">48% repeat &#8593;</text>
    </svg>
  );
}

function MailScene({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mailv">
      <div className="mail-head">
        <div className="mail-subj">Weekly recap — Week 33</div>
        <div className="mail-meta">
          <span className="mail-avatar">V</span>
          <b>Virtuous Commerce</b>
          <span className="mail-addr">&lt;hello@virtuouscommerce.com&gt;</span>
          <span className="mail-to">to you · Fri 5:02 PM</span>
        </div>
      </div>
      <div className="mail-body">
        <div className="mail-rule" />
        <h3 className="mail-title">{title}</h3>
        {children}
      </div>
      <div className="mail-replybar">
        <span>&#8617; Reply</span>
        <span>&#8618; Forward</span>
      </div>
    </div>
  );
}

const sceneAnim = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.45, ease: [0.2, 0.65, 0.25, 1] as const },
};

function Panel({
  cap,
  chip,
  children,
}: {
  cap: string;
  chip: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="panel"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.15 }}
    >
      <div className="panel-cap">{cap}</div>
      {children}
      <motion.span
        className="chip"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      >
        {chip}
      </motion.span>
    </motion.div>
  );
}

export default function V6Home() {
  const [stage, setStage] = useState(0);
  const [booking, setBooking] = useState(false);
  const [sent, setSent] = useState(false);
  const stageRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = trackRef.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        if (total <= 0) return;
        const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
        const s = Math.min(N - 1, Math.floor(p * N));
        stageRef.current = s;
        setStage(s);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const jumpTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (total * (i + 0.5)) / N,
      behavior: "smooth",
    });
  };

  /* One wheel gesture = one beat. Only intercepts while the show is
     pinned; releases to native scroll past the last beat (footer) and
     before the first. Lock absorbs trackpad momentum. */
  useEffect(() => {
    const lock = { on: false };
    const onWheel = (e: WheelEvent) => {
      const el = trackRef.current;
      if (!el || e.ctrlKey) return;
      const r = el.getBoundingClientRect();
      if (r.top > 1 || r.bottom < window.innerHeight - 1) return;
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      if (!dir) return;
      const next = stageRef.current + dir;
      if (next < 0 || next > N - 1) return;
      e.preventDefault();
      if (lock.on || Math.abs(e.deltaY) < 8) return;
      lock.on = true;
      const top = r.top + window.scrollY;
      const total = el.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: top + (total * (next + 0.5)) / N,
        behavior: "smooth",
      });
      window.setTimeout(() => {
        lock.on = false;
      }, 1000);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBooking(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submitBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
    setSent(true);
  };

  const ranked = stage !== 0;
  const order = ranked ? ORDER_RANKED : ORDER_BURIED;

  return (
    <MotionConfig reducedMotion="user">
      <button className="btn btn-nav" onClick={() => setBooking(true)}>
        Book a call
      </button>

      <div
        className="track"
        ref={trackRef}
        style={{ height: `${N * 100 + 12}vh` }}
      >
        <div className="pin" data-stage={stage}>
          {/* ---------- left: the sentence ---------- */}
          <div className="left">
            <nav className="rail" aria-label="Sections">
              {BEATS.map((b, i) => (
                <button
                  key={i}
                  className={`rail-item${i === stage ? " on" : ""}`}
                  onClick={() => jumpTo(i)}
                >
                  <span className="rail-no">{String(i).padStart(2, "0")}</span>
                  <span className="rail-lbl">{b}</span>
                </button>
              ))}
            </nav>

            <div className="left-main">
              <h1>Virtuous Commerce</h1>
              <div className="statements" aria-live="polite">
                {FRAGMENTS.map((frag, i) => (
                  <div
                    key={i}
                    className={`frame${i === stage ? " active" : ""}`}
                    aria-hidden={i !== stage}
                  >
                    <h2>{frag}</h2>
                    {BULLETS[i].length > 0 ? (
                      <ul className="bullets">
                        {BULLETS[i].map((b, j) => (
                          <li key={j} style={{ "--i": j } as React.CSSProperties}>
                            {b}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className={`cta${stage === N - 1 ? " show" : ""}`}>
                <button
                  className="btn"
                  onClick={() => setBooking(true)}
                  tabIndex={stage === N - 1 ? 0 : -1}
                >
                  Book a call <span className="arrow">→</span>
                </button>
              </div>
            </div>

            <div className="baseline">
              <a href="mailto:hello@virtuouscommerce.com">
                hello@virtuouscommerce.com
              </a>
              <span>Independent Amazon agency</span>
            </div>
          </div>

          {/* ---------- right: the Amazon browser ---------- */}
          <div className="right" aria-hidden="true">
            <i className="floor" aria-hidden="true" />
            <div className="laptop">
              <div className="lid">
                <div className="browser">
              {/* browser chrome with per-beat URL */}
              <div className="chrome">
                <span className="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <div className="url">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={URLS[stage]}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      {URLS[stage]}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="chrome-spacer" aria-hidden="true" />
              </div>

              {/* site chrome: Amazon for shopper beats only */}
              {stage <= 2 ? (
                <>
                  <div className="s-header">
                    <span className="s-menu">☰</span>
                    <div className="s-bar">
                      <span className="s-q">protein powder</span>
                      <span className="s-go">⌕</span>
                    </div>
                    <span className="s-cart">
                      <i />
                    </span>
                  </div>
                  <div className="s-subnav">
                    <span className="on">All</span>
                    <span>Sports Nutrition</span>
                    <span>Protein Powders</span>
                    <span>Best Sellers</span>
                    <span>New Arrivals</span>
                    <span>Deals</span>
                  </div>
                </>
              ) : null}

              <div className="viewport">
                <LayoutGroup>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {/* scene: search results (stages 0-1) */}
                    {stage <= 1 ? (
                      <motion.div key="serp" className="scene scene-serp" {...sceneAnim}>
                        <div className="s-meta">
                          1–48 of over 4,000 results for{" "}
                          <span className="s-term">&quot;protein powder&quot;</span>
                        </div>
                        {stage === 1 ? (
                          <motion.div
                            className="sb-banner"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                          >
                            <span className="sb-sp">Sponsored</span>
                            <span className="sb-thumb">
                              <img src="/packs/y.webp" alt="" />
                            </span>
                            <span className="sb-txt">
                              <b>YOUR BRAND</b>
                              <span>Grass-fed whey. Clean label. Single origin.</span>
                            </span>
                            <span className="sb-cta">Shop now</span>
                          </motion.div>
                        ) : null}
                        <div className="serp-body">
                          <div className="filters">
                            <div className="f-group">
                              <div className="f-head">Department</div>
                              <div className="f-item on">Protein Powders</div>
                              <div className="f-item">Sports Nutrition</div>
                            </div>
                            <div className="f-group">
                              <div className="f-head">Brand</div>
                              {["Your Brand", "ProFuel", "IronPeak", "MuscleMax", "PlantForm"].map(
                                (b, i) => (
                                  <div key={b} className="f-check">
                                    <i className={i === 0 ? "checked" : undefined} />
                                    {b}
                                  </div>
                                )
                              )}
                            </div>
                            <div className="f-group">
                              <div className="f-head">Avg. review</div>
                              <div className="f-item">
                                <span className="stars">★★★★</span> &amp; up
                              </div>
                              <div className="f-item">
                                <span className="stars">★★★</span> &amp; up
                              </div>
                            </div>
                            <div className="f-group">
                              <div className="f-head">Price</div>
                              <div className="f-item">Under $25</div>
                              <div className="f-item">$25 to $50</div>
                              <div className="f-item">$50 &amp; above</div>
                            </div>
                          </div>
                          <div className="results">
                            <div className="grid">
                              {order.map((name) => (
                                <ResultCard
                                  key={name}
                                  card={CARD_BY_NAME[name]}
                                  ranked={ranked}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                      </motion.div>
                    ) : null}

                    {/* scene: the product page (stage 2) */}
                    {stage === 2 ? (
                      <motion.div key="pdp" className="scene scene-pdp" {...sceneAnim}>
                        <div className="pdp-grid">
                          <div className="pdp-left">
                            <div className="thumbs">
                              {["y", "y2", "y3", "y4"].map((t, ti) => (
                                <span key={t} className={"thumb" + (ti === 0 ? " on" : "")}>
                                  <img src={"/packs/" + t + ".webp"} alt="" />
                                </span>
                              ))}
                              <Scan fit label="GALLERY &#183; REBUILT &#215;7" delay={0.9} />
                            </div>
                            <div className="pdp-img">
                              <Pack card={CARD_BY_NAME["y"]} big />
                            </div>
                          </div>
                          <div className="pdp-info">
                            <div className="pdp-title">
                              Your Brand — Grass-Fed Whey Protein, Vanilla, 2 lb
                            </div>
                            <div className="pdp-stars">
                              <span className="star-wrap">
                                <span className="base">★★★★★</span>
                                <motion.span
                                  className="fill"
                                  initial={{ width: 0 }}
                                  animate={{ width: "96%" }}
                                  transition={{ duration: 0.9, delay: 0.9, ease: [0.2, 0.65, 0.25, 1] }}
                                >
                                  ★★★★★
                                </motion.span>
                              </span>
                              <span className="count">4.8 · 1,213 ratings</span>
                            </div>
                            <div className="pdp-rule" />
                            <div className="pdp-price">
                              <span className="sym">$</span>39<sup>95</sup>
                            </div>
                            <div className="pdp-ship">
                              FREE delivery <b>Tue, Aug 18</b>
                            </div>
                            <div className="pdp-coupon">Save 5% with coupon</div>
                            <div className="pdp-stock">In Stock</div>
                            <div className="pdp-seller">
                              Ships from Amazon.com &#183; Sold by Your Brand
                            </div>
                            <div className="buywrap">
                              <div className="buy-cart">Add to Cart</div>
                            <div className="buy-now">Buy Now</div>
                              <Scan fit label="BUY BOX &#183; 98% WON" delay={1.2} />
                            </div>
                          </div>
                        </div>
                        <motion.span
                          className="chip"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.3, duration: 0.4 }}
                        >
                          Conversion +31%
                        </motion.span>
                      </motion.div>
                    ) : null}

                    {/* your report, in your inbox: advertising (stage 3) */}
                    {stage === 3 ? (
                      <motion.div key="mads" className="scene scene-mail" {...sceneAnim}>
                        <MailScene title="Advertising">
                          <div className="stat3">
                            <div className="stile"><b>$61.8K</b><span>Ad spend</span></div>
                            <div className="stile"><b>$284K</b><span>Ad sales</span></div>
                            <div className="stile"><b>4.6</b><span>Blended ROAS</span></div>
                          </div>
                          <div className="mail-cols">
                            <div>
                              <div className="m-sec mt0">Incrementality &#183; AMC</div>
                              <IncrementalityChart />
                              <div className="kv"><span>TACoS</span><b>8.9% &#8595;</b></div>
                              <div className="kv"><span>Wasted spend paused</span><b>$4.2K</b></div>
                            </div>
                            <div>
                              <div className="m-sec mt0">Purchase frequency &#183; AMC</div>
                              <LtvChart />
                              <div className="kv"><span>CAC</span><b>$18</b></div>
                              <div className="kv"><span>LTV : CAC</span><b>7.9&#215;</b></div>
                            </div>
                          </div>
                        </MailScene>
                      </motion.div>
                    ) : null}

                    {/* your report, in your inbox: demand plan (stage 4) */}
                    {stage === 4 ? (
                      <motion.div key="mops" className="scene scene-mail" {...sceneAnim}>
                        <MailScene title="Demand plan">
                          <div className="stat3">
                            <div className="stile"><b>100%</b><span>In-stock rate</span></div>
                            <div className="stile"><b>9 wks</b><span>Cover &#183; was 22</span></div>
                            <div className="stile"><b>4.2%</b><span>Forecast error</span></div>
                          </div>
                          <div className="mail-cols">
                            <div>
                              <div className="m-sec mt0">Forecast vs actuals</div>
                              <ForecastChart />
                              <div className="kv"><span>Sell-through, 30d</span><b>94%</b></div>
                              <div className="kv"><span>Stockout days, 90d</span><b>0</b></div>
                            </div>
                            <div>
                              <div className="m-sec mt0">Cover by SKU</div>
                              <div className="mrowkv"><span>Vanilla &#183; 2 lb</span><span className="mbar"><i style={{ width: "46%" }} /></span><b>9.2 wks</b></div>
                              <div className="mrowkv"><span>Chocolate &#183; 2 lb</span><span className="mbar"><i style={{ width: "43%" }} /></span><b>8.7 wks</b></div>
                              <div className="mrowkv"><span>Unflavored &#183; 3 lb</span><span className="mbar"><i style={{ width: "57%" }} /></span><b>11.4 wks</b></div>
                              <div className="m-sec">Storage fees &#183; Aug</div>
                              <div className="bullet">
                                <div className="b-track">
                                  <i className="b-actual" style={{ width: "58%" }} />
                                  <i className="b-target" style={{ left: "80%" }} />
                                </div>
                                <div className="b-lbls">
                                  <span>$1.8K actual</span>
                                  <b>target $2.4K</b>
                                </div>
                              </div>
                              <div className="m-sec">Inbound</div>
                              <div className="mrowkv"><span>PO-1182 &#183; 2,400 units</span><b>Sep 2</b></div>
                              <div className="mrowkv"><span>Removal &#183; 380 aged units</span><b>filed</b></div>
                            </div>
                          </div>
                        </MailScene>
                      </motion.div>
                    ) : null}

                    {/* your report, in your inbox: the P&L (stage 5) */}
                    {stage === N - 1 ? (
                      <motion.div key="mpnl" className="scene scene-mail" {...sceneAnim}>
                        <MailScene title="Channel P&L">
                          <div className="stat3">
                            <div className="stile"><b>$412K</b><span>Sales &#183; +6.2%</span></div>
                            <div className="stile"><b>$84.4K</b><span>Contribution</span></div>
                            <div className="stile"><b>20.5%</b><span>Margin &#183; +0.8 pt</span></div>
                          </div>
                          <div className="mail-cols">
                            <div>
                              <div className="m-sec mt0">Channel ledger</div>
                              {[
                                ["Sales", "$412,180", "+6.2%"],
                                ["Amazon fees", "\u2212$148,384", ""],
                                ["Advertising", "\u2212$61,827", "\u22124.1%"],
                                ["Product cost", "\u2212$117,555", ""],
                              ].map(([lbl, val, d], i) => (
                                <motion.div
                                  key={lbl}
                                  className="ledger-row"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.35 + i * 0.14, duration: 0.35 }}
                                >
                                  <span className="lbl">{lbl}</span>
                                  <span className="leader" />
                                  <span className="val">
                                    {val}
                                    {d ? <span className="delta">{d}</span> : null}
                                  </span>
                                </motion.div>
                              ))}
                              <motion.div
                                className="ledger-row total"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.0, duration: 0.35 }}
                              >
                                <span className="lbl">Contribution</span>
                                <span className="leader" />
                                <span className="val">
                                  $84,414 <span className="tag">20.5%</span>
                                </span>
                              </motion.div>
                              <div className="m-sec">Operator notes</div>
                              <div className="mrowkv"><span>Held price through competitor drop</span><b>Wed</b></div>
                              <div className="mrowkv"><span>Coupon test (5%) shipped</span><b>Fri</b></div>
                              <div className="mrowkv"><span>Wk-36 purchase order placed</span><b>Tue</b></div>
                            </div>
                            <div>
                              <div className="m-sec mt0">Contribution waterfall</div>
                              <WaterfallChart />
                              <div className="m-sec">Contribution % &#183; 6 months</div>
                              <TrendChart />
                            </div>
                          </div>
                        </MailScene>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </LayoutGroup>
              </div>
                </div>
              </div>
              <div className="deck" />
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <span>© 2026 Virtuous Commerce</span>
        <span className="sep">·</span>
        <a href="mailto:hello@virtuouscommerce.com">
          hello@virtuouscommerce.com
        </a>
        <span className="sep">·</span>
        <span className="note">
          Figures illustrative. Not affiliated with or endorsed by Amazon.com, Inc.
        </span>
      </footer>

      <AnimatePresence>
        {booking ? (
          <motion.div
            className="modal-back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBooking(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, y: 26, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14 }}
              transition={spring}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Book a call"
            >
              {sent ? (
                <div className="modal-done">
                  <span className="modal-check">✓</span>
                  <h3>Got it.</h3>
                  <p>
                    You’ll hear from us within one business day — an honest
                    read on where your channel stands, no pitch deck.
                  </p>
                  <button className="btn modal-close" onClick={() => setBooking(false)}>
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <h3>Book a call</h3>
                  <p className="modal-sub">
                    Tell us where Amazon stands for you. Thirty minutes, an
                    honest read — you’ll hear back within one business day.
                  </p>
                  <form onSubmit={submitBooking}>
                    <label>
                      Name
                      <input name="name" type="text" required autoFocus />
                    </label>
                    <label>
                      Email
                      <input name="email" type="email" required />
                    </label>
                    <label>
                      Brand or website
                      <input name="brand" type="text" />
                    </label>
                    <label>
                      Anything we should know?
                      <textarea name="note" rows={3} />
                    </label>
                    <button className="btn modal-submit" type="submit">
                      Request a call <span className="arrow">→</span>
                    </button>
                  </form>
                  <div className="modal-alt">
                    Prefer email? <a href={BOOK_HREF}>hello@virtuouscommerce.com</a>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MotionConfig>
  );
}
