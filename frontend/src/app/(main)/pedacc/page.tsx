import { Suspense } from "react";
import PedAccClient from "./PedAccClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PedAccClient />
    </Suspense>
  );
}
