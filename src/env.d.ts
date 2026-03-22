declare module "styled-components";
declare module "@salutejs/plasma-typo/lib/esm/helpers" {
  export function prepareStandardBreakpointTypo(
    merged: Record<string, Record<string, string>>,
  ): Record<string, string>;
}
