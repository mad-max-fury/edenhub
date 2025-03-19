"use client";

import { DirectReportLeaveTable } from "../components";

const Page = () => {
  return (
    <div>
      <div>
        {/* {!leaves ? (
          <div className="flex min-h-[500px] w-full items-center border pt-2">
            <EmptyPageState
              title="No Leave Applications Yet"
              text="Submit your first leave application to start tracking your leave history."
              buttonGroup={
                <Link href={AuthRouteConfig.STAFF_LEAVE_APPLY}>
                  <Button
                    className="mx-auto my-6"
                    onClick={() => dispatch(resetLeaveApplication())}
                  >
                    Apply for Leave
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div>
            <TMTable<ILeave>
              title="Leave Applications"
              columns={columns}
              data={leaves!}
              loading={false}
            />
          </div>
        )} */}

        <DirectReportLeaveTable staff="supervisor" />
      </div>
    </div>
  );
};

export default Page;
