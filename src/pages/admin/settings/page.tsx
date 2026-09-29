import { useState } from "react";
import { setSetting } from "@/lib/api/admin.ts";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import type { Rec } from "@/lib/data.ts";
import PageHeader from "../_components/PageHeader.tsx";
import FieldsForm from "../_components/FieldsForm.tsx";
import { SETTINGS_FIELDS } from "../_lib/fields.ts";
import { useAct } from "../_lib/use-admin.ts";
import { useSiteData } from "../_lib/use-site-data.ts";

function SettingForm({ settingKey, initial }: { settingKey: string; initial: Rec }) {
  const act = useAct();
  const [draft, setDraft] = useState<Rec>(initial);
  const conf = SETTINGS_FIELDS[settingKey];
  return (
    <div className="grid gap-4">
      {settingKey === "site" && (
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label htmlFor="demo">Demo mode</Label>
            <p className="text-xs text-muted-foreground">Shows a demo ribbon and hides the site from Google. Turn off when you go live.</p>
          </div>
          <Switch id="demo" checked={draft.demoMode !== false} onCheckedChange={(c) => setDraft({ ...draft, demoMode: c })} />
        </div>
      )}
      <FieldsForm fields={conf.fields} value={draft} onChange={setDraft} />
      <Button className="w-fit" onClick={() => void act(() => setSetting(settingKey, draft))}>Save {conf.label.toLowerCase()}</Button>
    </div>
  );
}

export default function SettingsPage() {
  const data = useSiteData();
  const keys = Object.keys(SETTINGS_FIELDS);
  return (
    <>
      <PageHeader title="Site settings" />
      {data === undefined ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Tabs defaultValue="site">
          <TabsList className="h-auto flex-wrap">
            {keys.map((k) => <TabsTrigger key={k} value={k} className="cursor-pointer">{SETTINGS_FIELDS[k].label}</TabsTrigger>)}
          </TabsList>
          {keys.map((k) => (
            <TabsContent key={k} value={k} className="pt-4">
              <SettingForm settingKey={k} initial={data.settings[k] ?? {}} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </>
  );
}
