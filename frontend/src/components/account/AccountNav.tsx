import Link from "next/link";

const items = [
  { href: "/settings/profile", label: "프로필" },
  { href: "/settings/security", label: "보안" },
  { href: "/settings/activity", label: "활동 내역" },
];

export default function AccountNav() {
  return (
    <nav className="bg-white rounded-2xl shadow-sm border p-3">
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="block px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
