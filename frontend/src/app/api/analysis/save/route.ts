import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    // Get current user session
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      imageUrl,
      dripScore,
      colorHarmony,
      outfitBalance,
      styleConfidence,
      styleTypes,
      proportions,
      fitBalance,
      suggestions,
      dominantColors,
    } = body

    // Validate required fields
    if (!dripScore || !styleTypes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const analysis = await prisma.analysis.create({
      data: {
        userId: session.user.id,
        imageUrl: imageUrl || null,
        dripScore,
        colorHarmony,
        outfitBalance,
        styleConfidence,
        styleTypes,
        proportions,
        fitBalance,
        suggestions,
        dominantColors,
      },
    })

    return NextResponse.json(
      { message: "Analysis saved", id: analysis.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Save analysis error:", error)
    return NextResponse.json(
      { error: "Failed to save analysis" },
      { status: 500 }
    )
  }
}