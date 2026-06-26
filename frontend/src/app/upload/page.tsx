// app/upload/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UploadClient from "./UploadClient";

export default async function UploadPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // If you reach here → user is authenticated
  return <UploadClient user={session.user} />;
}