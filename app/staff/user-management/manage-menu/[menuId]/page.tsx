"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  EmptyPageState,
  Modal,
  NetworkError,
  PageLoader,
  Typography,
} from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import {
  useGetAllAssginableClaimsQuery,
  useGetAllMenuClaimsQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import { useDebounce } from "@/utils/useDebouncedInput";

import { Breadcrumbs, Crumb } from "@/components/breadCrumbs/breadCrumbs";

import { AddOrEditMenuClaims, ManageMenuClaimsTable } from "./components";

const ManageMenuClaims = ({
  params: { menuId },
}: {
  params: {
    menuId: string;
  };
}) => {
  menuId = decodeURIComponent(menuId);
  const params = useSearchParams();
  const name = params.get("name");
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = PAGE_SIZE.sm;
  const debouncedInput = useDebounce(searchTerm);
  const query = useMemo(() => {
    return {
      pageNumber,
      searchTerm: debouncedInput,
      pageSize,
    };
  }, [pageNumber, pageSize, debouncedInput]);
  const { data, isLoading, isFetching, error, refetch } =
    useGetAllMenuClaimsQuery({
      menuId,
      ...query,
    });
  const { data: claims, isLoading: isLoadingClaims } =
    useGetAllAssginableClaimsQuery();
  const allClaims = claims?.data?.map((claim) => ({
    label: claim.name,
    value: claim.name,
  }));
  const breadCrumbs: Crumb[] = [
    {
      path: AuthRouteConfig.USER_MANAGEMENT_MANAGE_MENU,
      name: "Manage Menu",
    },
    {
      name: name ?? "",
    },
  ];
  if (isLoading || isLoadingClaims) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        refetch={refetch}
        isFetching={isFetching}
      />
    );
  return (
    <div className="flex h-full flex-col gap-6">
      <Modal
        isOpen={open}
        closeModal={() => setOpen(false)}
        title="Add Claims"
        mobileLayoutType="full"
      >
        <AddOrEditMenuClaims
          closeModal={() => setOpen(false)}
          allClaims={allClaims as ISelectItemPropsWithValueGeneric[]}
          menuId={menuId}
        />
      </Modal>
      {data?.data?.items && (data?.data?.items?.length > 0 || searchTerm) && (
        <>
          <div className="flex items-end justify-between">
            <div>
              <Breadcrumbs crumbs={breadCrumbs} />
              <Typography variant={"h-l"} fontWeight={"medium"}>
                {name}
              </Typography>
            </div>
            <Button variant={"primary"} onClick={() => setOpen(true)}>
              Add Claims
            </Button>
          </div>
          <div className="mt-6">
            <ManageMenuClaimsTable
              tableData={data?.data}
              menuId={menuId}
              menu={String(name)}
              pageSize={pageSize}
              searchTerm={searchTerm}
              pageNumber={pageNumber}
              loading={isFetching}
              setPageNumber={setPageNumber}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </>
      )}
      {data?.data?.items && data?.data?.items?.length === 0 && !searchTerm && (
        <div className="flex h-full items-center justify-center">
          <EmptyPageState
            title="No Claims Listed"
            text="There are currently no claims added for this menu. Kindly add claims"
            buttonGroup={
              <>
                <Button
                  variant={"primary"}
                  className="mx-auto mt-6"
                  onClick={() => setOpen(true)}
                >
                  Add Claims
                </Button>
              </>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ManageMenuClaims;
