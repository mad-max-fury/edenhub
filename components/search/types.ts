import { ChangeEvent, ChangeEventHandler, FormEvent } from "react";

export type OnSubmitType = (
  event: FormEvent<HTMLFormElement>,
  searchTerm: string
) => void;

export type OnChangeType = (
  event: ChangeEvent<HTMLInputElement>,
  searchTerm: string
) => void;

export interface ISearchProps {
  placeholder?: string;
  onSubmit?: OnSubmitType;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  className?: string;
  value?: string;
  name?: string;
  id?: string;
  ariaLabel: string;
  // onSubmit: (e) => void;
}
