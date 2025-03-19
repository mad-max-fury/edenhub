import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  FileUploadSingle,
  FormStepJumbotron,
  notify,
  RadioButton,
  SMSelectDropDown,
  TextField,
  Typography,
  ValidationText,
} from "@/components";
import { UserContext } from "@/layouts/appLayout";
import { RootState } from "@/redux";
import { useUpdateEmployeePersonalDataMutation } from "@/redux/api";
import {
  ILGAProps,
  IStateProps,
  useLazyGetAllLGAsQuery,
  useLazyGetAllStatesQuery,
} from "@/redux/api/countryStatesLGA";
import { setPersonalInformation } from "@/redux/api/employee/bioDataForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import {
  AgeEnum,
  ISelectItemProps,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";
import base64ToFile from "@/utils/decodeImageFromBase64";
import formatImageToBase64 from "@/utils/formatImageToBase64";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  fieldSetterAndClearer,
  formatInputDate,
  formatSelectItems,
} from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { personalDetailsSchema } from "./schema";

export interface IPersonalInformationFormData<T = File | undefined> {
  employeeId?: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  address: string;
  genderId: string;
  dateOfBirth: string;
  maritalStatusId: string;
  marriageCertificate?: T;
  religionId: ISelectItemProps;
  countryId: ISelectItemProps;
  stateId: ISelectItemProps;
  lgaId: { label?: string; value?: string };
}

interface ChildFormProps {
  onClick: (step: string) => void;
  allGenders: ISelectItemPropsWithValueGeneric[];
  allMaritalStatusess: ISelectItemPropsWithValueGeneric[];
  allCountries: ISelectItemPropsWithValueGeneric[];
  allReligions: ISelectItemPropsWithValueGeneric[];
}

const marriedEnum = "2";

