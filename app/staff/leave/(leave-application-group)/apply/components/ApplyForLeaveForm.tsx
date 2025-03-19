import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  FileUploadSingle,
  Jumbotron,
  OptionType,
  RadioButton,
  SmAsyncSelect,
  SMSelectDropDown,
  Spinner,
  TextField,
  Typography,
  ValidationText,
} from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { RootState } from "@/redux";
import { IUserProps, useLazyGetAllUsersQuery } from "@/redux/api";
import { ILeaveProps, useGetLeaveDaysQuery } from "@/redux/api/leave";
import { setLeaveApplication } from "@/redux/api/leave/leaveApplicationForm.slice";
import base64ToFile from "@/utils/decodeImageFromBase64";
import formatImageToBase64 from "@/utils/formatImageToBase64";
import {
  fieldSetterAndClearer,
  formatInputDate,
  formatSelectItems,
} from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { applyForLeaveFormValidationSchema } from "./schema";

export interface ApplyForLeaveFormData {
  totalLeaveTaking: number;
  reliefStaffId: {
    label: string;
    value: string;
    icon: string;
    subLabel: string;
  };
  from: string;
  to: string;
  leaveContactAddress: string;
  leavePhoneNumber: string;
  alternateContactPerson: string;
  alternateContactPersonAddress: string;
  alternateContactPersonPhoneNumber: string;
  alternateContactPersonEmail?: string;
  payLeaveAllowance: string;
  leaveId: {
    label: string;
    value: string;
  };
  supervisorId: {
    label: string;
    value: string;
    icon: string;
    subLabel: string;
  };
  hodId: {
    label: string;
    value: string;
    icon: string;
    subLabel: string;
  };
  reason?: string;
  ailmentType?: string;
  confinementDate?: string;
  medicalCertificate?: File;
  sickCertificate?: File;
  examinationTimeTable?: File;
}

interface IApplyForLeaveForm {
  leaveTypes: ILeaveProps[];
  availableLeaveDays: number;
  totalLeaveDays: number;
}

type LeaveTypeResult = {
  isSickCertificate?: boolean;
  isMedicalCertificate?: boolean;
  isExaminationTimeTable?: boolean;
  isSpecial?: boolean;
};

const getActiveLeaveType = (leaveType?: ILeaveProps): LeaveTypeResult => {
  if (leaveType?.name?.toLowerCase()?.includes("sick")) {
    return { isSickCertificate: true };
  }
  if (leaveType?.name?.toLowerCase()?.includes("maternity")) {
    return { isMedicalCertificate: true };
  }
  if (leaveType?.name?.toLowerCase()?.includes("paternity")) {
    return { isMedicalCertificate: true };
  }
  if (
    leaveType?.name?.toLowerCase()?.includes("examination") ||
    leaveType?.name?.toLowerCase()?.includes("study")
  ) {
    return { isExaminationTimeTable: true };
  }
  if (leaveType?.name?.toLowerCase()?.includes("special")) {
    return { isSpecial: true };
  }
  return {};
};

