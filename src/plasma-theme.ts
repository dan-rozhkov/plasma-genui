import { light } from "@salutejs/plasma-tokens-web/themes";
import { dark } from "@salutejs/plasma-tokens-web/themes";
import {
  soulmateTypoObject,
} from "@salutejs/plasma-typo";
import { prepareStandardBreakpointTypo } from "@salutejs/plasma-typo/lib/esm/helpers";

function injectVars(vars: Record<string, string>, selector: string) {
  const css = Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n");

  const style = document.createElement("style");
  style.textContent = `${selector} {\n${css}\n}`;
  document.head.appendChild(style);
}

// Build typography CSS variables (--plasma-typo-h1-*, --plasma-typo-body-l-*, etc.)
// soulmateTypoObject uses SB Sans Text + SB Sans Display fonts
const typoM = soulmateTypoObject.typoM;
const textFont = soulmateTypoObject.textFontFamily ?? "SB Sans Text";
const displayFont = soulmateTypoObject.displayFontFamily ?? "SB Sans Display";
const commonProps = soulmateTypoObject.getTypoCommonProps?.(displayFont, textFont) ?? ({} as Record<string, Record<string, string>>);

const merged: Record<string, Record<string, string>> = {};
for (const [key, props] of Object.entries(typoM ?? {})) {
  merged[key] = {
    ...(props as Record<string, string>),
    ...((commonProps as Record<string, Record<string, string>>)[key] || {}),
    "font-family": key.startsWith("dspl") ? displayFont : textFont,
  };
}

const typoVars = prepareStandardBreakpointTypo(merged);
injectVars(typoVars as Record<string, string>, ":root");

// Inject color theme tokens
const fontOverrides = {
  "--plasma-typo-font-family": `'${textFont}', sans-serif`,
  "--plasma-typo-display-font-family": `'${displayFont}', sans-serif`,
};

const lightVars = light[":root"];
if (lightVars) {
  injectVars(
    {
      ...lightVars,
      ...fontOverrides,
    },
    ":root",
  );
}

const darkVars = dark[":root"];
if (darkVars) {
  injectVars(
    {
      ...darkVars,
      ...fontOverrides,
    },
    ".dark",
  );
}
