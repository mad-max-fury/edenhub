import React, { useRef } from "react";
import {
  FormStepJumbotron,
  notify,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import { RootState } from "@/redux";
import { useUpdateEmployeeNextOfKinMutation } from "@/redux/api";
import { setNextOfKin } from "@/redux/api/employee/bioDataForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ISelectItemProps,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { nextOfKinSchema } from "./schema";

export interface INextOfKinFormData {
  lastname: string;
  firstname: string;
  middlename?: string;
  email: string;
  phoneNumber: string;
  address: string;
  relationshipId: ISelectItemProps;
}

interface ChildFormProps {
  onClick: (step: string) => void;
  allRelationships: ISelectItemPropsWithValueGeneric[];
}

export const NextOfKinForm = ({
  onClick,
  allRelationships,
}: ChildFormProps) => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { nextOfKin, employeeId } = useSelector(
    (state: RootState) => state.bioDataForm,
  );
  const [updateEmergencyContact, { isLoading }] =
    useUpdateEmployeeNextOfKinMutation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<INextOfKinFormData>({
    defaultValues: nextOfKin as INextOfKinFormData,
    resolver: yupResolver(nextOfKinSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: INextOfKinFormData) => {
    if (employeeId) {
      const apiData = {
        ...data,
        employeeId,
        relationshipId: data.relationshipId.value,
      };
      updateEmergencyContact(apiData)
        .unwrap()
        .then(() => {
          dispatch(setNextOfKin(data));
          onClick(TAB_QUERIES[4]);
          notify.success({
            message: "Next of kin info updated successfully",
          });
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };

  return (
    <FormStepJumbotron
      title="Next of Kin"
      currentStep={4}
      totalSteps={TAB_QUERIES.length}
      onNext={() => submitButtonRef.current?.click()}
      onBack={() => onClick(TAB_QUERIES[2])}
      isLoading={isLoading}
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
          NEXT OF KIN
        </Typography>
        <div className="items-center md:grid md:grid-cols-12">
          <div className="col-span-3">
            <Typography variant="h-s" fontWeight="medium" color={"N700"}>
              Full Name
            </Typography>
          </div>
          <div className="col-span-9 grid grid-cols-1 gap-2 md:grid-cols-3 lg:mx-auto lg:grid-cols-3">
            <TextField
              name="firstname"
              inputType="input"
              placeholder="First Name"
              register={register}
              error={!!errors.firstname}
              errorText={errors.firstname?.message}
            />
            <TextField
              inputType="input"
              placeholder="Middle Name"
              name="middlename"
              register={register}
              error={!!errors.middlename}
              errorText={errors.middlename?.message}
            />
            <TextField
              inputType="input"
              placeholder="Last Name"
              name="lastname"
              register={register}
              error={!!errors.lastname}
              errorText={errors.lastname?.message}
            />
          </div>
        </div>
        <div>
          <TextField
            inputType="textarea"
            type="text"
            placeholder="Enter residential address"
            name="address"
            label="Residential Address"
            flexStyle="row"
            register={register}
            error={!!errors.address}
            errorText={errors.address?.message}
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
            type="email"
            placeholder="email@tenece.com"
            label="Email Address"
            flexStyle="row"
            name={"email"}
            error={!!errors.email}
            errorText={errors.email?.message}
            register={register}
          />
        </div>
        <div>
          <SMSelectDropDown
            options={allRelationships}
            varient="simple"
            isMulti={false}
            label="Relationship"
            flexStyle="row"
            onChange={(selectedOption) => {
              fieldSetterAndClearer({
                value: selectedOption,
                setterFunc: setValue,
                setField: "relationshipId",
                clearErrors: clearErrors,
              });
            }}
            value={watch("relationshipId")}
            placeholder="Select a relationship"
            searchable={true}
            isError={!!errors.relationshipId}
            errorText={errors.relationshipId?.value?.message}
          />
        </div>
        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

NextOfKinForm.displayName = "NextOfKinForm";
