import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { createEnquiry } from "@/lib/api/bookings.ts";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { useSite } from "@/lib/site-context.tsx";
import { btnClass } from "./button-3d.ts";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  course: z.string().optional(),
  message: z.string().max(1000).optional(),
});
type Values = z.infer<typeof schema>;

export default function EnquiryForm() {
  const { t, L, data, preview } = useSite();
  const [done, setDone] = useState(false);
  const { register, handleSubmit, setValue, watch, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", course: "any", message: "" },
  });
  const course = watch("course");

  const onSubmit = async (values: Values) => {
    if (preview) {
      toast.info(t("previewOnly"));
      return;
    }
    try {
      await createEnquiry({ ...values, course: values.course === "any" ? undefined : values.course });
      setDone(true);
    } catch {
      toast.error(t("failed"));
    }
  };

  if (done) {
    return (
      <div className="grid place-items-center gap-3 rounded-[var(--radius)] border border-border bg-card p-8 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="text-balance">{t("bookingThanks")}</p>
      </div>
    );
  }
  const bad = (k: keyof Values) =>
    formState.errors[k] ? <p className="text-xs text-destructive">{t("invalid")}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 rounded-[var(--radius)] border border-border bg-card p-5 shadow-[var(--t-shadow)] @2xl:p-8">
      <div className="grid gap-1.5">
        <Label htmlFor="e-name">{t("name")}</Label>
        <Input id="e-name" placeholder="Riya Patel" {...register("name")} />
        {bad("name")}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="e-phone">{t("phone")}</Label>
        <Input id="e-phone" inputMode="numeric" maxLength={10} placeholder="9876543210" {...register("phone")} />
        {bad("phone")}
      </div>
      <div className="grid gap-1.5">
        <Label>{t("course")}</Label>
        <Select value={course} onValueChange={(x) => setValue("course", x)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t("anyCourse")}</SelectItem>
            {(data.items.course ?? []).map((c) => (
              <SelectItem key={c._id} value={L(c.data.name)}>{L(c.data.name)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="e-msg">{t("message")}</Label>
        <Textarea id="e-msg" rows={3} {...register("message")} />
      </div>
      <button type="submit" disabled={formState.isSubmitting} className={btnClass("primary")}>
        {formState.isSubmitting ? t("sending") : t("enquire")}
      </button>
    </form>
  );
}
