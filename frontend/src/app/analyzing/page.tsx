import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AnalyzingClient from "./AnalyzingClient";

export default async function AnalyzingPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // If you reach here → user is authenticated
  return <AnalyzingClient user={session.user} />;
}