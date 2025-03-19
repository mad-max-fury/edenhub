import { OptionType } from "@/components";
import { paystackSecretKey } from "@/config";
import {
  EnrollmentStatusType,
  IAppraiserStatus,
  ILeaveApprovalStatus,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";
import axios from "axios";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type FindValueAndLabelProps = {
  value: number;
  label: string;
  [key: string]: number | string; // Allows for other properties as well
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const queryStringToObject = (queryString: string): Record<string, string> => {
  const pairs = queryString.split("&");
  return pairs.reduce(
    (acc, pair) => {
      const [key, value] = pair.split("=");
      if (key) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
};

type QueryParams = Record<
  string,
  string | number | boolean | Array<string | number | boolean>
>;

const objectToQueryString = (queryParams: QueryParams): string => {
  let queries = "?";
  for (const [key, value] of Object.entries(queryParams || {})) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        queries += `${key}=${encodeURIComponent(String(value[i]))}&`;
      }
    } else if (value !== undefined && value !== null) {
      queries += `${key}=${encodeURIComponent(String(value))}&`;
    }
  }
  return queries.slice(0, -1);
};

export function convertToCapitalized(names: string | undefined) {
  if (!names) return "";

  // Split the input string into an array of names using space as the separator
  const nameArray = names.split(" ");

  // Initialize an empty array to store the converted names
  const convertedNames = [];

  // Iterate over each name in the array
  for (const name of nameArray) {
    // Convert the name to lowercase and capitalize the first letter
    const capitalized =
      name.toLowerCase().charAt(0).toUpperCase() + name.toLowerCase().slice(1);

    // Add the converted name to the array
    convertedNames.push(capitalized);
  }

  // Join the converted names back into a single string with spaces
  const result = convertedNames.join(" ");

  return result;
}

export function getInitials(fullname: string, count: number = 2): string {
  const words = fullname ? fullname.trim().split(" ") : [];
  const initials = words
    .map((word) => word[0]?.toUpperCase())
    ?.slice(0, count) // Slice the array to get only the specified number of initials
    ?.join("");

  return initials;
}

export const queryParamsHelper = {
  queryStringToObject,
  objectToQueryString,
};

export function truncateString(str: string, length: number): string {
  if (typeof str !== "string" || typeof length !== "number" || length < 0) {
    throw new Error(
      "Invalid input: Expecting a string and a positive number for length.",
    );
  }

  if (str.length <= length) {
    return str;
  }

  return str.substring(0, length) + "...";
}

export const findValueAndLabel = (
  id: number,
  array: FindValueAndLabelProps[],
  property: string = "value",
  strictCompare: boolean = false,
): { value: number | string; label: string } | null => {
  const found = array.find((item) =>
    strictCompare ? item[property] === id : item[property] == id,
  );
  return found?.value ? { value: found.value, label: found.label } : null;
};

export const formatSelectItems = <T extends object>(
  items: T[],
  label: keyof T,
  value: keyof T,
): ISelectItemPropsWithValueGeneric[] => {
  return items?.length > 0
    ? items.map((data) => {
        const itemValue = data[value];
        return {
          value:
            typeof itemValue === "string" || typeof itemValue === "number"
              ? itemValue
              : String(itemValue),
          label: String(data[label]),
        };
      })
    : [];
};

type FieldSetterAndClearerParams<T> = {
  value: T[keyof T];
  setterFunc: any;
  // setterFunc: (field: keyof T, value: T[keyof T] | null) => void;
  setField: keyof T;
  clearFields?: Array<keyof T>;
  clearErrors: any;
  // clearErrors: (field: keyof T) => void;
};

export const fieldSetterAndClearer = <T>({
  value,
  setterFunc,
  setField,
  clearFields,
  clearErrors,
}: FieldSetterAndClearerParams<T>): void => {
  setterFunc(setField, value);
  clearErrors(setField);
  clearFields?.forEach((field) => {
    setterFunc(field, null);
    clearErrors(field);
  });
};

export function checkIfFilesAreTooBig(file: File, limit = 2): boolean {
  return file.size / (1024 * 1024) <= limit;
}

export function checkIfImagesAreCorrectType(file: File) {
  let valid = true;
  if (file) {
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      valid = false;
    }
  }
  return valid;
}
export function checkIfPdfOrImageAreCorrectType(file: File) {
  let valid = true;
  if (file) {
    if (
      !["image/png", "image/jpg", "image/jpeg", "application/pdf"].includes(
        file.type,
      )
    ) {
      valid = false;
    }
  }
  return valid;
}

export function checkIfFilesAreOfExcelType(file: File) {
  let valid = true;
  if (file) {
    if (
      ![
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type)
    ) {
      valid = false;
    }
  }
  return valid;
}

export function checkIfFileIsPDFType(file: File) {
  let valid = true;
  if (file) {
    if (file.type !== "application/pdf") {
      valid = false;
    }
  }
  return valid;
}

export const findLabelFromOptions = (
  options: ISelectItemPropsWithValueGeneric[] | OptionType[],
  value: string | number,
) => {
  const foundOption = options.find(
    (option) => option?.value?.toString() === value?.toString(),
  );
  return foundOption?.label ?? "";
};

export function getSelectedOption(
  options: ISelectItemPropsWithValueGeneric[] | OptionType[],
  value: string | undefined | null,
): ISelectItemPropsWithValueGeneric | null {
  if (!value) return null;
  return (
    options.find((option) => option.value.toString() === value.toString()) ||
    null
  );
}

