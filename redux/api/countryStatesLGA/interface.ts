export interface ICountryProps {
  id: number;
  name: string;
}
export interface IStateProps extends ICountryProps {}
export interface ILGAProps extends ICountryProps {}
