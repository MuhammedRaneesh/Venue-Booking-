import { redirect } from "next/navigation";

export default function MyVenueRedirectPage() {
  redirect("/owner/venues");
}
