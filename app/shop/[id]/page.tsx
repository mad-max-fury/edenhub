import type { Metadata } from "next";
import ProductDetail from "./ProductDetailClient";

const API = process.env.NEXT_PUBLIC_BASEAPI || "http://localhost:3000/api";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(`${API}/catalog/products/${params.id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { title: "Product — Eden Wood Watch Hub" };
    const json = await res.json();
    const product = json.data;
    const title = product.metaTitle || product.name;
    const description =
      product.metaDescription ||
      product.description?.slice(0, 160) ||
      "";
    const image = product.coverImage || product.images?.[0];

    return {
      title: `${title} — Eden Wood Watch Hub`,
      description,
      openGraph: {
        title,
        description,
        ...(image ? { images: [{ url: image }] } : {}),
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: "Product — Eden Wood Watch Hub" };
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return <ProductDetail params={params} />;
}
