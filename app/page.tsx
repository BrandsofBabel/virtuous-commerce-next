import type { Metadata } from "next";
import "./_home/v6d.css";
import Home from "./_home/page";

export const metadata: Metadata = {
  title: "Virtuous Commerce | Amazon Agency",
  description:
    "Virtuous Commerce is an Amazon agency: we get your brand found, turn shoppers into buyers, and keep ads profitable and inventory lean. Amazon, run properly.",
};

export default function Page() {
  return (
    <div className="v6d">
      <Home />
    </div>
  );
}