export const formatInputDate = ({
  minYear,
  maxYear,
  useFullYear = false,
}: {
  minYear?: number;
  maxYear?: number;
  useFullYear?: boolean;
}) => {
  const dateObject = new Date();
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1;
  const date = dateObject.getDate();

  const adjustedYear = minYear
    ? year - minYear
    : maxYear
      ? year + maxYear
      : year;

  const formattedDate = useFullYear
    ? `${adjustedYear}-12-31`
    : `${adjustedYear}-${month < 10 ? "0" + month : month}-${date < 10 ? "0" + date : date}`;

  return formattedDate;
};

export function generateYearOptions(
  endYear: number,
  yearToEnd?: number,
): { label: string; value: number }[] {
  const currentYear = yearToEnd ?? new Date().getFullYear();

  const yearOptions = [];

  for (let year = currentYear; year >= endYear; year--) {
    yearOptions.push({
      label: year.toString(),
      value: year,
    });
  }

  return yearOptions;
}

export const toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (_, c) => c.toLowerCase());
};

export function findObjectByValue<T>(
  data: T,
  searchValue: string,
): Partial<T> | null {
  // Helper function to check if an object contains the search value
  const hasValue = (obj: unknown): boolean => {
    if (!obj || typeof obj !== "object") {
      return false;
    }

    return Object.values(obj as Record<string, unknown>).some(
      (value) =>
        value === searchValue ||
        (typeof value === "string" && value.includes(searchValue)),
    );
  };

  // Recursive function to search through nested objects
  const searchObject = (obj: unknown): Partial<T> | null => {
    if (!obj || typeof obj !== "object") {
      return null;
    }

    if (hasValue(obj)) {
      return obj as Partial<T>;
    }

    if (Array.isArray(obj)) {
      for (const item of obj) {
        const result = searchObject(item);
        if (result) {
          return result;
        }
      }
      return null;
    }

    for (const value of Object.values(obj as Record<string, unknown>)) {
      const result = searchObject(value);
      if (result) {
        return result;
      }
    }

    return null;
  };

  return searchObject(data);
}

export const getEnrollmentBadgeVariant = (status: EnrollmentStatusType) => {
  switch (status) {
    case "Pending":
      return "yellow";
    case "Completed":
      return "green";
    case "In Progress":
      return "blue";
    case "Withdrawn":
      return "red";
    case "Continue":
      return "gray";
    default:
      return "blue";
  }
};

export const getAppraiserBadgeVariant = (status: IAppraiserStatus) => {
  switch (status) {
    case "Un-appraised":
      return "yellow";
    case "Completed":
      return "green";
    case "In Progress":
      return "blue";
    default:
      return "yellow";
  }
};

export const getLeaveApprovalStatusBadgeVariant = (
  status: ILeaveApprovalStatus,
) => {
  switch (status) {
    case "Pending":
      return "yellow";
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    default:
      return "yellow";
  }
};

export function shortDate(input: string): string {
  const date = new Date(input);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDate(data: string): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(data);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const daySuffix = (n: number): string => {
    if (n >= 11 && n <= 13) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${daySuffix(day)} ${month}, ${year}`;
}

export function daysToWorkAnniversary(dateStr: string): string {
  const inputDate = new Date(dateStr);
  const today = new Date();

  // Set times to midnight to ignore the time part
  today.setHours(0, 0, 0, 0);
  const anniversary = new Date(
    today.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate(),
  );

  // If the anniversary date for this year has already passed, set it to the next year
  if (anniversary < today) {
    anniversary.setFullYear(today.getFullYear() + 1);
  }

  // Calculate the difference in days
  const msInDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.ceil(
    (anniversary.getTime() - today.getTime()) / msInDay,
  );

  return daysDifference === 0 ? "Today" : `${daysDifference}`;
}

export function daysToBirthday(dateStr: string): string {
  const inputDate = new Date(dateStr);
  const today = new Date();

  // Set times to midnight to ignore the time part
  today.setHours(0, 0, 0, 0);

  // Set birthday to this year with the same month and day as the input date
  const birthday = new Date(
    today.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate(),
  );

  // If the birthday for this year has already passed, move it to the next year
  if (birthday < today) {
    birthday.setFullYear(today.getFullYear() + 1);
  }

  // Calculate the difference in days
  const msInDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.ceil(
    (birthday.getTime() - today.getTime()) / msInDay,
  );

  return daysDifference === 0 ? "Today" : `${daysDifference}`;
}

export function formatDateToShortForm(dateString: string): string {
  const inputDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  const tomorrow = new Date();

  yesterday.setDate(today.getDate() - 1);
  tomorrow.setDate(today.getDate() + 1);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };

  if (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  } else if (
    inputDate.getDate() === yesterday.getDate() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  } else if (
    inputDate.getDate() === tomorrow.getDate() &&
    inputDate.getMonth() === tomorrow.getMonth() &&
    inputDate.getFullYear() === tomorrow.getFullYear()
  ) {
    return "Tomorrow";
  } else {
    return inputDate.toLocaleDateString("en-US", options);
  }
}

type ResolveAccountResponse = {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
};

export async function resolveBankAccount(
  accountNumber: string,
  bankCode: string,
): Promise<ResolveAccountResponse> {
  const url = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;

  try {
    const response = await axios.get<ResolveAccountResponse>(url, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;
        throw new Error(
          `Error ${status}: ${data.message || "Unable to resolve account"}`,
        );
      }
      throw new Error(`Axios Error: ${error.message}`);
    }
    throw new Error(`Unexpected error: ${String(error)}`);
  }
}

export function objectToFormData<T extends Record<string, any>>(
  obj: T,
): FormData {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(`${key}[${index}]`, item);
        } else {
          formData.append(`${key}[${index}]`, String(item));
        }
      });
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (nestedValue instanceof File || nestedValue instanceof Blob) {
          formData.append(`${key}[${nestedKey}]`, nestedValue);
        } else {
          formData.append(`${key}[${nestedKey}]`, String(nestedValue));
        }
      });
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}
