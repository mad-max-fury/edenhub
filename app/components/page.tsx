"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Chevron from "@/assets/svgs/chevron-down.svg";
import { NewArrivalMan, NewArrivalWomen } from "@/assets/images";
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonDropdownItem,
  FileUpload,
  FileUploadSingle,
  Footer,
  GlobalMenu,
  Modal,
  notify,
  PageLoader,
  SearchInput,
  SideTab,
  TabUnderline,
  TextField,
  Typography,
  ValidationText,
  ImageOverlay,
  Reviewer,
} from "@/components";
import { queryParamsHelper } from "@/utils/helpers";

import UserTable from "./_component/tableExample";

const AvailableComponentsExample = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allQueryParamsObj = queryParamsHelper.queryStringToObject(
    searchParams.toString()
  );
  const activeQueryTab = searchParams.get("t") || "staff-list";
  const activeQuerySideTab = searchParams.get("s") || "staff-list";

  const [activeTab, setActiveTab] = useState("staff-list");
  const [activeSideTab, setActiveSideTab] = useState("staff-list");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);

  const tabs = [
    {
      label: "Staff List",
      query: "staff-list",
      content: <div>This is Tab 1 content using useState</div>,
    },
    {
      label: "Roles",
      query: "roles",
      content: <div>This is Tab 2 content using useState</div>,
    },
    {
      label: "Schools",
      query: "schools",
      content: <div>This is Tab 3 content using useState</div>,
    },
  ];
  const queryTabs = [
    {
      label: "Staff List",
      query: "staff-list",
      count: 20,
      content: <div>This is Tab 1 content using URL query params as state</div>,
    },
    {
      label: "Roles",
      query: "roles",
      count: 15,
      content: <div>This is Tab 2 content using URL query params as state</div>,
    },
    {
      label: "Genesys Core Values",
      query: "schools",
      count: 3,
      content: <div>This is Tab 3 content using URL query params as state</div>,
      isDisabled: true,
    },
  ];
  const buttonGroup: ButtonDropdownItem[] = [
    {
      name: "View",
      onClick: () => {},
    },
    {
      name: "Edit",
      onClick: () => {},
    },
    {
      name: "Delete",
      textColor: "R300",
      onClick: () => {},
    },
  ];
  const handleTabChange = (query: Record<string, string>) => {
    const qString = queryParamsHelper.objectToQueryString({
      ...allQueryParamsObj,
      ...query,
    });
    return router.push(qString, {
      scroll: false,
    });
  };

  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    searchTerm: string
  ) => {
    e.preventDefault();
    console.log("Search submitted with term:", searchTerm);
    // Handle the search logic here
  };

  return (
    <div className="isolate text-gray-900">
      <GlobalMenu />
      <Typography
        variant="h-xxl"
        fontWeight={"black"}
        color={"N0"}
        className="sticky left-0 right-0 top-[70px] z-10 bg-BR400 px-4 py-6"
        gutterBottom
      >
        <div className="max-w-screen-2xl mx-auto w-full">
          Components Examples
        </div>
      </Typography>
      <div className="px-6 max-w-screen-2xl mx-auto">
        <Typography
          variant="h-xl"
          fontWeight={"bold"}
          color={"N100"}
          gutterBottom
          className="bg-blue-200 px-4 py-2"
        >
          Typography Examples:
        </Typography>
        <div className="mb-8">
          <Typography
            variant="h-xl"
            fontWeight={"medium"}
            color={"R500"}
            className="mb-4"
          >
            Headings
          </Typography>
          <Typography variant="h-l" className="mb-2">
            H3 Heading
          </Typography>
          <Typography variant="h-m" className="mb-2">
            H4 Heading
          </Typography>
          <Typography variant="h-s" className="mb-2">
            H5 Heading
          </Typography>
          <Typography variant="h-xs" className="mb-2">
            H6 Heading
          </Typography>
        </div>
        <div className="mb-8">
          <Typography
            variant="h-xl"
            fontWeight="medium"
            color={"R500"}
            className="mb-4"
          >
            Paragraphs
          </Typography>
          <Typography variant="p-xxl" className="mb-2">
            This is a p-xxl paragraph. It is used for very large text content.
          </Typography>
          <Typography variant="p-xl" className="mb-2">
            This is a p-xl paragraph. It is used for extra large text content.
          </Typography>
          <Typography variant="p-l" className="mb-2">
            This is a p-l paragraph. It is used for large text content.
          </Typography>
          <Typography variant="p-m" className="mb-2">
            This is a p-m paragraph. It is used for medium text content.
          </Typography>
          <Typography variant="p-s" className="mb-2">
            This is a p-s paragraph. It is used for small text content.
          </Typography>
        </div>
        <div className="mb-8">
          <Typography
            variant="h-xl"
            fontWeight="medium"
            color="R500"
            className="mb-4"
          >
            Other Text Styles (Controls)
          </Typography>
          <Typography variant="c-xxl" className="mb-2">
            This is a c-xxl control text. It is used for extra extra large
            control text.
          </Typography>
          <Typography variant="c-xl" className="mb-2">
            This is a c-xl control text. It is used for extra large control
            text.
          </Typography>
          <Typography variant="c-l" className="mb-2">
            This is a c-l control text. It is used for large control text.
          </Typography>
          <Typography variant="c-m" className="mb-2">
            This is a c-m control text. It is used for medium control text.
          </Typography>
          <Typography variant="c-s" className="mb-2">
            This is a c-s control text. It is used for small control text.
          </Typography>
        </div>

        <p>Validation text for success</p>
        <ValidationText status="success" message="Some helpful text" />

        <p>Validation text for error</p>
        <ValidationText status="error" message="Some helpful text" />

        <TextField
          inputType="input"
          name="disabled"
          type="text"
          placeholder="Placeholder"
          disabled={true}
          label="Disabled Input"
        />

        <TextField
          inputType="input"
          name="enabled"
          type="text"
          placeholder="Placeholder"
          icon={<Chevron />}
          label="Input with Icon"
        />

        <TextField
          inputType="input"
          name="iconEnabled"
          type="text"
          placeholder="Placeholder"
          label="Input without Icon"
        />

        <TextField
          inputType="textarea"
          name="textarea"
          placeholder="Placeholder"
          error={true}
          errorText="this was a mistake"
          label="Textarea input with error"
        />

        <TextField
          type="password"
          placeholder="Placeholder"
          name="password"
          label="Password Input"
        />

        <SearchInput
          placeholder="Search for something..."
          onSubmit={handleSearchSubmit}
          onChange={() => {}}
          className="mb-4"
          ariaLabel="Search"
        />

        <Typography
          variant="h-xl"
          fontWeight={"bold"}
          color={"N100"}
          gutterBottom
          className="bg-Y50 px-4 py-2"
        >
          Tabs Examples:
        </Typography>

        <div className="mb-8">
          <div>
            <Typography>
              Tab popover example
              <Link href={"/components/layout-example"}>
                View this component useage
              </Link>
            </Typography>
          </div>
          <TabUnderline
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          <TabUnderline
            tabs={queryTabs}
            activeTab={activeQueryTab}
            onChange={(t) => handleTabChange({ t })}
          />
          <br />
          <SideTab
            tabs={tabs}
            activeTab={activeSideTab}
            onChange={setActiveSideTab}
          />
          <SideTab
            tabs={queryTabs}
            activeTab={activeQuerySideTab}
            onChange={(s) => handleTabChange({ s })}
          />
        </div>

        <Typography
          variant="h-xl"
          fontWeight={"bold"}
          color={"N100"}
          gutterBottom
          className="bg-G50 px-4 py-2"
        >
          Button Examples:
        </Typography>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary Filled</Button>
          <Button variant="primary" types="outline">
            Primary Outline
          </Button>
          <Button variant="primary" disabled>
            Primary disabled
          </Button>

          <Button variant="secondary">Secondary Filled</Button>
          <Button variant="secondary" types="outline">
            Secondary Outline
          </Button>
          <Button variant="secondary" disabled>
            Secondary disabled
          </Button>

          <Button variant="danger">Danger Filled</Button>
          <Button variant="danger" types="outline">
            Danger Outline
          </Button>
          <Button variant="danger" disabled>
            Danger disabled
          </Button>

          <Button variant="tertiary">Tertiary Filled</Button>
          <Button variant="tertiary" types="outline">
            Tertiary Outline
          </Button>
          <Button variant="tertiary" disabled>
            Tertiary disabled
          </Button>

          <Button variant={"brown"} shape={"pill"}>
            Brown
          </Button>
          <Button variant={"brown-light"} shape={"pill"}>
            Light brown
          </Button>
          <Button variant={"gold"}>Gold</Button>
          <Button variant={"primary"} types="outline" shape={"pill"}>
            Pill Shape
          </Button>

          <Button variant="neutral">Neutral Filled</Button>
          <Button variant="neutral" types="outline">
            Neutral Outline
          </Button>
          <Button variant="neutral" disabled>
            Neutral disabled
          </Button>
          <Button loading variant="primary">
            Primary loading
          </Button>
          <Button loading variant="secondary">
            Secondary loading
          </Button>
          <Button loading variant="danger">
            Danger loading
          </Button>
          <Button loading variant="tertiary">
            Tertiary loading
          </Button>
          <Button loading variant="neutral">
            Neutral loading
          </Button>
        </div>

        <Typography
          variant="h-xl"
          fontWeight={"bold"}
          color={"N200"}
          gutterBottom
          className="bg-R50 px-4 py-2"
        >
          Dropdown Examples:
        </Typography>
        <div className="mb-8 flex h-[300px] flex-wrap">
          <ButtonDropdown buttonGroup={buttonGroup} />

          <Button
            variant={"primary"}
            className="ml-4 h-fit"
            onClick={() => {
              notify.success({
                message: "Test Passed",
                subtitle: "Test Passed well!",
              });
            }}
          >
            show success notifications
          </Button>
          <Button
            variant={"danger"}
            className="ml-4 h-fit"
            onClick={() => {
              notify.error({
                message: "Test Failed",
                subtitle: "Test Failed badly!",
              });
            }}
          >
            show error notifications
          </Button>
          <Button
            variant={"primary"}
            className="ml-4 h-fit"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Open modal
          </Button>
          <Button
            variant={"primary"}
            className="ml-4 h-fit"
            onClick={() => {
              setIsFullModalOpen(true);
            }}
          >
            Open full modal
          </Button>
        </div>

        <Typography
          variant="h-xl"
          fontWeight={"bold"}
          color={"N200"}
          gutterBottom
          className="bg-R50 px-4 py-2"
        >
          Table Examples:
        </Typography>
        <div className="mb-8">
          <UserTable />
        </div>

        <Typography variant="h-xl" fontWeight={"bold"} color={"N200"}>
          Loader Component
        </Typography>
        <PageLoader />
        <FileUpload name="file" />
        <FileUploadSingle name="singleFile" />
        <Typography
          variant="h-xl"
          fontWeight={"bold"}
          color={"N200"}
          gutterBottom
          className="bg-R50 px-4 py-2"
        >
          Badge Examples:
        </Typography>
        <div className="flex gap-4 py-6 flex-wrap">
          <Badge variant="yellow" />
          <Badge variant="green" text="Custom Active" />
          <Badge variant="blue" />
          <Badge variant="red" text="Error" />
          <Badge variant="purple" text="New Feature" />
          <Badge variant="teal" text="Information" />
        </div>
        <Typography
          variant="h-xl"
          fontWeight={"bold"}
          color={"N200"}
          className="bg-R100"
        >
          Image Overlay Component
        </Typography>
        <div className="my-4 flex flex-col md:flex-row gap-4">
          <ImageOverlay imageURL={NewArrivalMan} />
          <ImageOverlay
            imageURL={NewArrivalWomen}
            mainText="WOMEN"
            subText="NEW ARRIVAL"
          />
        </div>
        <Typography
          variant="h-xl"
          fontWeight={"bold"}
          color={"N300"}
          className="bg-LB300"
        >
          Review Component
        </Typography>
        <div className="my-14 flex flex-col md:flex-row gap-4 ">
          <Reviewer
            name="John Doe"
            review="I’ve owned many luxury watches, but nothing compares to the craftsmanship and personal touch of my Eden Wood timepiece. The ability to customize every detail made it feel truly mine. Worth every penny!"
            imageURL={NewArrivalMan}
          />
          <Reviewer name="Ginger" review="This is a review" imageURL={NewArrivalWomen} />
        </div>
      </div>

      <Footer />

      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        title="Modal Title"
        closeOnOutsideClick={false}
        mobileLayoutType="normal"
      >
        {/* // content  */}
        <div className="px-6 pb-4 text-left">
          <h2 className="mb-4 text-xl font-bold">Modal Title</h2>
          <p className="mb-4">
            This is the content of the modal. You can put any React components
            or HTML here.
          </p>
          <Button
            variant={"danger"}
            className="h-fit"
            onClick={() => setIsModalOpen(false)}
          >
            Close Modal
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={isFullModalOpen}
        closeModal={() => setIsFullModalOpen(false)}
        title="Modal Title"
        closeOnOutsideClick={false}
        mobileLayoutType="full"
      >
        {/* // content  */}
        <div className="px-6 pb-4 text-left">
          <h2 className="mb-4 text-xl font-bold">Modal Title</h2>
          <p className="mb-4">
            This is a slightly different modal, look at it on a smaller screen!
          </p>
          <Button
            variant={"danger"}
            className="h-fit"
            onClick={() => setIsFullModalOpen(false)}
          >
            Close Modal
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AvailableComponentsExample;
