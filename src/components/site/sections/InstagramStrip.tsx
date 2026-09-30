import { Camera } from "lucide-react";
import { useSite } from "@/lib/site-context.tsx";
import { str } from "@/lib/data.ts";
import { btnClass } from "../button-3d.ts";
import Img from "../Img.tsx";
import Section from "../Section.tsx";

// Uses gallery photos as an Instagram-style strip linking to the salon's profile
export default function InstagramStrip() {
  const { data, site, L, preview } = useSite();
  const link = str(site.instagram);
  const photos = (data.items.gallery ?? []).filter((g) => str(g.data.type) !== "beforeafter" && str(g.data.image)).slice(0, 6);
  if (!link || photos.length === 0) return null;
  return (
    <Section
      id="instagram"
      title={L({ en: "Follow us on Instagram", hi: "इंस्टाग्राम पर फ़ॉलो करें", gu: "ઇન્સ્ટાગ્રામ પર ફોલો કરો" })}
      action={
        <a href={link} target="_blank" rel="noreferrer" onClick={preview ? (e) => e.preventDefault() : undefined} className={btnClass("ghost", "px-3 py-2")}>
          <Camera className="size-4" /> @kalgi_salon
        </a>
      }
    >
      <div className="grid grid-cols-3 gap-2 @2xl:grid-cols-6">
        {photos.map((p) => (
          <a key={p._id} href={link} target="_blank" rel="noreferrer" onClick={preview ? (e) => e.preventDefault() : undefined}
            className="aspect-square cursor-pointer overflow-hidden rounded-[var(--radius)] border border-border transition-transform hover:scale-[1.03]">
            <Img src={str(p.data.image)} alt={L(p.data.alt)} />
          </a>
        ))}
      </div>
    </Section>
  );
}
