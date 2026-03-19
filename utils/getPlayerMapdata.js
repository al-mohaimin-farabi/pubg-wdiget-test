export default async function getPlayerMapdata() {
  const res = await fetch("/playerData.json");
  const data = await res.json();
  return data.TotalPlayerList;
}
