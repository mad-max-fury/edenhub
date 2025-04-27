import { NextRequest, NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";

export async function POST(request: NextRequest) {
  try {
    const { src } = await request.json();

    if (!src) {
      return NextResponse.json(
        { error: "Image source is required" },
        { status: 400 }
      );
    }

    const buffer = await fetch(src).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );

    const {
      metadata: { height, width },
      ...plaiceholder
    } = await getPlaiceholder(buffer, { size: 10 });

    return NextResponse.json({
      ...plaiceholder,
      img: { src, height, width },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
