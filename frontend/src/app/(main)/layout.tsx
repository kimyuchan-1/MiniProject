import Header from "@/components/main/layout/Header";

export const dynamic = "force-dynamic";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="w-full">{children}</main>
    </>
  );
}
