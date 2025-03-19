import { LocationIcon } from "@/assets/svgs";
import { Avatar, Badge, Typography } from "@/components";
import { IEmployeeDashboard } from "@/redux/api";
import { shortDate } from "@/utils/helpers";

interface IInfoSectionProps {
  userData: IEmployeeDashboard;
}

export const InfoSection: React.FC<IInfoSectionProps> = ({ userData }) => {
  const summary = [
    { title: "Email", value: userData?.email ?? "-" },
    { title: "Employee ID", value: userData?.employeeId ?? "-" },
    { title: "Primary Phone", value: userData?.phoneNumber ?? "-" },
    {
      title: "Alternative Phone",
      value: userData?.alternatePhoneNumber ?? "-",
    },
    { title: "Department", value: userData?.department ?? "-" },
    { title: "Company", value: userData?.company ?? "-" },
    { title: "Job Title", value: userData?.jobTitle ?? "-" },
    { title: "Job Designation", value: userData?.jobDesignation ?? "-" },
    { title: "Employment Type", value: userData?.employmentType ?? "-" },
    { title: "Leave Days", value: userData?.leaveDays ?? "-" },
    { title: "Date of Hire", value: shortDate(userData?.hiredDate) ?? "-" },
    {
      title: "Location",
      value: userData?.company
        ? `${userData?.company}, ${userData?.location}`
        : "-",
      icon: userData?.company ? <LocationIcon /> : "",
    },
  ];
  return (
    <div className="rounded-[8px] border border-N30 px-5 pb-10 pt-5">
      <div className="flex items-center gap-6 border-b border-N40 pb-6">
        <Avatar
          size="xl"
          fullname={userData?.fullname}
          src={userData?.profilePicture}
        />
        <div>
          <Typography variant="c-xxl" fontWeight="medium" color="N900">
            {userData?.fullname}
          </Typography>
          <div className="mt-3 flex items-center gap-3">
            <Typography variant="c-m" fontWeight="regular" color="N700">
              {userData?.jobTitle ?? "-"}
            </Typography>
            <Badge variant="purple" text="Staff" />
            <Badge variant="gray" text={userData?.employeeId} />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Typography variant="c-l" fontWeight="bold" color="N900">
          Profile Summary
        </Typography>
        <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {summary.map((item, index) => (
            <div key={index}>
              <Typography variant="p-s" fontWeight="regular" color="N100">
                {item.title}
              </Typography>
              <div className="mt-1 flex items-center gap-1">
                {item.icon && item.icon}
                <Typography variant="c-m" fontWeight="medium" color="N900">
                  {item.value}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
