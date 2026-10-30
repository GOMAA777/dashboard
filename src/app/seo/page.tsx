import { redirect } from "next/navigation";

export default function SeoRedirectPage() {
  redirect("/website-settings?tab=seo");
}
