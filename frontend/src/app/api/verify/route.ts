// app/api/verify/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { 
        verificationToken: token,
        verificationTokenExpires: { gt: new Date() }   // Not expired
      },
    });

    if (!user) {
      return NextResponse.json({ 
        error: "Invalid or expired verification link. Please register again." 
      }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    console.log(`✅ Email verified: ${user.email}`);

    return NextResponse.redirect(new URL("/login?verified=true", req.url));

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}