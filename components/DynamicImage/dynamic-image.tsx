import Image from "next/image";
import { StaticImageData } from "next/image";
import { cn } from "@/utils/helpers";
import { getImage } from "@/utils/get-image";

export const DynamicImage = async ({
  url,
  alt,
  containerClass,
}: {
  url: string | StaticImageData;
  alt?: string;
  containerClass?: string;
}) => {
  if (typeof url !== "string") {
    return (
      <div className={cn("relative overflow-hidden", containerClass)}>
        <Image
          src={url}
          alt={alt || ""}
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  const { base64, img } = await getImage(url);

  return (
    <div className={cn("relative", containerClass)}>
      <Image
        {...img}
        alt={alt || ""}
        placeholder={base64 ? "blur" : "empty"}
        blurDataURL={base64}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
