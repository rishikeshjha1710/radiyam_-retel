import OrderDetailsClient from "./OrderDetailsClient";

export async function generateStaticParams() {
  // return empty array so Next.js allows dynamic export
  return [];
}

export default function Page({ params }: { params: { id: string } }) {
  return <OrderDetailsClient id={params.id} />;
}