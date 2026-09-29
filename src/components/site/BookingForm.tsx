import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { createAppointment } from "@/lib/api/bookings.ts";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { useSite } from "@/lib/site-context.tsx";
import { str, waLink } from "@/lib/data.ts";
import { TIME_SLOTS } from "@/lib/site-utils.ts";
import { btnClass } from "./button-3d.ts";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  service: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  message: z.string().max(1000).optional(),
});
type Values = z.infer<typeof schema>;

export default function BookingForm() {
  const { t, L, data, site, preview } = useSite();
  const [done, setDone] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", service: "", date: "", time: "", message: "" },
  });
  const { register, handleSubmit, setValue, watch, formState } = form;
  const { errors, isSubmitting } = formState;
  const v = watch();
  const services = data.items.service ?? [];
  const today = new Date().toISOString().slice(0, 10);

  const text = () =>
    `${t("whatsappGreeting")}\n${v.name}\n${v.phone}\n${v.service}\n${v.date} ${v.time}\n${v.message ?? ""}`;

  const onSubmit = async (values: Values) => {
    if (preview) {
      toast.info(t("previewOnly"));
      return;
    }
    try {
      await createAppointment(values);
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

  const err = (k: keyof Values) =>
    errors[k] ? <p className="text-xs text-destructive">{t("invalid")}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-[var(--radius)] border border-border bg-card p-5 shadow-[var(--t-shadow)] @2xl:p-8" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="b-name">{t("name")}</Label>
        <Input id="b-name" placeholder="Priya Shah" autoComplete="name" {...register("name")} />
        {err("name")}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="b-phone">{t("phone")}</Label>
        <Input id="b-phone" inputMode="numeric" maxLength={10} placeholder="9876543210" autoComplete="tel" {...register("phone")} />
        {err("phone")}
      </div>
      <div className="grid gap-1.5">
        <Label>{t("service")}</Label>
        <Select value={v.service} onValueChange={(x) => setValue("service", x, { shouldValidate: true })}>
          <SelectTrigger className="w-full"><SelectValue placeholder={t("selectService")} /></SelectTrigger>
          <SelectContent>
            {services.map((s) => (
              <SelectItem key={s._id} value={L(s.data.name)}>{L(s.data.name)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {err("service")}
      </div>
      <div className="grid gap-4 @md:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="b-date">{t("date")}</Label>
          <Input id="b-date" type="date" min={today} {...register("date")} />
          {err("date")}
        </div>
        <div className="grid gap-1.5">
          <Label>{t("time")}</Label>
          <Select value={v.time} onValueChange={(x) => setValue("time", x, { shouldValidate: true })}>
            <SelectTrigger className="w-full"><SelectValue placeholder={t("selectTime")} /></SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
          {err("time")}
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="b-msg">{t("message")}</Label>
        <Textarea id="b-msg" rows={3} {...register("message")} />
      </div>
      <div className="flex flex-col gap-3 @md:flex-row">
        <button type="submit" disabled={isSubmitting} className={btnClass("primary", "flex-1")}>
          {isSubmitting ? t("sending") : t("submitBooking")}
        </button>
        <a
          href={waLink(str(site.whatsapp), text())}
          target="_blank"
          rel="noreferrer"
          onClick={preview ? (e) => e.preventDefault() : undefined}
          className={btnClass("secondary", "flex-1")}
        >
          <MessageCircle className="size-4" />
          {t("sendWhatsapp")}
        </a>
      </div>
    </form>
  );
}
