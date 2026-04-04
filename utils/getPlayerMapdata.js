export default async function getPlayerMapdata() {
  const endpoint = "/api/gettotalplayerlist";
  const REQUEST_TIMEOUT_MS = 2500;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(endpoint, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) return [];

    const data = await res.json();
    const players = Array.isArray(data)
      ? data
      : data?.playerInfoList || data?.TotalPlayerList;
    return Array.isArray(players) ? players : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}
