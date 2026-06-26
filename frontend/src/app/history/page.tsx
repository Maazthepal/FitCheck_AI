import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // If you reach here → user is authenticated
  return <HistoryClient user={session.user} />;
}