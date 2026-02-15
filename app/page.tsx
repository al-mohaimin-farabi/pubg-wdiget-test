import Link from "next/link";

const links = [
  { href: "/rampdom", label: "RampDom" },
  { href: "/elmis", label: "Elmis" },
  { href: "/topfour", label: "Topfour" },
];

export default function Home() {
  return (
    <div className="bg-transparent text-black h-screen grid place-content-around">
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
