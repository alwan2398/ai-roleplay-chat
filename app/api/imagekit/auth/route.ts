import { NextResponse } from "next/server";
import ImageKit from "imagekit";

export async function GET() {
  try {
    const publicKey =
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
      process.env.NEXT_PUBLIC_IMAGEKIT;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint =
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
      process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error("Missing ImageKit Env Vars:", {
        hasPublicKey: !!publicKey,
        hasPrivateKey: !!privateKey,
        hasUrlEndpoint: !!urlEndpoint,
      });
      return NextResponse.json(
        {
          error:
            "ImageKit environment variables are missing. Please check .env.local.",
        },
        { status: 500 }
      );
    }

    const imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });

    const authParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParameters);
  } catch (error: any) {
    console.error("ImageKit authentication error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate ImageKit authentication parameters." },
      { status: 500 }
    );
  }
}
