import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { resend } from "@/lib/resend"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validate
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Validate name
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      )
    }

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Existing user check
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
      },
    });

    const verifyUrl =
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify?token=${verificationToken}`

    try {
      await resend.emails.send({
        from: "FitCheck AI <onboarding@resend.dev>",
        to: email,
        subject: "Verify your FitCheck AI account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to FitCheck AI 👋</h2>

            <p>Thanks for signing up.</p>

            <p>Please verify your email address by clicking the button below:</p>

            <a
              href="${verifyUrl}"
              style="
                display:inline-block;
                padding:12px 20px;
                background:#9b5de5;
                color:white;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
              "
            >
              Verify Email
            </a>

            <p style="margin-top:20px;">
              If you did not create this account, you can safely ignore this email.
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)

      await prisma.user.delete({
        where: {
          id: user.id,
        },
      })

      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message:
          "Account created successfully. Please check your email to verify your account.",
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Register error:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}