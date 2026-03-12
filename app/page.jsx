import Link from "next/link";

const links = [
  { href: "/rampdom", label: "RampDom" },
  { href: "/elmis", label: "Elmis" },
  { href: "/topfour", label: "Topfour" },
  // { href: "/wwc", label: "WWC" },
  { href: "/wwctwo", label: "WWC Two" },
  { href: "/wwcstats", label: "WWC Stats" },
  { href: "/matchsummary", label: "Match Sumary" },
];

export default function Home() {
  return (
    <div className="grid h-screen place-content-around bg-transparent text-black">
      <nav className="mx-auto w-max p-2">
        <ul className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <li
              key={link.href}
              className="border-r pr-2 text-2xl underline last:border-r-0 last:pr-0"
            >
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
