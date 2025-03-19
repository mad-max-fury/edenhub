"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PageHeader,
  SMSelectDropDown,
  TabUnderline,
  Typography,
} from "@/components";
import { generateYearOptions, queryParamsHelper } from "@/utils/helpers";

import { ReviewCard } from "@/components/reviewsCard/reviewsCard";

const options = generateYearOptions(2019);

//Dummy reviews data
const reviews = [
  {
    id: 1,
    title: "Q1 Quarterly Review 2025",
    year: 2025,
    description:
      "Do aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehend...",
    status: "Ongoing",
    reviewd: 0,
    users: [{ firstName: "Alice", lastName: "Smith" }],
  },
  {
    id: 2,
    title: "Q2 Quarterly Review 2025",
    year: 2025,
    description: "Nulla facilisi. Donec malesuada ligula quis magna placerat.",
    status: "Ended",
    reviewd: 1,
    users: [{ firstName: "Bob", lastName: "Brown" }],
  },
  {
    id: 3,
    title: "Q1 Quarterly Review 2024",
    year: 2024,
    description:
      "Do aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehend...",
    status: "Ongoing",
    reviewd: 0,
    users: [{ firstName: "Paulo", lastName: "Smith" }],
  },
  {
    id: 4,
    title: "Q1 Quarterly Review 2025",
    year: 2025,
    description:
      "Do aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehend...",
    status: "Ongoing",
    reviewd: 0,
    users: [{ firstName: "Paulo", lastName: "Smith" }],
  },
  {
    id: 5,
    title: "Q1 Quarterly Review 2024",
    year: 2024,
    description:
      "Do aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehend...",
    status: "Ongoing",
    reviewd: 0,
    users: [{ firstName: "Paulo", lastName: "Smith" }],
  },
  {
    id: 6,
    title: "Q1 Quarterly Review 2025",
    year: 2025,
    description:
      "Do aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehend...",
    status: "Ongoing",
    reviewd: 0,
    users: [{ firstName: "Paulo", lastName: "Smith" }],
  },
  {
    id: 7,
    title: "Q1 Quarterly Review 2024",
    year: 2024,
    description:
      "Do aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehend...",
    status: "Ongoing",
    reviewd: 0,
    users: [{ firstName: "Paulo", lastName: "Smith" }],
  },
];

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allQueryParamsObj = queryParamsHelper.queryStringToObject(
    searchParams.toString(),
  );
  const activeQueryTab = searchParams.get("t") || "ongoing";

  const ongoingReviews = reviews.filter(
    (review) => review.status === "Ongoing",
  );
  const endedReviews = reviews.filter((review) => review.status === "Ended");

  const filteredReviews =
    activeQueryTab === "ongoing" ? ongoingReviews : endedReviews;

  const queryTabs = [
    {
      label: `Ongoing (${ongoingReviews.length})`,
      query: "ongoing",
    },
    {
      label: `Ended (${endedReviews.length})`,
      query: "ended",
    },
  ];

  const handleTabChange = (query: Record<string, string>) => {
    const qString = queryParamsHelper.objectToQueryString({
      ...allQueryParamsObj,
      ...query,
    });
    return router.push(qString, {
      scroll: false,
    });
  };

  return (
    <main className="flex flex-col gap-20 pb-6">
      <ReviewCard
        title="Q2 Quaterly Review 2021 - Supervisor"
        description="Do aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehenderit.Do aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehenderit.vDo aliquip Lorem cupidatat reprehenderit enim est non in enim culpa ex mollit amet aute reprehenderit.Do aliquip Lorem cupidatat "
        status="Ongoing"
        reviewd={0}
        users={[{ firstName: "John", lastName: "Doe" }]}
      />

      <div>
        <Typography variant="c-l" fontWeight="regular" color="N200">
          Reviews
        </Typography>

        <PageHeader
          title="My Supervisor(s)"
          buttonGroup={
            <SMSelectDropDown
              defaultValue={options[0]}
              options={options}
              searchable={false}
              bgColor={true}
            />
          }
        />

        <div className="mt-6">
          <TabUnderline
            tabs={queryTabs}
            activeTab={activeQueryTab}
            onChange={(t) => handleTabChange({ t })}
          />

          <div className="mt-6 grid grid-cols-4 gap-4">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                title={review.title}
                description={review.description}
                status={review.status}
                reviewd={review.reviewd}
                users={review.users}
                isMini
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
