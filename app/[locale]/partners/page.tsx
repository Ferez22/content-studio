import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { partnerProgramEnabled, partnerSlugs } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

// Only one partner type is live, so /partners opens it. Replace with an overview page
// once there are several.
export default async function PartnersPage({ params }: Props) {
  if (!partnerProgramEnabled) notFound();
  const { locale } = await params;
  redirect({ href: `/partners/${partnerSlugs[0]}`, locale });
}
