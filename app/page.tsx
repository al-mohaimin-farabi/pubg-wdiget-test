import Link from "next/link";

const links = [
  { href: "/rampdom", label: "RampDom" },
  { href: "/elmis", label: "Elmis" },
];

export default function Home() {
  return (
    <div className="bg-transparent text-black ">
      <nav className="mx-auto w-max p-2">
        <ul className="flex items-center flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.href} className="underline border-r pr-2 last:pr-0 last:border-r-0">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
