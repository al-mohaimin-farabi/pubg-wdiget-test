import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const backendBaseUrl =
  process.env.PCOB_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_PCOB_URL?.replace(/\/$/, "");

export async function GET() {
  const emptyPayload = { playerInfoList: [] };
  const REQUEST_TIMEOUT_MS = 2500;

  if (!backendBaseUrl) {
    return NextResponse.json(emptyPayload, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${backendBaseUrl}/gettotalplayerlist`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(emptyPayload, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const data = await response.json();
    const players = Array.isArray(data?.playerInfoList)
      ? data.playerInfoList
      : Array.isArray(data?.TotalPlayerList)
        ? data.TotalPlayerList
        : [];

    return NextResponse.json(
      { playerInfoList: players },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return NextResponse.json(emptyPayload, {
      headers: { "Cache-Control": "no-store" },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