export const PersonalInformationForm = ({
  onClick,
  allGenders,
  allMaritalStatusess,
  allCountries,
  allReligions,
}: ChildFormProps) => {
  const data = useContext(UserContext);
  const [updateEmployeePersonalData, { isLoading }] =
    useUpdateEmployeePersonalDataMutation();
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { personalInformation, employeeId, profilePicture } = useSelector(
    (state: RootState) => state.bioDataForm,
  );
  const dispatch = useDispatch();
  const [watchData, setWatchData] = useState<{
    countryId: number | null;
    stateId: number | null;
    maritalStatusId: string | null;
  }>({
    countryId: Number(personalInformation?.countryId?.value),
    stateId: Number(personalInformation?.stateId?.value),
    maritalStatusId: personalInformation?.maritalStatusId ?? null,
  });
  const [isLGAList, setIsLGAList] = useState<boolean>(false);

  const isMarried = watchData?.maritalStatusId === marriedEnum;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<IPersonalInformationFormData>({
    defaultValues: { ...personalInformation } as IPersonalInformationFormData,
    resolver: yupResolver(personalDetailsSchema),
    mode: "onChange",
    context: {
      isMarried,
      isLGAList,
    },
  });
  useEffect(() => {
    const subscription = watch(
      ({ countryId, stateId, maritalStatusId }: FieldValues) => {
        setWatchData((state) => {
          return {
            ...state,
            countryId: countryId?.value,
            stateId: stateId?.value,
            maritalStatusId: maritalStatusId,
          };
        });
      },
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const [
    fetchStates,
    { data: states, isLoading: isLoadingStates, isFetching: isFetchingStates },
  ] = useLazyGetAllStatesQuery();
  const [
    fetchLGAs,
    { data: lgas, isLoading: isLoadingLGAs, isFetching: isFetchingLGAs },
  ] = useLazyGetAllLGAsQuery();
  useEffect(() => {
    if (watchData?.countryId && watchData?.stateId) {
      fetchLGAs({
        countryId: Number(watchData.countryId),
        stateId: Number(watchData.stateId),
      })
        .then((res) => {
          setIsLGAList((res.data?.data.length as number) > 0);
        })
        .catch(() => {
          setIsLGAList(false);
        });
    }
  }, [watchData?.countryId, watchData?.stateId, fetchLGAs]);
  const allStates = useMemo(
    () => formatSelectItems<IStateProps>(states?.data || [], "name", "id"),
    [states?.data],
  );
  const alllGAs = useMemo(
    () => formatSelectItems<ILGAProps>(lgas?.data || [], "name", "id"),
    [lgas?.data],
  );
  useEffect(() => {
    if (watchData?.countryId) {
      fetchStates(Number(watchData?.countryId));
    }
  }, [watchData?.countryId, fetchStates]);

  const onSubmit = async (data: IPersonalInformationFormData) => {
    if (!profilePicture) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      notify.error({
        message: "Failed to add or update personal information",
        subtitle: "Please upload a profile picture",
      });
      return;
    }
    const formData = new FormData();

    if (profilePicture.startsWith("data:image")) {
      const profPicture = base64ToFile(String(profilePicture), "profil_img");
      formData.append("profilePicture", profPicture);
    }
    formData.append("employeeId", String(employeeId)?.toLocaleUpperCase());
    formData.append("phoneNumber", data.phoneNumber);
    if (data.alternatePhoneNumber)
      formData.append("alternatePhoneNumber", data.alternatePhoneNumber);
    formData.append("address", data.address);
    formData.append("genderId", data.genderId);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("maritalStatusId", data.maritalStatusId);
    formData.append("countryId", String(data.countryId.value));
    formData.append("stateId", String(data.stateId.value));
    formData.append("lgaId", String(data.lgaId.value));
    formData.append("religionId", String(data.religionId.value));
    if (data.marriageCertificate)
      formData.append("marriageCertificate", data.marriageCertificate);
    try {
      await updateEmployeePersonalData(formData).unwrap();
      notify.success({
        message: "Personal information updated successfully",
      });
      const marriageCertificate = data.marriageCertificate
        ? await formatImageToBase64(data.marriageCertificate)
        : "";
      dispatch(setPersonalInformation({ ...data, marriageCertificate }));
      onClick(TAB_QUERIES[1]);
    } catch (error) {
      notify.error({
        message: "Failed to add or update personal information",
        subtitle: getErrorMessage(error as IApiError),
      });
    }
  };

  return (
    <FormStepJumbotron
      title="Personal Information"
      currentStep={1}
      totalSteps={TAB_QUERIES.length}
      onNext={() => submitButtonRef.current?.click()}
      isLoading={isLoading}
      disabled={isFetchingLGAs || isFetchingStates}
    >
      <form
        className="flex w-full flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography
          variant="p-s"
          fontWeight="medium"
          color={"N100"}
          className="uppercase"
        >
          EMPLOYMENT DETAILS
        </Typography>
        <div className="items-center md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Full Name
            </Typography>
          </div>
          <div className="col-span-9 grid grid-cols-1 gap-2 md:grid-cols-3 lg:mx-auto lg:grid-cols-3">
            <TextField
              name="firstName"
              inputType="input"
              placeholder="First Name"
              value={data?.user?.firstname}
              disabled
            />
            <TextField
              inputType="input"
              placeholder="Middle Name"
              name="middleName"
              value={data?.user?.middlename}
              disabled
            />
            <TextField
              inputType="input"
              placeholder="Last Name"
              name="lastName"
              value={data?.user?.lastname}
              disabled
            />
          </div>
        </div>
        <div>
          <TextField
            inputType="input"
            type="text"
            placeholder="Enter employee ID"
            label="Employee ID"
            flexStyle="row"
            name="staffId"
            value={data?.user?.staffId}
            disabled
          />
        </div>
        <div>
          <TextField
            inputType="input"
            type="email"
            placeholder="email@tenece.com"
            label="Email Address"
            flexStyle="row"
            name={"email"}
            value={data?.user?.email}
            disabled
          />
        </div>
        <Typography
          variant="p-s"
          fontWeight="medium"
          color={"N100"}
          className="uppercase"
        >
          Personal Information
        </Typography>
        <div>
          <TextField
            inputType="textarea"
            type="text"
            placeholder="Enter residential address"
            name="address"
            label="Residential Address"
            flexStyle="row"
            error={!!errors.address}
            errorText={errors.address?.message}
            register={register}
          />
        </div>
        <div>
          <TextField
            inputType="input"
            type="text"
            placeholder="Enter phone number"
            name="phoneNumber"
            label="Primary Phone"
            flexStyle="row"
            error={!!errors.phoneNumber}
            errorText={errors.phoneNumber?.message}
            register={register}
          />
        </div>
        <div>
          <TextField
            inputType="input"
            type="text"
            placeholder="Enter phone number"
            name="alternatePhoneNumber"
            label="Alternative Phone"
            labelSubText="Optional"
            flexStyle="row"
            error={!!errors.alternatePhoneNumber}
            errorText={errors.alternatePhoneNumber?.message}
            register={register}
          />
        </div>
        <div>
          <SMSelectDropDown
            options={allCountries}
            varient="simple"
            isMulti={false}
            label="Country of Origin"
            flexStyle="row"
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption,
                setterFunc: setValue,
                setField: "countryId",
                clearFields: ["stateId", "lgaId"],
                clearErrors: clearErrors,
              });
              fetchStates(Number(selectedOption?.value));
            }}
            value={watch("countryId")}
            loading={isLoadingStates || isFetchingStates}
            placeholder="Select country"
            searchable={true}
            isError={!!errors.countryId}
            errorText={errors.countryId?.message}
          />
        </div>
        <div>
          <SMSelectDropDown
            options={allStates}
            varient="simple"
            label="State of Origin"
            flexStyle="row"
            loading={isLoadingLGAs || isFetchingLGAs}
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption,
                setterFunc: setValue,
                setField: "stateId",
                clearFields: ["lgaId"],
                clearErrors,
              });
              fetchLGAs({
                countryId: Number(watchData.countryId),
                stateId: Number(selectedOption.value),
              });
            }}
            value={watch("stateId")}
            disabled={
              !(allStates.length > 0) || isLoadingStates || isFetchingStates
            }
            placeholder="Select state"
            searchable={true}
            isError={!!errors.stateId}
            errorText={errors.stateId?.message}
          />
        </div>
        {isLGAList && (
          <div>
            <SMSelectDropDown
              options={alllGAs}
              varient="simple"
              label="LGA"
              flexStyle="row"
              onChange={(selectedOption) => {
                fieldSetterAndClearer({
                  value: selectedOption,
                  setterFunc: setValue,
                  setField: "lgaId",
                  clearErrors,
                });
              }}
              value={watch("lgaId") as ISelectItemProps}
              placeholder="Select city"
              searchable={true}
              disabled={
                !(alllGAs.length > 0) || isLoadingLGAs || isFetchingLGAs
              }
              isError={!!errors.lgaId}
              errorText={errors.lgaId?.message}
            />
          </div>
        )}
        <div>
          <SMSelectDropDown
            options={allReligions}
            varient="simple"
            label="Religion"
            flexStyle="row"
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption,
                setterFunc: setValue,
                setField: "religionId",
                clearErrors,
              });
            }}
            value={watch("religionId")}
            placeholder="Choose an option"
            searchable={true}
            isError={!!errors.religionId}
            errorText={errors.religionId?.message}
          />
        </div>
        <div>
          <TextField
            inputType="input"
            type="date"
            placeholder="Enter dob"
            name="dateOfBirth"
            label="Date of Birth"
            flexStyle="row"
            max={formatInputDate({
              minYear: AgeEnum.MINIMUM,
              useFullYear: true,
            })}
            error={!!errors.dateOfBirth}
            errorText={errors.dateOfBirth?.message}
            register={register}
          />
        </div>
        <div className="md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Sex
            </Typography>
          </div>
          <div className="col-span-9 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            {allGenders.map((gender, index) => (
              <RadioButton<IPersonalInformationFormData>
                name="genderId"
                value={String(gender.value)}
                label={gender.label}
                key={index}
                control={control}
              />
            ))}
            {errors.genderId?.message && (
              <ValidationText
                status="error"
                message={errors.genderId?.message}
              />
            )}
          </div>
        </div>
        <div className="md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Marital Status
            </Typography>
          </div>
          <div className="col-span-9 grid max-w-[512px] flex-1 grid-cols-1 gap-2">
            {allMaritalStatusess.map((maritalStatus, index) => (
              <RadioButton<IPersonalInformationFormData>
                name="maritalStatusId"
                value={String(maritalStatus.value)}
                label={maritalStatus.label}
                key={index}
                control={control}
              />
            ))}
            {errors.maritalStatusId?.message && (
              <ValidationText
                status="error"
                message={errors.maritalStatusId?.message}
              />
            )}
          </div>
        </div>
        {isMarried && (
          <div className="md:grid md:grid-cols-12">
            <div className="col-span-3">
              <Typography variant="h-s" fontWeight="medium" color="N700">
                Marriage Certificate
              </Typography>
              <Typography
                variant="p-s"
                fontWeight="regular"
                color={"N500"}
                className="mb-2"
              >
                <label>{"Less than 1Mb"}</label>
              </Typography>
            </div>
            <div className="col-span-9">
              <FileUploadSingle
                name={`marriageCertificate`}
                setValue={setValue}
                error={!!errors?.marriageCertificate}
                errorText={errors?.marriageCertificate?.message}
                formats={["jpg", "png", "jpeg"]}
              />
            </div>
          </div>
        )}
        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

PersonalInformationForm.displayName = "PersonalInformationForm";

export default PersonalInformationForm;
