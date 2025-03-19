import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FormStepJumbotron,
  notify,
  SMSelectDropDown,
  Spinner,
  TextField,
  Typography,
} from "@/components";
import { RootState } from "@/redux";
import {
  IBankDetailsResponse,
  useUpdateBankDetailsMutation,
} from "@/redux/api";
import { setBankDetails } from "@/redux/api/employee/bioDataForm.slice";
import {
  ISelectItemProps,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";
import { IBank } from "@/redux/api/select";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer, resolveBankAccount } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { TAB_QUERIES } from "./constants";
import { bankDetailsSchema } from "./schema";

export interface IBankDetailsFormData {
  accountName: string;
  bankId: ISelectItemProps;
  accountNumber: string;
}

interface ChildFormProps {
  onClick: (step: string) => void;
  allBanks: ISelectItemPropsWithValueGeneric[];
  banks?: IBank[];
}

export const BankDetails = ({
  onClick,
  allBanks,
  banks = [],
}: ChildFormProps) => {
  const { employeeId } = useSelector((state: RootState) => state.bioDataForm);
  const [bankCode, setBankCode] = useState<string>("");
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [isAccountNameValid, setIsAccountNameValid] = useState<boolean>(true);

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const { bankDetails } = useSelector((state: RootState) => state.bioDataForm);
  const [updateBankDetails, { isLoading }] = useUpdateBankDetailsMutation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<IBankDetailsFormData>({
    defaultValues: bankDetails as IBankDetailsFormData,
    resolver: yupResolver(bankDetailsSchema),
    mode: "onChange",
    context: { bankCode },
  });

  console.log(bankDetails);

  const resolve = useCallback(
    async (accountNumber: string, bankCode: string) => {
      if (bankCode === "" || bankCode === "OUT") return;

      setIsResolving(true);
      setIsAccountNameValid(true);

      try {
        const response = await resolveBankAccount(accountNumber, bankCode);

        if (response.data.account_name) {
          setValue("accountName", response.data.account_name);
          setIsAccountNameValid(true);
        } else {
          setValue("accountName", "");
          setIsAccountNameValid(false);
          notify.error({
            message: "Verification failed",
            subtitle: "No account found",
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setValue("accountName", "");
        setIsAccountNameValid(false);
        notify.error({
          message: "Verification failed",
          subtitle: getErrorMessage(error),
        });
      } finally {
        setIsResolving(false);
      }
    },
    [setValue],
  );

  const accountNumberRef = useRef<string | null>(null);

  useEffect(() => {
    const subscription = watch(({ accountNumber }) => {
      if (!accountNumber || !bankCode) return;

      const shouldResolve =
        bankCode !== "OUT" &&
        accountNumber.length === 10 &&
        accountNumber !== accountNumberRef.current;

      if (shouldResolve) {
        accountNumberRef.current = accountNumber;
        resolve(accountNumber, bankCode);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, resolve, bankCode]);

  const handleBankChange = (
    selectedOption: ISelectItemPropsWithValueGeneric,
  ) => {
    const selectedBank = banks.find(
      (bank) => bank.bankId === selectedOption.value,
    );

    if (!selectedBank) {
      notify.error({
        message: "Invalid Bank Selection",
        subtitle: "Please select a valid bank",
      });
      return;
    }

    const newBankCode = selectedBank.bankCode;
    setBankCode(newBankCode);

    setValue("accountNumber", "");
    setValue("accountName", "");
    accountNumberRef.current = null;
    setIsAccountNameValid(true);

    fieldSetterAndClearer({
      value: selectedOption,
      setterFunc: setValue,
      setField: "bankId",
      clearErrors: clearErrors,
    });
  };

  const onSubmit = async (data: IBankDetailsFormData) => {
    if (!employeeId) {
      notify.error({
        message: "Missing Employee ID",
        subtitle: "Please ensure you're properly logged in",
      });
      return;
    }

    const apidata: IBankDetailsResponse = {
      employeeId: employeeId,
      bankId: Number(data.bankId?.value),
      oldUser: false,
      accountNumber: data.accountNumber,
      accountName: data.accountName.toUpperCase(),
    };

    try {
      await updateBankDetails(apidata).unwrap();
      dispatch(setBankDetails(data));
      onClick(TAB_QUERIES[9]);
      notify.success({
        message: "Bank details updated successfully",
      });
    } catch (err) {
      notify.error({
        message: "Action failed",
        subtitle: getErrorMessage(err),
      });
    }
  };

  return (
    <FormStepJumbotron
      title="Bank Details"
      currentStep={9}
      totalSteps={TAB_QUERIES.length}
      onBack={() => onClick(TAB_QUERIES[7])}
      onNext={() => submitButtonRef.current?.click()}
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
          Kindly provide your bank details below
        </Typography>
        <div>
          <SMSelectDropDown
            options={allBanks}
            varient="simple"
            isMulti={false}
            label="Bank Name"
            flexStyle="row"
            onChange={handleBankChange}
            value={watch("bankId")}
            placeholder="Select a bank"
            searchable={true}
            isError={!!errors.bankId}
            errorText={errors.bankId?.value?.message}
          />
        </div>
        <div>
          <TextField
            inputType="input"
            type="text"
            placeholder="Enter account number"
            label="Account Number"
            flexStyle="row"
            name={"accountNumber"}
            error={!!errors.accountNumber}
            errorText={errors.accountNumber?.message}
            register={register}
            disabled={!bankCode}
          />
        </div>
        <div className="relative">
          <TextField
            inputType="input"
            type="text"
            placeholder="Enter account name"
            name="accountName"
            label="Account Name"
            flexStyle="row"
            disabled={bankCode !== "OUT"}
            register={register}
            error={!!errors.accountName || !isAccountNameValid}
            errorText={
              errors.accountName?.message ||
              (!isAccountNameValid
                ? "Account name not found. Please ensure the account number is correct."
                : undefined)
            }
          />
          {isResolving && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Spinner height="40%" width="70%" />
            </div>
          )}
        </div>

        <button type="submit" ref={submitButtonRef} className="sr-only">
          Submit
        </button>
      </form>
    </FormStepJumbotron>
  );
};

BankDetails.displayName = "BankDetails";
