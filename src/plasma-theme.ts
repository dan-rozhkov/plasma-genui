import { light } from "@salutejs/plasma-tokens-web/themes";

const vars = light[":root"];
if (vars) {
  const css = Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n");

  const style = document.createElement("style");
  style.textContent = `:root {
${css}
--plasma-typo-font-family: 'SB Sans Text', sans-serif;
--plasma-typo-display-font-family: 'SB Sans Display', sans-serif;
}`;
  document.head.appendChild(style);
}
