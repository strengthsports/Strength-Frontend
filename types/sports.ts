export interface SportsList {
  _id: string;
  logo: string;
  name: string;
  defaultProperties: Array<{
    name: string;
    enumValues: Array<string>;
  }>;
}
