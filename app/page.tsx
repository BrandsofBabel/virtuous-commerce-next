import type { Metadata } from "next";
import "./_home/v6d.css";
import Home from "./_home/page";

export const metadata: Metadata = {
  title: "Virtuous Commerce — an Amazon agency",
  description:
    "Virtuous Commerce is an Amazon agency: we get your brand found, turn shoppers into buyers, keep advertising profitable and inventory lean — until Amazon is your most predictable channel.",
};

export default function Page() {
  return (
    <div className="v6d">
      <Home />
    </div>
  );
}
