import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Typography } from "../typography";
import { BsArrowUpRightCircle } from "react-icons/bs";


interface ItemCollectionProps {
  imageURL: string | StaticImageData;
  title: string;
  price: string;
  category?: string;
  href?: string;
}

export const ItemCollection = ({
  imageURL,
  title,
  price,
  category = "Watches",
  href = "#",
}: ItemCollectionProps) => {
  return (
    <Link href={href} className="max-w-80 min-h-[400px] group">
      <div className="relative overflow-hidden w-full">
        <Image
          src={imageURL}
          alt={title}
          priority
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-3 flex flex-col gap-1 mx-2">
        <Typography
          variant="h-l"
          fontWeight={"bold"}
          color={"N700"}
          className="text-sm font-medium"
        >
          ${price}
        </Typography>
        <div className="flex items-center justify-between">
          <Typography
            variant="h-l"
            fontWeight={"bold"}
            color={"N500"}
            className="text-sm font-normal"
          >
            {title}
          </Typography>
          <BsArrowUpRightCircle className="text-lg font-normal group-hover:text-primary" />
        </div>
        <Typography
          variant="h-xl"
          fontWeight={"bold"}
          color={"N500"}
          className="text-xs font-normal"
        >
          {category}
        </Typography>
      </div>
    </Link>
  );
};
