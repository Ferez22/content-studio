import Image from "next/image";
import { useTranslations } from "next-intl";
import { IconArrowUpRight, IconBrandLinkedin, IconMail } from "@tabler/icons-react";
import { site } from "@/lib/site";

const linkClassName =
  "inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white underline underline-offset-4";

// Author box at the end of each article: bio, links, and QR codes for readers on a
// desktop who want to continue on their phone (hidden on phones, where links do the job).
export const AuthorCard = () => {
  const t = useTranslations("blog");
  const tFounder = useTranslations("home.team.founder");
  const tFooter = useTranslations("footer");

  const qrCodes = [
    { src: "/qr/newsletter.png", label: t("qrNewsletter"), width: 318, height: 318 },
    { src: "/qr/business-card.svg", label: t("qrCard"), width: 512, height: 512 },
  ];

  return (
    <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-6 md:p-8">
      <div className="flex gap-4 items-start">
        <Image
          src="/team/fares-aouani-cherif.jpeg"
          alt={tFounder("photoAlt")}
          width={800}
          height={800}
          className="size-16 shrink-0 rounded-xl object-cover object-top ring-1 ring-black/10 dark:ring-white/10"
        />
        <div>
          <p className="font-bold">{t("authorName")}</p>
          <p className="text-sm text-neutral-500">{t("authorRole")}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">{tFounder("bio")}</p>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-x-6 gap-y-3">
        <a href={site.founderCard} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          <IconArrowUpRight className="size-4" />
          {t("authorCardLink")}
        </a>
        <a href={site.founderLinkedin} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          <IconBrandLinkedin className="size-4" />
          {t("authorLinkedin")}
        </a>
        <a href="#newsletter" className={linkClassName}>
          <IconMail className="size-4" />
          {tFooter("newsletterTitle")}
        </a>
      </div>

      <div className="hidden sm:grid grid-cols-2 gap-4 mt-6">
        {qrCodes.map((qr) => (
          <figure key={qr.src} className="flex items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-black/5">
            {/* QR codes stay black on white in both themes so phone cameras read them. */}
            <Image src={qr.src} alt="" width={qr.width} height={qr.height} className="size-24 shrink-0" />
            <figcaption className="text-sm font-medium text-neutral-800">{qr.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};
