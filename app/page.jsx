import Link from "next/link";

// const links = [
//   { href: "/rampdom", label: "RampDom" },
//   { href: "/elmis", label: "Elmis" },
//   { href: "/topfour", label: "Topfour" },
//   // { href: "/wwc", label: "WWC" },
//   { href: "/wwctwo", label: "WWC Two" },
//   { href: "/wwcstats", label: "WWC Stats" },
//   { href: "/matchsummary", label: "Match Sumary" },
//   { href: "/top-player-match", label: "Top Player Match" },
//   { href: "/top-players-group", label: "Top Players Group" },
//   { href: "/head-to-head", label: "Head to Head" },
// ];

const linksGroup = [
  {
    label: "In Game Widget",
    links: [
      { href: "/rampdom", label: "RampDom" },
      { href: "/elmis", label: "Elmis" },
      { href: "/topfour", label: "Topfour" },
    ],
  },
  {
    label: "After Match Widgets",
    links: [
      { href: "/wwctwo", label: "WWC Two" },
      { href: "/wwcstats", label: "WWC Stats" },
      { href: "/matchsummary", label: "Match Sumary" },
      { href: "/top-player-match", label: "Top Player Match" },
      { href: "/top-players-group", label: "Top Players Group" },
      { href: "/head-to-head", label: "Head to Head" },
      { href: "/mvp-match", label: "Mvp Match" },
      { href: "/mvp-group", label: "Mvp Group" },
    ],
  },
];

export default function Home() {
  return (
    <div className="grid h-screen place-content-around bg-transparent text-black">
      <nav className="mx-auto w-max max-w-3xl p-2">
        {/* <ul className="flex flex-wrap items-center gap-4">
          {links.map((link) => (
            <li
              key={link.href}
              className="border-r pr-2 text-2xl underline last:border-r-0 last:pr-0"
            >
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul> */}

        <ul className="flex gap-12">
          {linksGroup.map((group) => (
            <li
              key={group.label}
              className="border-r border-black pr-12 last:border-r-0 last:pr-0"
            >
              <p className="mb-2 text-xl font-bold text-gray-500 uppercase">
                {group?.label}
              </p>
              <ul className="flex flex-col items-start gap-4">
                {group?.links.map((link) => (
                  <li key={link.href} className="pr-2 text-2xl underline">
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
