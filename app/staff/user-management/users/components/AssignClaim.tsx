import React, { useEffect, useState } from "react";
import { Button, Checkbox, notify, PageLoader } from "@/components";
import {
  IMenuClaimsProps,
  IUserProps,
  useGetAllAssginableMenuCLaimsQuery,
  useGetAllUserMenuClaimsQuery,
  useUpdateUserClaimsMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";

import AccordionWrapper from "@/components/accordions/AccordionWrapper";

interface IAssignClaimProps {
  closeModal: () => void;
  toggleShowTable?: () => void;
  editData?: IUserProps | null;
}

export const AssignClaim = ({ closeModal, editData }: IAssignClaimProps) => {
  const [isActive, setIsActive] = useState(0);
  const [selectedMenus, setSelectedMenus] = useState<IMenuClaimsProps[]>([]);
  const { data, isLoading } = useGetAllAssginableMenuCLaimsQuery();
  const { data: userMenus, isLoading: isLoadingUserMenus } =
    useGetAllUserMenuClaimsQuery({ userId: editData?.userId as string });
  const [createUserClaims, { isLoading: isUpdating }] =
    useUpdateUserClaimsMutation();
  useEffect(() => {
    if (data?.data) {
      if (userMenus?.data) {
        setSelectedMenus(
          data.data.map((menu) => ({
            menu: menu.menu,
            menuId: menu.menuId,
            claims:
              userMenus?.data.find((m) => m.menu === menu.menu)?.claims || [],
          })),
        );
      } else {
        setSelectedMenus(
          data.data.map((menu) => ({
            menu: menu.menu,
            menuId: menu.menuId,
            claims: [],
          })),
        );
      }
    }
  }, [data, userMenus?.data]);
  const onSubmit = () => {
    const payload = selectedMenus.filter((menu) => menu.claims.length > 0);

    if (payload.length === 0) {
      notify.error({
        message: `Cannot update this user's claims`,
        subtitle: `Please select at least one claim in the permissions!`,
      });
      return;
    }
    const formattedValues = {
      userId: String(editData?.userId),
      menus: payload,
    };
    createUserClaims(formattedValues)
      .unwrap()
      .then(() => {
        notify.success({
          message: `Claims Assigned`,
          subtitle: `You have successfully assigned claims to ${editData?.firstname} ${editData?.lastname}`,
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

  const handleMenuCheck = (menuName: string, isChecked: boolean) => {
    const originalMenu = data?.data.find((m) => m.menu === menuName);
    if (!originalMenu || originalMenu.claims.length === 0) {
      return; // Don't update if there are no claims
    }
    setSelectedMenus((prev) =>
      prev.map((menu) =>
        menu.menu === menuName
          ? {
              ...menu,
              claims: isChecked ? originalMenu.claims : [],
            }
          : menu,
      ),
    );
  };

  const handleClaimCheck = (
    menuName: string,
    claim: string,
    isChecked: boolean,
  ) => {
    setSelectedMenus((prev) =>
      prev.map((menu) =>
        menu.menu === menuName
          ? {
              ...menu,
              claims: isChecked
                ? [...menu.claims, claim]
                : menu.claims.filter((c) => c !== claim),
            }
          : menu,
      ),
    );
  };

  const isMenuFullyChecked = (menuName: string) => {
    const menu = selectedMenus.find((m) => m.menu === menuName);
    const originalMenu = data?.data.find((m) => m.menu === menuName);
    return (
      menu &&
      originalMenu &&
      originalMenu.claims.length > 0 &&
      menu.claims.length === originalMenu.claims.length
    );
  };

  const isMenuPartiallyChecked = (menuName: string) => {
    const menu = selectedMenus.find((m) => m.menu === menuName);
    const originalMenu = data?.data.find((m) => m.menu === menuName);
    return (
      menu &&
      originalMenu &&
      menu.claims.length > 0 &&
      menu.claims.length < originalMenu.claims.length
    );
  };

  if (isLoading || isLoadingUserMenus) return <PageLoader />;
  return (
    <form className="flex h-full flex-col justify-between">
      <div className="w-full px-4">
        {data?.data.map((menu, index) => (
          <AccordionWrapper
            key={index}
            isOpen={isActive === index}
            toggleAccordion={() => setIsActive(index)}
            title={
              <Checkbox
                checked={isMenuFullyChecked(menu.menu)}
                indeterminate={isMenuPartiallyChecked(menu.menu)}
                label={menu.menu}
                onSelect={(e) => handleMenuCheck(menu.menu, e.target.checked)}
                disabled={menu.claims.length === 0}
              />
            }
          >
            <div className="flex w-full flex-wrap gap-6">
              {menu.claims.map((claim, claimIndex) => (
                <Checkbox
                  key={claimIndex}
                  checked={selectedMenus
                    .find((m) => m.menu === menu.menu)
                    ?.claims.includes(claim)}
                  label={claim}
                  onSelect={(e) =>
                    handleClaimCheck(menu.menu, claim, e.target.checked)
                  }
                />
              ))}
            </div>
          </AccordionWrapper>
        ))}
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
          loading={isUpdating}
          type="button"
          onClick={onSubmit}
        >
          {editData ? "Save" : "Assign Claim"}
        </Button>
      </div>
    </form>
  );
};
