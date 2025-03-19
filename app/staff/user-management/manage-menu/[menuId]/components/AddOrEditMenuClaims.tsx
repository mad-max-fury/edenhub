"use client";

import React from "react";
import { Button, notify, SMSelectDropDown, Typography } from "@/components";
import { useAddClaimToMenuMutation } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ISelectItemProps,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { schema } from "./schema";

interface IAddOrEditProps {
  closeModal: () => void;
  allClaims: ISelectItemPropsWithValueGeneric[];
  menuId: string;
}

interface IAddOrEditPayload {
  claims: ISelectItemProps[];
}

export const AddOrEditMenuClaims = ({
  closeModal,
  allClaims,
  menuId,
}: IAddOrEditProps) => {
  const [addMenuToCliam, { isLoading }] = useAddClaimToMenuMutation();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = useForm<IAddOrEditPayload>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (values: IAddOrEditPayload) => {
    addMenuToCliam({
      menuId,
      claims: values.claims.map((claim) => claim.value.toString()),
    })
      .unwrap()
      .then(() => {
        notify.success({
          message: `Added Successfully`,
          subtitle: `You have successfully added ${values.claims.map((claim) => claim.label).join(", ")} to this menu`,
        });
        closeModal();
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Action failed",
          subtitle: getErrorMessage(err),
        });
      });
  };

  return (
    <form
      className="flex h-full flex-col justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="mb-4 grid grid-cols-1 justify-between gap-2 md:grid-cols-4">
            <Typography
              variant="h-s"
              fontWeight="medium"
              color={"N700"}
              className={`col-span-1 my-auto cursor-pointer mmd:my-[unset]`}
            >
              Claims
            </Typography>
            <div className="col-span-3">
              <SMSelectDropDown
                options={allClaims}
                varient="simple"
                disabled={false} // Assuming you want to allow selection
                placeholder="Search Claims"
                onChange={(selectedOption) => {
                  fieldSetterAndClearer({
                    value: selectedOption,
                    setterFunc: setValue,
                    setField: "claims",
                    clearErrors,
                  });
                }}
                value={watch("claims")}
                isMulti={true}
                searchable={true}
                isError={!!errors.claims}
                errorText={errors.claims?.message}
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
          type="submit"
          loading={isLoading}
        >
          {"Add Claims"}
        </Button>
      </div>
    </form>
  );
};
