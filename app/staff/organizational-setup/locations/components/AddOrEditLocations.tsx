import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  notify,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import {
  ILGAProps,
  IStateProps,
  useLazyGetAllLGAsQuery,
  useLazyGetAllStatesQuery,
} from "@/redux/api/countryStatesLGA";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ISelectItemProps,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";
import {
  ICreateLocationPayload,
  ILocationProps,
  useCreateLocationMutation,
  useUpdateLocationMutation,
} from "@/redux/api/location";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer, formatSelectItems } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { schema } from "./schema";

interface IAddOrEditProps {
  closeModal: () => void;
  editData?: ILocationProps | null;
  allCountries: ISelectItemPropsWithValueGeneric[];
  allCompanies: ISelectItemPropsWithValueGeneric[];
}

interface IAddOrEditSchemaProps
  extends Omit<
    ICreateLocationPayload,
    "companyId" | "countryId" | "stateId" | "cityId"
  > {
  companyId: ISelectItemProps[];
  countryId: ISelectItemProps;
  stateId: ISelectItemProps;
  cityId?: ISelectItemProps;
}

export const AddOrEditLocation = ({
  closeModal,
  editData,
  allCountries,
  allCompanies,
}: IAddOrEditProps) => {
  const [watchData, setWatchData] = useState<{
    countryId: number | null;
    stateId: number | null;
  }>({
    countryId: editData?.countryId ?? null,
    stateId: editData?.stateId ?? null,
  });
  const [createLocation, { isLoading }] = useCreateLocationMutation();
  const [updateLocation, { isLoading: isUpdating }] =
    useUpdateLocationMutation();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<IAddOrEditSchemaProps>({
    defaultValues: {
      name: editData?.name ?? "",
      code: editData?.code ?? "",
      companyId:
        editData?.companies?.map((company) => ({
          label: company.name,
          value: company.id,
        })) ?? [],
      countryId: editData?.countryId
        ? {
            label: editData?.country,
            value: String(editData?.countryId),
          }
        : undefined,
      stateId: editData?.stateId
        ? {
            label: editData?.state,
            value: String(editData?.stateId),
          }
        : undefined,
      cityId: editData?.cityId
        ? {
            label: editData?.city,
            value: String(editData?.cityId),
          }
        : undefined,
      address: editData?.address ?? "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const subscription = watch(({ countryId, stateId }: FieldValues) => {
      setWatchData((state) => {
        return {
          ...state,
          countryId: countryId?.value ?? editData?.countryId,
          stateId: stateId?.value ?? editData?.stateId,
        };
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, editData]);

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

  const onSubmit: SubmitHandler<IAddOrEditSchemaProps> = (values) => {
    const apiData = {
      name: values.name,
      countryId: values.countryId.value,
      stateId: values.stateId.value,
      cityId: values.cityId?.value,
      address: values.address,
      code: values.code.toUpperCase(),
      companyId: values.companyId.map((item) => String(item.value)),
    };

    if (!editData) {
      createLocation(apiData)
        .unwrap()
        .then(() => {
          notify.success({
            message: `Added Successfully`,
            subtitle: `You have successfully created ${values.name}`,
          });
          closeModal();
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    } else {
      updateLocation({ id: editData.id, ...apiData })
        .unwrap()
        .then(() => {
          notify.success({
            message: `Edited Successfully`,
            subtitle: `You have successfully edited ${values.name}`,
          });
          closeModal();
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
    <form
      className="flex h-full flex-col justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-6">
        <div className="mb-4">
          <TextField
            name="name"
            label="Location Name"
            placeholder="Lagos"
            flexStyle="row"
            register={register}
            error={!!errors.name}
            errorText={errors.name?.message}
          />
        </div>

        <div className="mb-4">
          <TextField
            name="code"
            label="Location Code"
            placeholder="ENU"
            flexStyle="row"
            register={register}
            error={!!errors.code}
            errorText={errors.code?.message}
          />
        </div>

        <div className="mb-4 grid grid-cols-1 justify-between gap-2 md:grid-cols-4">
          <Typography
            variant="h-s"
            fontWeight="medium"
            color={"N700"}
            className={`col-span-1 my-auto cursor-pointer mmd:my-[unset]`}
          >
            Company
          </Typography>
          <div className="col-span-3">
            <SMSelectDropDown
              options={allCompanies}
              varient="simple"
              onChange={(selectedOption) => {
                fieldSetterAndClearer({
                  value: selectedOption,
                  setterFunc: setValue,
                  setField: "companyId",
                  clearErrors,
                });
              }}
              value={watch("companyId")}
              placeholder="Genesys"
              isMulti
              searchable={true}
              isError={!!errors.companyId}
              errorText={errors.companyId?.message}
            />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 justify-between gap-2 md:grid-cols-4">
          <Typography
            variant="h-s"
            fontWeight="medium"
            color={"N700"}
            className={`col-span-1 cursor-pointer mmd:my-[unset]`}
          >
            Address
          </Typography>
          <div className="col-span-3 grid grid-cols-1 gap-4">
            <div>
              <SMSelectDropDown
                options={allCountries}
                varient="simple"
                isMulti={false}
                onChange={(selectedOption) => {
                  fieldSetterAndClearer({
                    value: selectedOption,
                    setterFunc: setValue,
                    setField: "countryId",
                    clearFields: ["stateId", "cityId"],
                    clearErrors: clearErrors,
                  });
                  fetchStates(Number(selectedOption?.value));
                }}
                value={watch("countryId")}
                loading={isLoadingStates || isFetchingStates}
                placeholder="Select country"
                searchable={true}
                isError={!!errors.countryId?.label}
                errorText={errors.countryId?.label?.message}
              />
            </div>
            <div className="flex items-center gap-4 [&>*:last-of-type]:w-3/5">
              <SMSelectDropDown
                options={allStates}
                varient="simple"
                loading={isLoadingLGAs || isFetchingLGAs}
                onChange={(selectedOption) => {
                  fieldSetterAndClearer({
                    value: selectedOption,
                    setterFunc: setValue,
                    setField: "stateId",
                    clearFields: ["cityId"],
                    clearErrors,
                  });
                  fetchLGAs({
                    countryId: Number(watchData.countryId),
                    stateId: Number(selectedOption.value),
                  });
                }}
                disabled={
                  !(allStates.length > 0) || isLoadingStates || isFetchingStates
                }
                value={watch("stateId")}
                placeholder="Select state"
                searchable={true}
                isError={!!errors.stateId?.label}
                errorText={errors.stateId?.label?.message}
              />
              <SMSelectDropDown
                options={alllGAs}
                varient="simple"
                value={watch("cityId")}
                onChange={(selectedOption) => {
                  fieldSetterAndClearer({
                    value: selectedOption,
                    setterFunc: setValue,
                    setField: "cityId",
                    clearErrors,
                  });
                }}
                placeholder="Select city"
                searchable={true}
                disabled={
                  !(alllGAs.length > 0) || isLoadingLGAs || isFetchingLGAs
                }
                isError={!!errors.cityId?.label}
                errorText={errors.cityId?.label?.message}
              />
            </div>
            <div className="[&>div>div>div]:col-span-12">
              <TextField
                name="address"
                placeholder="Street address"
                flexStyle="row"
                register={register}
                error={!!errors.address}
                errorText={errors.address?.message}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-solid border-N40 bg-N0 px-6 py-4">
        <Button
          variant={"secondary"}
          type="button"
          className="msm:w-full"
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          variant={"primary"}
          className="msm:w-full"
          disabled={isLoadingStates || isLoadingLGAs}
          loading={isLoading || isUpdating}
        >
          {editData ? "Save" : "Add Location"}
        </Button>
      </div>
    </form>
  );
};
