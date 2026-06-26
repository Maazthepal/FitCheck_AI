import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CompareClient from "./CompareClient";

export default async function ComparePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // If you reach here → user is authenticated
  return <CompareClient user={session.user} />;
}