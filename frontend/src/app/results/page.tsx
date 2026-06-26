import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResultClient from "./ResultClient";


export default async function ResultPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <ResultClient user={session.user} />
}