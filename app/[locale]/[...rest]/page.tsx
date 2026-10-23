import { notFound } from "next/navigation";

// Routes unknown paths to the localised not-found page.
export default function CatchAll() {
  notFound();
}
