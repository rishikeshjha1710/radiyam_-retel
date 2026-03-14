"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OrderDetailsClient from "./OrderDetailsClient";

function OrderDetailsWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  
  return <OrderDetailsClient id={id} />;
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Decrypting Order Metadata...</div>}>
      <OrderDetailsWrapper />
    </Suspense>
  );
}
