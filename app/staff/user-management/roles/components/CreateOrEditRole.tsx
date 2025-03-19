import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  Jumbotron,
  NetworkError,
  notify,
  PageLoader,
  TextField,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IMenuClaimsProps,
  useCreateRoleMutation,
  useGetAllAssginableMenuCLaimsQuery,
  useUpdateRoleMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import AccordionWrapper from "@/components/accordions/AccordionWrapper";
import { Breadcrumbs, Crumb } from "@/components/breadCrumbs/breadCrumbs";

import { schema } from "./schema";

interface CreateRoleSchemaProps {
  role: string;
}
interface CreateOrEditRoleProps {
  breadCrumbs: Crumb[];
  editData?: IMenuClaimsProps[];
  role?: string;
  roleId?: string;
}

export const CreateOrEditRole = ({
  breadCrumbs,
  editData,
  role,
  roleId,
}: CreateOrEditRoleProps) => {
  const { push } = useRouter();
  const [isActive, setIsActive] = useState(0);
  const { data, isLoading, error, refetch, isFetching } =
    useGetAllAssginableMenuCLaimsQuery();

  const [selectedMenus, setSelectedMenus] = useState<IMenuClaimsProps[]>([]);
  const [createDRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateRoleSchemaProps>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      role,
    },
  });

  useEffect(() => {
    if (data?.data) {
      if (editData) {
        setSelectedMenus(
          data.data.map((menu) => ({
            menu: menu.menu,
            menuId: menu.menuId,
            claims: editData.find((m) => m.menu === menu.menu)?.claims || [],
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
  }, [data, editData, setValue]);

  const onSubmit: SubmitHandler<CreateRoleSchemaProps> = (values) => {
    const payload = selectedMenus.filter((menu) => menu.claims.length > 0);

    if (payload.length === 0) {
      notify.error({
        message: `Cannot ${editData ? "update" : "create"} role`,
        subtitle: `Please select at least one claim in the permissions!`,
      });
      return;
    }
    const formattedValues = {
      role: values.role,
      menus: payload,
    };
    if (!editData) {
      createDRole(formattedValues)
        .unwrap()
        .then(() => {
          notify.success({
            message: `Added Successfully`,
            subtitle: `You have successfully created ${values.role}`,
          });
          push(AuthRouteConfig.USER_MANAGEMENT_ROLES);
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    } else {
      updateRole({ roleId: String(roleId), ...formattedValues })
        .unwrap()
        .then(() => {
          notify.success({
            message: `Updated Successfully`,
            subtitle: `You have successfully updated ${values.role}`,
          });
          push(AuthRouteConfig.USER_MANAGEMENT_ROLES);
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
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

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        refetch={refetch}
        isFetching={isFetching}
      />
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <Breadcrumbs crumbs={breadCrumbs} />
        <Typography variant={"h-l"} fontWeight={"medium"}>
          {editData ? "Edit Role" : "Create New Role"}
        </Typography>
      </div>
      <Jumbotron
        headerText={editData ? "Edit Role" : "Create New Role"}
        footerContent={
          <div className="flex gap-2 mmlg:w-full mmlg:[&>*]:w-full">
            <Link href={AuthRouteConfig.USER_MANAGEMENT_ROLES}>
              <Button type="button" className="w-full" variant={"secondary"}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={isCreating || isUpdating}>
              {editData ? "Save Changes" : "Create New Role"}
            </Button>
          </div>
        }
      >
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center gap-4 px-5 pb-12 msm:flex-col msm:[&>*]:w-full">
            <label
              htmlFor="role"
              className="text-gray-70 0 block w-[150px] cursor-pointer text-sm font-medium"
            >
              Role Name
            </label>
            <div className="flex-1 flex-grow">
              <TextField
                name="role"
                inputType="input"
                id="role"
                placeholder="Role name"
                type={"text"}
                register={register}
                error={!!errors.role}
                errorText={errors.role && errors.role.message}
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-4 pb-12">
            <Typography className="w-full border-y border-solid border-[#DDDDDD] px-5 py-6">
              Permissions
            </Typography>
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
                      onSelect={(e) =>
                        handleMenuCheck(menu.menu, e.target.checked)
                      }
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
          </div>
        </div>
      </Jumbotron>
    </form>
  );
};