export const ApplyForLeaveForm = ({
  leaveTypes = [],
  availableLeaveDays,
  totalLeaveDays,
}: IApplyForLeaveForm) => {
  const dispatch = useDispatch();
  const { leaveApplication } = useSelector(
    (state: RootState) => state.leaveApplicationForm,
  );
  const allLeaveTypes = formatSelectItems<ILeaveProps>(
    leaveTypes || [],
    "name",
    "leaveId",
  );

  const router = useRouter();

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [leaveData, setLeaveData] = useState<ILeaveProps>(
    leaveTypes.find(
      (leaveType) =>
        leaveType.leaveTypeId === Number(leaveApplication?.leaveId.value),
    ) || ({} as ILeaveProps),
  );

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    register,
    control,
  } = useForm<ApplyForLeaveFormData>({
    defaultValues: leaveApplication
      ? {
          ...leaveApplication,
          ...(leaveApplication.examinationTimeTable
            ? {
                examinationTimeTable: base64ToFile(
                  leaveApplication.examinationTimeTable,
                  "examinationTimeTable",
                ),
              }
            : { examinationTimeTable: undefined }),
          ...(leaveApplication.sickCertificate
            ? {
                sickCertificate: base64ToFile(
                  leaveApplication.sickCertificate,
                  "sickCertificate",
                ),
              }
            : { sickCertificate: undefined }),
          ...(leaveApplication.medicalCertificate
            ? {
                medicalCertificate: base64ToFile(
                  leaveApplication.medicalCertificate,
                  "medicalCertificate",
                ),
              }
            : {
                medicalCertificate: undefined,
              }),
        }
      : {},
    resolver: yupResolver(applyForLeaveFormValidationSchema),
    mode: "onChange",
    context: {
      leaveDays: availableLeaveDays,
      ...getActiveLeaveType(leaveData),
    },
  });

  const leaveDaysQuery = useMemo(() => {
    return {
      leaveTypeId: Number(watch(`leaveId`)?.value),
      startDate: watch(`from`),
      endDate: watch(`to`),
    };
  }, [watch(`leaveId`), watch(`from`), watch(`to`)]);

  const { data, isLoading, isFetching } = useGetLeaveDaysQuery(leaveDaysQuery, {
    skip: !watch(`leaveId`) || !watch(`from`) || !watch(`to`),
  });

  const [trigger] = useLazyGetAllUsersQuery();

  function formatUserResponse(items: IUserProps[]): OptionType[] {
    return items.map((user) => {
      return {
        value: user.employeeId,
        label: `${user.firstname} ${user.lastname}`,
        icon: user?.profilePicture ?? "",
        subLabel: user?.email,
      };
    });
  }
  const loadOptions = async (inputValue: string) => {
    const result = await trigger({
      searchTerm: inputValue,
      pageNumber: 1,
      pageSize: PAGE_SIZE.sm,
    }).unwrap();
    const formattedUsers = formatUserResponse(result?.data?.items || []);
    return formattedUsers;
  };
  const activeLeaveRequire = getActiveLeaveType(leaveData);

  const onSubmit = async (data: ApplyForLeaveFormData) => {
    const {
      medicalCertificate,
      sickCertificate,
      examinationTimeTable,
      ...rest
    } = data;
    const medicCert = medicalCertificate
      ? { medicalCertificate: await formatImageToBase64(medicalCertificate) }
      : {};

    const sickCert = sickCertificate
      ? {
          examinationTimeTable: await formatImageToBase64(sickCertificate),
        }
      : {};

    const examCert = examinationTimeTable
      ? {
          sickCertificate: await formatImageToBase64(examinationTimeTable),
        }
      : {};

    dispatch(
      setLeaveApplication({
        ...rest,
        ...medicCert,
        ...sickCert,
        ...examCert,
      }),
    );
    router.push(AuthRouteConfig.STAFF_LEAVE_APPLY_PREVIEW);
  };

  useEffect(() => {
    if (data?.data) {
      setValue("totalLeaveTaking", data?.data ? data?.data : 0);
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
      <Jumbotron
        headerText={`Leave Application`}
        footerContent={
          <div>
            <Button ref={submitButtonRef} type="submit">
              Preview
            </Button>
          </div>
        }
      >
        <div className="flex w-full flex-col gap-6 px-6">
          <fieldset>
            <SmAsyncSelect
              loadOptions={loadOptions}
              varient="custom"
              isMulti={false}
              onChange={(selectedOption) => {
                fieldSetterAndClearer({
                  value: selectedOption,
                  setterFunc: setValue,
                  setField: `reliefStaffId`,
                  clearErrors,
                });
              }}
              value={watch(`reliefStaffId`) as OptionType}
              label="Relief staff"
              flexStyle="row"
              placeholder="Select staff"
              searchable={true}
              isError={!!errors?.reliefStaffId?.message}
              errorText={errors?.reliefStaffId?.message}
            />
          </fieldset>
          <fieldset>
            <SMSelectDropDown
              options={allLeaveTypes}
              varient="simple"
              isMulti={false}
              onChange={(selectedOption) => {
                fieldSetterAndClearer({
                  value: selectedOption,
                  setterFunc: setValue,
                  setField: `leaveId`,
                  clearErrors,
                  clearFields: ["from", "to", "totalLeaveTaking"],
                });
                setLeaveData(
                  leaveTypes.find(
                    (item) => item.leaveId === selectedOption.value,
                  ) || ({} as ILeaveProps),
                );
              }}
              value={watch(`leaveId`) as OptionType}
              label="Leave type"
              flexStyle="row"
              placeholder="Select leave type"
              searchable={true}
              isError={!!errors?.leaveId?.message}
              errorText={errors?.leaveId?.message}
            />
          </fieldset>
          <div className="md:grid md:grid-cols-12">
            <div className="col-span-3 flex items-center">
              <Typography variant="h-s" fontWeight="medium" color="N700">
                Leave duration
              </Typography>
            </div>
            <div className="col-span-9 grid max-w-[370px] grid-cols-12 gap-2">
              <div className="col-span-5">
                <TextField
                  name={`from`}
                  inputType="input"
                  type="date"
                  placeholder="From"
                  register={register}
                  min={formatInputDate({})}
                  error={!!errors?.from?.message}
                  errorText={errors?.from?.message}
                />
              </div>
              <div className="col-span-1 flex items-center justify-center">
                -
              </div>
              <div className="col-span-5">
                <TextField
                  name={`to`}
                  inputType="input"
                  type="date"
                  placeholder="To"
                  register={register}
                  min={watch("from")}
                  disabled={!watch("from")}
                  error={!!errors?.to?.message}
                  errorText={errors?.to?.message}
                />
              </div>
            </div>
          </div>
          <fieldset className="w-full">
            {isLoading || isFetching ? (
              <div className="flex items-center justify-center">
                <Spinner height="30px" width="30px" />
              </div>
            ) : (
              <TextField
                inputType="input"
                type="number"
                placeholder="0"
                label={
                  <div>
                    Total leave being <br /> taken
                  </div>
                }
                flexStyle="row"
                name="totalLeaveTaking"
                error={!!errors.totalLeaveTaking}
                errorText={errors.totalLeaveTaking?.message}
                register={register}
                disabled
              />
            )}
          </fieldset>
          <fieldset>
            <TextField
              inputType="textarea"
              type="address"
              placeholder="Leave contact address"
              label={
                <div>
                  Contact address <br /> during leave
                </div>
              }
              flexStyle="row"
              name="leaveContactAddress"
              error={!!errors.leaveContactAddress}
              errorText={errors.leaveContactAddress?.message}
              register={register}
            />
          </fieldset>
          <fieldset>
            <TextField
              inputType="input"
              type="phone"
              placeholder="Enter contact phone number"
              label={
                <div>
                  Phone number <br />
                  during leave
                </div>
              }
              flexStyle="row"
              name="leavePhoneNumber"
              error={!!errors.leavePhoneNumber}
              errorText={errors.leavePhoneNumber?.message}
              register={register}
            />
          </fieldset>{" "}
          <fieldset>
            <TextField
              inputType="input"
              type="text"
              placeholder="Enter name"
              label={
                <div>
                  Alternative contact <br />
                  person while on leave
                </div>
              }
              flexStyle="row"
              name="alternateContactPerson"
              error={!!errors.alternateContactPerson}
              errorText={errors.alternateContactPerson?.message}
              register={register}
            />
          </fieldset>{" "}
          <fieldset>
            <TextField
              inputType="textarea"
              type="address"
              placeholder={`Enter contact person’s address`}
              label={<div>Address</div>}
              flexStyle="row"
              name="alternateContactPersonAddress"
              error={!!errors.alternateContactPersonAddress}
              errorText={errors.alternateContactPersonAddress?.message}
              register={register}
            />
          </fieldset>{" "}
          <fieldset>
            <TextField
              inputType="input"
              type="text"
              placeholder={`Enter contact person’s number`}
              label={<div>Phone number</div>}
              flexStyle="row"
              name="alternateContactPersonPhoneNumber"
              error={!!errors.alternateContactPersonPhoneNumber}
              errorText={errors.alternateContactPersonPhoneNumber?.message}
              register={register}
            />
          </fieldset>{" "}
          <fieldset>
            <TextField
              inputType="input"
              type="text"
              placeholder={`Enter contact person’s address `}
              label={<div>Email address of contact person (optional)</div>}
              flexStyle="row"
              name="alternateContactPersonEmail"
              error={!!errors.alternateContactPersonEmail}
              errorText={errors.alternateContactPersonEmail?.message}
              register={register}
            />
          </fieldset>
          {activeLeaveRequire?.isSickCertificate && (
            <>
              <fieldset>
                <TextField
                  inputType="input"
                  type="text"
                  placeholder="Malaria"
                  label={<div>Type of ailment</div>}
                  flexStyle="row"
                  name="ailmentType"
                  error={!!errors.ailmentType}
                  errorText={errors.ailmentType?.message}
                  register={register}
                />
              </fieldset>
              <div className="md:grid md:grid-cols-12">
                <div className="col-span-3">
                  <Typography variant="h-s" fontWeight="medium" color="N700">
                    Medical Certificate
                  </Typography>
                </div>
                <div className="col-span-9">
                  <FileUploadSingle
                    name={`sickCertificate`}
                    setValue={setValue}
                    error={!!errors?.sickCertificate}
                    errorText={errors?.sickCertificate?.message}
                    formats={["jpg", "png", "jpeg"]}
                  />
                </div>
              </div>
            </>
          )}
          {activeLeaveRequire?.isExaminationTimeTable && (
            <div className="md:grid md:grid-cols-12">
              <div className="col-span-3">
                <Typography variant="h-s" fontWeight="medium" color="N700">
                  Official examination <br /> timetable
                </Typography>
              </div>
              <div className="col-span-9">
                <FileUploadSingle
                  name={`examinationTimeTable`}
                  setValue={setValue}
                  error={!!errors?.examinationTimeTable}
                  errorText={errors?.examinationTimeTable?.message}
                  formats={["jpg", "png", "jpeg"]}
                />
              </div>
            </div>
          )}
          {activeLeaveRequire?.isMedicalCertificate && (
            <>
              <fieldset>
                <TextField
                  inputType="input"
                  type="date"
                  placeholder="date"
                  label={<div>Expected date of confinement</div>}
                  flexStyle="row"
                  name="confinementDate"
                  error={!!errors.confinementDate}
                  errorText={errors.confinementDate?.message}
                  register={register}
                />
              </fieldset>
              <div className="md:grid md:grid-cols-12">
                <div className="col-span-3">
                  <Typography variant="h-s" fontWeight="medium" color="N700">
                    Medical Certificate
                  </Typography>
                </div>
                <div className="col-span-9">
                  <FileUploadSingle
                    name={`medicalCertificate`}
                    setValue={setValue}
                    error={!!errors?.medicalCertificate}
                    errorText={errors?.medicalCertificate?.message}
                    formats={["jpg", "png", "jpeg"]}
                  />
                </div>
              </div>
            </>
          )}
          {activeLeaveRequire?.isSpecial && (
            <fieldset>
              <TextField
                inputType="textarea"
                placeholder="Enter reason"
                label="Reason"
                flexStyle="row"
                name="reason"
                error={!!errors.reason}
                errorText={errors.reason?.message}
                register={register}
              />
            </fieldset>
          )}
          <div className="md:grid md:grid-cols-12">
            <div className="col-span-3">
              <Typography variant="h-s" fontWeight="medium" color="N700">
                Pay leave allowance
              </Typography>
            </div>
            <div className="col-span-9 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
              <RadioButton
                name={`payLeaveAllowance`}
                value={"true"}
                label={"Yes"}
                control={control}
              />
              <RadioButton
                name={`payLeaveAllowance`}
                value={"false"}
                label={"No"}
                control={control}
              />
              {errors.payLeaveAllowance && (
                <ValidationText
                  status="error"
                  message={errors?.payLeaveAllowance?.message ?? ""}
                />
              )}
            </div>
          </div>
          <fieldset>
            <SmAsyncSelect
              loadOptions={loadOptions}
              varient="custom"
              isMulti={false}
              onChange={(selectedOption) => {
                fieldSetterAndClearer({
                  value: selectedOption,
                  setterFunc: setValue,
                  setField: `supervisorId`,
                  clearErrors,
                });
              }}
              value={watch(`supervisorId`) as OptionType}
              label="Supervisor"
              flexStyle="row"
              placeholder="Select staff"
              searchable={true}
              isError={!!errors?.supervisorId?.message}
              errorText={errors?.supervisorId?.message}
            />
          </fieldset>
          <fieldset>
            <SmAsyncSelect
              loadOptions={loadOptions}
              varient="custom"
              isMulti={false}
              onChange={(selectedOption) => {
                fieldSetterAndClearer({
                  value: selectedOption,
                  setterFunc: setValue,
                  setField: `hodId`,
                  clearErrors,
                });
              }}
              value={watch(`hodId`) as OptionType}
              label="H.O.D"
              flexStyle="row"
              placeholder="Select staff"
              searchable={true}
              isError={!!errors?.hodId?.message}
              errorText={errors?.hodId?.message}
            />
          </fieldset>
        </div>
      </Jumbotron>
    </form>
  );
};

ApplyForLeaveForm.displayName = "ApplyForLeaveForm";
