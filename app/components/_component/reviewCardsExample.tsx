import { ReviewCard } from "@/components/reviewsCard/reviewsCard";

export const ReviewCardsExample = () => {
  const users = [
    { firstName: "Umar", lastName: "Olu" },
    { firstName: "Wale", lastName: "Aden" },
    { firstName: "Eddy", lastName: "Dane" },
    { firstName: "Chris", lastName: "Fang" },
    { firstName: "Jane", lastName: "Doe" },
    { firstName: "Wale", lastName: "Aden" },
    { firstName: "Eddy", lastName: "Dane" },
  ];

  return (
    <ReviewCard
      description="Do aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehenderit.Do aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehenderit.vDo aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehenderit.Do aliquip Lorem cupidatat "
      reviewd={2}
      status={"Ongoing"}
      title="Q2 Quaterly Review 2021 - Supervisor"
      users={users}
      isMini={false}
    />
  );
};
