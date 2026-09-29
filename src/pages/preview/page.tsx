import ThemeShowcase from "@/components/preview/ThemeShowcase.tsx";

export default function PreviewPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-4 bg-background p-4 text-foreground @container md:p-8">
      <h1 className="text-3xl font-bold">Theme preview</h1>
      <p className="text-muted-foreground">
        Five themes, six screens each. Built from the same components as the real site.
      </p>
      <ThemeShowcase />
    </div>
  );
}
