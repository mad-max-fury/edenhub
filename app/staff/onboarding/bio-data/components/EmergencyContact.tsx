import React, { useRef, useState } from "react";
import {
  Checkbox,
  FormStepJumbotron,
  notify,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import { RootState } from "@/redux";
import { useUpdateEmployeeEmergencyContactMutation } from "@/redux/api";
import { setEmergencyContacts } from "@/redux/api/employee/bioDataForm.slice";
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
import { emergencyContactSchema } from "./schema";

export interface IEmergencyContactsFormData {
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

export const EmergencyContactsForm = ({
  onClick,
  allRelationships,
}: ChildFormProps) => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { emergencyContacts, employeeId } = useSelector(
    (state: RootState) => state.bioDataForm,
  );
  const [updateEmergencyContact, { isLoading }] =
    useUpdateEmployeeEmergencyContactMutation();
  const [checked, setChecked] = useState(!!emergencyContacts?.email || false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<IEmergencyContactsFormData>({
    defaultValues: emergencyContacts as IEmergencyContactsFormData,
    resolver: yupResolver(emergencyContactSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: IEmergencyContactsFormData) => {
    if (employeeId) {
      const apiData = {
        ...data,
        employeeId,
        relationshipId: data.relationshipId.value,
      };
      updateEmergencyContact(apiData)
        .unwrap()
        .then(() => {
          dispatch(setEmergencyContacts(data));
          onClick(TAB_QUERIES[3]);
          notify.success({
            message: "Emergency contacts updated successfully",
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
      title="Emergency Contacts"
      currentStep={3}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[1])}
      onNext={() => submitButtonRef.current?.click()}
      isLoading={isLoading}
      disabled={!checked}
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
          EMERGENCY CONTACT
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
        <div className="md:grid md:grid-cols-12">
          <div className="col-span-3"></div>
          <div className="col-span-9 flex">
            <Checkbox
              label=" "
              checked={checked}
              onSelect={() => setChecked(!checked)}
            />
            <Typography variant="p-m">
              Please tick this box to confirm that you have told your emergency
              contact that you have give us their details
            </Typography>
          </div>
        </div>
        {/* Invisible Submit Button */}
        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

EmergencyContactsForm.displayName = "EmergencyContactsForm";
