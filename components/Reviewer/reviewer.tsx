import { Typography } from "../typography";
import { noImage } from "@/assets/images";
import Image, { StaticImageData } from "next/image";

interface ReviewerProps {
  name: string;
  review: string;
  imageURL: string | StaticImageData;
}

export const Reviewer = ({ name, review, imageURL }: ReviewerProps) => {
  return (
    <div className="relative w-full md:w-[70%] lg:w-[50%] min-h-[400px] flex flex-col border-2 border-[#D8D8D8] px-4 pb-4">
      <div className="absolute -top-10 left-4 w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] overflow-hidden">
        <Image
          src={imageURL || noImage}
          alt="reviewer"
          width={90}
          height={90}
          className="w-full h-full object-cover border "
          priority
        />
      </div>

      <div
        className="flex flex-col h-full justify-between "
        style={{ minHeight: "360px" }}
      >
        <div className="mt-32 md:mt-20 lg:mt-40">
          <Typography
            variant="p-l"
            fontWeight="regular"
            className="text-base sm:text-xl"
          >
            "{review}"
          </Typography>
        </div>

        <div className="mt-auto pt-4">
          <Typography
            variant="p-l"
            fontWeight="medium"
            color="N90"
            className="text-base sm:text-xl"
          >
            {name}
          </Typography>
        </div>
      </div>
    </div>
  );
};
