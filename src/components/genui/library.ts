import { jsx as _jsx, jsxs as _jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { z } from "zod";
import { defineComponent, createLibrary, useTriggerAction, useFormName, useIsStreaming } from "@openuidev/react-lang";
import type { PromptOptions } from "@openuidev/react-lang";

import {
  Button as PlasmaButton,
  Card as PlasmaCard,
  CardContent as PlasmaCardContent,
  TextField as PlasmaTextField,
  TextArea as PlasmaTextArea,
  Checkbox as PlasmaCheckbox,
  Switch as PlasmaSwitch,
  Badge as PlasmaBadge,
  Tabs as PlasmaTabs,
  TabItem as PlasmaTabItem,
  Accordion as PlasmaAccordion,
  AccordionItem as PlasmaAccordionItem,
  Progress as PlasmaProgress,
  Rating as PlasmaRating,
  Price as PlasmaPrice,
  Avatar as PlasmaAvatar,
  Chip as PlasmaChip,
  Link as PlasmaLink,
  Image as PlasmaImage,
  Notification as PlasmaNotification,
  Radiobox as PlasmaRadiobox,
  Slider as PlasmaSlider,
  Counter as PlasmaCounter,
  Select as PlasmaSelect,
  Divider as PlasmaDivider,
  Breadcrumbs as PlasmaBreadcrumbs,
  Pagination as PlasmaPagination,
  Steps as PlasmaSteps,
  Container as PlasmaContainer,
  Row as PlasmaRow,
  Col as PlasmaCol,
  H1, H2, H3, H4,
  BodyL, BodyM, BodyS,
} from "@salutejs/plasma-web";

// ========================================================
// Helpers
// ========================================================

const P = (props: Record<string, unknown>) => props as any;

// ========================================================
// 1. Typography
// ========================================================

export const TextContent = defineComponent({
  name: "TextContent",
  props: z.object({
    text: z.string(),
    size: z.enum(["h1", "h2", "h3", "h4", "body-l", "body-m", "body-s"]).optional(),
  }),
  description: 'Text block. size: "h1"|"h2"|"h3"|"h4"|"body-l"|"body-m" (default)|"body-s".',
  component: ({ props }) => {
    const text = props.text ?? "";
    switch (props.size) {
      case "h1": return _jsx(H1, { children: text });
      case "h2": return _jsx(H2, { children: text });
      case "h3": return _jsx(H3, { children: text });
      case "h4": return _jsx(H4, { children: text });
      case "body-l": return _jsx(BodyL, { children: text });
      case "body-s": return _jsx(BodyS, { children: text });
      default: return _jsx(BodyM, { children: text });
    }
  },
});

export const CardHeaderDef = defineComponent({
  name: "CardHeader",
  props: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
  }),
  description: "Header with optional title and subtitle.",
  component: ({ props }) =>
    _jsx("div", {
      style: { marginBottom: "4px" },
      children: _jsxs("div", {
        children: [
          props.title ? _jsx(H3, { children: props.title }) : null,
          props.subtitle ? _jsx(BodyS, { style: { color: "var(--plasma-colors-secondary)" }, children: props.subtitle }) : null,
        ].filter(Boolean),
      }),
    }),
});

export const LinkDef = defineComponent({
  name: "Link",
  props: z.object({
    text: z.string(),
    url: z.string(),
  }),
  description: "Clickable text link.",
  component: ({ props }) =>
    _jsx(PlasmaLink, P({ href: props.url, target: "_blank", rel: "noopener", children: props.text })),
});

export const ImageDef = defineComponent({
  name: "Image",
  props: z.object({
    src: z.string(),
    alt: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
  }),
  description: "Image element. src: URL. width/height: CSS values.",
  component: ({ props }) =>
    _jsx(PlasmaImage, P({
      src: props.src,
      alt: props.alt ?? "",
      style: { width: props.width ?? "100%", height: props.height ?? "auto", borderRadius: "8px" },
    })),
});

// ========================================================
// 2. Cards
// ========================================================

export const CardDef = defineComponent({
  name: "Card",
  props: z.object({
    children: z.array(z.any()),
    size: z.enum(["l", "m", "s"]).optional(),
  }),
  description: 'Card container. size: "l"|"m" (default)|"s".',
  component: ({ props, renderNode }) =>
    _jsx(PlasmaCard, P({
      size: props.size ?? "m",
      style: { padding: "16px", width: "100%" },
      children: _jsx(PlasmaCardContent, P({
        style: { display: "flex", flexDirection: "column", gap: "12px" },
        children: renderNode(props.children),
      })),
    })),
});

// ========================================================
// 3. Buttons
// ========================================================

export const ButtonDef = defineComponent({
  name: "Button",
  props: z.object({
    label: z.string(),
    action: z.object({
      type: z.string(),
      url: z.string().optional(),
      context: z.string().optional(),
    }).optional(),
    view: z.enum(["default", "accent", "secondary", "clear", "success", "warning", "critical"]).optional(),
    size: z.enum(["xl", "l", "m", "s", "xs"]).optional(),
  }),
  description: 'Clickable button. view: "default"|"accent"|"secondary"|"clear"|"success"|"warning"|"critical". size: "xl"|"l"|"m" (default)|"s"|"xs".',
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    const formName = useFormName();
    const isStreaming = useIsStreaming();
    return _jsx(PlasmaButton, P({
      view: props.view ?? "default",
      size: props.size ?? "m",
      disabled: isStreaming,
      onClick: () => {
        const action = props.action;
        triggerAction(props.label, formName, {
          type: action?.type ?? "ContinueConversation",
          params: action?.url ? { url: action.url } : {},
        });
      },
      children: props.label,
    }));
  },
});

export const ButtonsDef = defineComponent({
  name: "Buttons",
  props: z.object({
    buttons: z.array(ButtonDef.ref),
    direction: z.enum(["row", "column"]).optional(),
  }),
  description: 'Group of Button components. direction: "row" (default)|"column".',
  component: ({ props, renderNode }) =>
    _jsx("div", {
      style: { display: "flex", flexDirection: props.direction ?? "row", gap: "8px", flexWrap: "wrap" },
      children: renderNode(props.buttons),
    }),
});

// ========================================================
// 4. Form components
// ========================================================

export const InputDef = defineComponent({
  name: "Input",
  props: z.object({
    label: z.string().optional(),
    placeholder: z.string().optional(),
    size: z.enum(["xl", "l", "m", "s", "xs"]).optional(),
    status: z.enum(["default", "positive", "warning", "negative"]).optional(),
  }),
  description: 'Text input. size: "l" (default)|"m"|"s"|"xs"|"xl". status: "default"|"positive"|"warning"|"negative".',
  component: ({ props }) =>
    _jsx("div", {
      style: { width: "100%" },
      children: _jsx(PlasmaTextField, P({
        label: props.label, placeholder: props.placeholder,
        size: props.size ?? "l", view: props.status ?? "default",
      })),
    }),
});

export const TextAreaDef = defineComponent({
  name: "TextArea",
  props: z.object({
    label: z.string().optional(),
    placeholder: z.string().optional(),
    rows: z.number().optional(),
    size: z.enum(["xl", "l", "m", "s", "xs"]).optional(),
  }),
  description: 'Multi-line text input. rows: visible rows. size: "l" (default)|"m"|"s"|"xs"|"xl".',
  component: ({ props }) =>
    _jsx("div", {
      style: { width: "100%" },
      children: _jsx(PlasmaTextArea, P({
        label: props.label, placeholder: props.placeholder,
        rows: props.rows ?? 3, size: props.size ?? "l",
      })),
    }),
});

export const CheckboxDef = defineComponent({
  name: "Checkbox",
  props: z.object({
    label: z.string(),
    description: z.string().optional(),
    size: z.enum(["s", "m", "l"]).optional(),
  }),
  description: "Checkbox with label.",
  component: ({ props }) =>
    _jsx(PlasmaCheckbox, P({ label: props.label, description: props.description, size: props.size ?? "m" })),
});

export const SwitchDef = defineComponent({
  name: "Switch",
  props: z.object({
    label: z.string(),
    description: z.string().optional(),
    size: z.enum(["s", "m", "l"]).optional(),
  }),
  description: "Toggle switch with label.",
  component: ({ props }) =>
    _jsx(PlasmaSwitch, P({ label: props.label, description: props.description, size: props.size ?? "m" })),
});

export const RadioItemDef = defineComponent({
  name: "RadioItem",
  props: z.object({
    label: z.string(),
    value: z.string(),
  }),
  description: "Single radio option. value: unique id, label: display text.",
  component: ({ props }) =>
    _jsx(PlasmaRadiobox, P({ label: props.label, value: props.value, name: "radio-group" })),
});

export const RadioGroupDef = defineComponent({
  name: "RadioGroup",
  props: z.object({
    items: z.array(RadioItemDef.ref),
  }),
  description: "Group of RadioItem options. Only one can be selected.",
  component: ({ props, renderNode }) =>
    _jsx("div", {
      style: { display: "flex", flexDirection: "column", gap: "8px" },
      children: renderNode(props.items),
    }),
});

export const SelectItemDef = defineComponent({
  name: "SelectItem",
  props: z.object({
    value: z.string(),
    label: z.string(),
  }),
  description: "Option inside a Select dropdown.",
  component: () => null, // structural only, rendered by Select
});

export const SelectDef = defineComponent({
  name: "Select",
  props: z.object({
    label: z.string().optional(),
    placeholder: z.string().optional(),
    items: z.array(SelectItemDef.ref),
    size: z.enum(["l", "m", "s", "xs"]).optional(),
    view: z.enum(["default", "positive", "warning", "negative"]).optional(),
  }),
  description: 'Dropdown select. size: "m" (default)|"l"|"s"|"xs". view: "default"|"positive"|"warning"|"negative".',
  component: ({ props }) => {
    const items = (props.items ?? []).map((it: any) => ({
      value: it.props.value,
      label: it.props.label,
    }));
    return _jsx("div", {
      style: { width: "100%" },
      children: _jsx(PlasmaSelect, P({
        items,
        label: props.label,
        placeholder: props.placeholder,
        size: props.size ?? "m",
        view: props.view ?? "default",
        target: "textfield",
      })),
    });
  },
});

export const SliderDef = defineComponent({
  name: "Slider",
  props: z.object({
    min: z.number(),
    max: z.number(),
    value: z.number().optional(),
    size: z.enum(["s", "m", "l"]).optional(),
  }),
  description: 'Range slider. min/max: range bounds. size: "m" (default)|"s"|"l".',
  component: ({ props }) =>
    _jsx("div", {
      style: { width: "100%", padding: "8px 0" },
      children: _jsx(PlasmaSlider, P({
        min: props.min, max: props.max,
        value: [props.value ?? props.min],
        size: props.size ?? "m",
      })),
    }),
});

export const CounterDef = defineComponent({
  name: "Counter",
  props: z.object({
    count: z.number(),
    size: z.enum(["xs", "xxs"]).optional(),
    view: z.enum(["default", "accent", "positive", "warning", "negative"]).optional(),
  }),
  description: 'Numeric counter badge. view: "default"|"accent"|"positive"|"warning"|"negative". size: "xs" (default)|"xxs".',
  component: ({ props }) =>
    _jsx(PlasmaCounter, P({
      count: props.count,
      size: props.size ?? "xs",
      view: props.view ?? "default",
    })),
});

// ========================================================
// 5. Data display
// ========================================================

export const BadgeDef = defineComponent({
  name: "Badge",
  props: z.object({
    text: z.string(),
    view: z.enum(["default", "accent", "positive", "warning", "negative", "dark", "light"]).optional(),
    size: z.enum(["l", "m", "s", "xs"]).optional(),
  }),
  description: 'Badge indicator. view: "default"|"accent"|"positive"|"warning"|"negative"|"dark"|"light". size: "l"|"m" (default)|"s"|"xs".',
  component: ({ props }) =>
    _jsx(PlasmaBadge, P({ text: props.text, view: props.view ?? "default", size: props.size ?? "m" })),
});

export const ChipDef = defineComponent({
  name: "Chip",
  props: z.object({
    text: z.string(),
    view: z.enum(["default", "accent", "secondary", "positive", "warning", "negative"]).optional(),
    size: z.enum(["l", "m", "s", "xs"]).optional(),
  }),
  description: 'Chip/tag element. view: "default"|"accent"|"secondary"|"positive"|"warning"|"negative". size: "l"|"m" (default)|"s"|"xs".',
  component: ({ props }) =>
    _jsx(PlasmaChip, P({ text: props.text, view: props.view ?? "default", size: props.size ?? "m" })),
});

export const AvatarDef = defineComponent({
  name: "Avatar",
  props: z.object({
    name: z.string(),
    url: z.string().optional(),
    size: z.enum(["xxl", "xl", "l", "m", "s", "fit"]).optional(),
  }),
  description: 'User avatar. name: displayed initials if no url. size: "m" (default)|"s"|"l"|"xl"|"xxl"|"fit".',
  component: ({ props }) =>
    _jsx(PlasmaAvatar, P({ name: props.name, url: props.url, size: props.size ?? "m" })),
});

export const ProgressDef = defineComponent({
  name: "Progress",
  props: z.object({
    value: z.number(),
    view: z.enum(["default", "accent", "secondary", "success", "warning", "error", "info"]).optional(),
  }),
  description: 'Progress bar. value: 0-100 percent. view: "default"|"accent"|"success"|"warning"|"error"|"info".',
  component: ({ props }) =>
    _jsx("div", {
      style: { width: "100%" },
      children: _jsx(PlasmaProgress, P({ value: props.value, view: props.view ?? "default" })),
    }),
});

export const RatingDef = defineComponent({
  name: "Rating",
  props: z.object({
    value: z.number(),
    size: z.enum(["l", "m", "s", "xs", "h1", "h2", "h3", "h4", "h5"]).optional(),
    view: z.enum(["default", "accent"]).optional(),
  }),
  description: 'Star rating display. value: 0-5. size: "m" (default)|"l"|"s"|"xs". view: "default"|"accent".',
  component: ({ props }) =>
    _jsx(PlasmaRating, P({
      value: props.value, size: props.size ?? "m",
      view: props.view ?? "default", precision: 1,
    })),
});

export const PriceDef = defineComponent({
  name: "Price",
  props: z.object({
    value: z.number(),
    currency: z.enum(["rub", "usd", "eur"]).optional(),
    minimumFractionDigits: z.number().optional(),
  }),
  description: 'Price display. value: numeric amount. currency: "rub" (default)|"usd"|"eur".',
  component: ({ props }) => {
    const currMap: Record<string, string> = { rub: "RUB", usd: "USD", eur: "EUR" };
    return _jsx(PlasmaPrice, P({
      children: props.value,
      currency: currMap[props.currency ?? "rub"] ?? "RUB",
      minimumFractionDigits: props.minimumFractionDigits ?? 0,
    }));
  },
});

export const ColDef = defineComponent({
  name: "Col",
  props: z.object({
    label: z.string(),
    type: z.enum(["string", "number"]).optional(),
  }),
  description: 'Table column definition. type: "string" (default)|"number".',
  component: () => null, // structural
});

export const TableDef = defineComponent({
  name: "Table",
  props: z.object({
    columns: z.array(ColDef.ref),
    rows: z.array(z.array(z.any())),
  }),
  description: "Data table. columns: Col[] definitions. rows: 2D array of cell values.",
  component: ({ props }) => {
    const cols = (props.columns ?? []).map((c: any) => c.props);
    const rows = props.rows ?? [];
    return _jsx("div", {
      style: { width: "100%", overflowX: "auto" },
      children: _jsx("table", {
        style: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
        children: _jsxs(Fragment, {
          children: [
            _jsx("thead", {
              children: _jsx("tr", {
                children: cols.map((c: any, i: number) =>
                  _jsx("th", {
                    style: { padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--plasma-colors-surfaceLiquid02, #e0e0e0)", fontWeight: 600 },
                    children: c.label, key: i,
                  })
                ),
              }),
            }),
            _jsx("tbody", {
              children: rows.map((row: any[], ri: number) =>
                _jsx("tr", {
                  key: ri,
                  children: row.map((cell: any, ci: number) =>
                    _jsx("td", {
                      style: { padding: "10px 12px", borderBottom: "1px solid var(--plasma-colors-surfaceLiquid02, #e0e0e0)" },
                      children: String(cell), key: ci,
                    })
                  ),
                })
              ),
            }),
          ],
        }),
      }),
    });
  },
});

export const NotificationDef = defineComponent({
  name: "Notification",
  props: z.object({
    title: z.string(),
    text: z.string().optional(),
    view: z.enum(["default", "success", "warning", "error", "info"]).optional(),
    size: z.enum(["xs", "xxs"]).optional(),
  }),
  description: 'Notification banner. view: "default"|"success"|"warning"|"error"|"info". size: "xs" (default)|"xxs".',
  component: ({ props }) =>
    _jsx(PlasmaNotification, P({
      title: props.title,
      children: props.text,
      layout: "horizontal",
      size: props.size ?? "xs",
      style: { width: "100%" },
    })),
});

// ========================================================
// 6. Navigation
// ========================================================

export const TabItemDef = defineComponent({
  name: "TabItem",
  props: z.object({
    label: z.string(),
    content: z.array(z.any()),
  }),
  description: "Single tab with label and content array.",
  component: () => null, // structural, rendered by Tabs
});

export const TabsDef = defineComponent({
  name: "Tabs",
  props: z.object({
    items: z.array(TabItemDef.ref),
    size: z.enum(["l", "m", "s", "xs"]).optional(),
  }),
  description: 'Tabbed container. Each TabItem has a label and content. size: "m" (default)|"l"|"s"|"xs".',
  component: ({ props, renderNode }) => {
    const items = props.items ?? [];
    const [active, setActive] = useState(0);
    return _jsxs("div", {
      style: { width: "100%" },
      children: [
        _jsx(PlasmaTabs, P({
          size: props.size ?? "m",
          view: "divider" as any,
          children: items.map((tab: any, i: number) =>
            _jsx(PlasmaTabItem, P({
              key: i,
              selected: i === active,
              onClick: () => setActive(i),
              children: tab.props.label,
            }))
          ),
        })),
        _jsx("div", {
          style: { paddingTop: "16px" },
          children: items[active] ? renderNode(items[active].props.content) : null,
        }),
      ],
    });
  },
});

export const AccordionItemDef = defineComponent({
  name: "AccordionItem",
  props: z.object({
    title: z.string(),
    content: z.array(z.any()),
  }),
  description: "Collapsible section with title and content.",
  component: () => null, // structural
});

export const AccordionDef = defineComponent({
  name: "Accordion",
  props: z.object({
    items: z.array(AccordionItemDef.ref),
    size: z.enum(["l", "m", "s", "xs"]).optional(),
    view: z.enum(["default", "secondary", "clear"]).optional(),
  }),
  description: 'Collapsible accordion. size: "m" (default)|"l"|"s"|"xs". view: "default"|"secondary"|"clear".',
  component: ({ props, renderNode }) => {
    const items = props.items ?? [];
    return _jsx(PlasmaAccordion, P({
      size: props.size ?? "m",
      view: props.view ?? "default",
      children: items.map((item: any, i: number) =>
        _jsx(PlasmaAccordionItem, P({
          key: i,
          title: item.props.title,
          children: _jsx("div", {
            style: { display: "flex", flexDirection: "column", gap: "8px" },
            children: renderNode(item.props.content),
          }),
        }))
      ),
    }));
  },
});

export const StepItemDef = defineComponent({
  name: "StepItem",
  props: z.object({
    title: z.string(),
    content: z.string().optional(),
  }),
  description: "Step in a step indicator. title: step label. content: description.",
  component: () => null, // structural
});

export const StepsDef = defineComponent({
  name: "Steps",
  props: z.object({
    items: z.array(StepItemDef.ref),
  }),
  description: "Step-by-step indicator. Each StepItem has a title and optional content.",
  component: ({ props }) => {
    const items = props.items ?? [];
    return _jsx("div", {
      style: { width: "100%" },
      children: _jsx(PlasmaSteps, P({
        items: items.map((s: any, i: number) => ({
          title: s.props.title,
          content: s.props.content,
          indicator: _jsx("span", { children: i + 1 }),
        })),
        size: "s" as any,
      })),
    });
  },
});

export const BreadcrumbItemDef = defineComponent({
  name: "BreadcrumbItem",
  props: z.object({
    text: z.string(),
    href: z.string().optional(),
  }),
  description: "Breadcrumb navigation item.",
  component: () => null, // structural
});

export const BreadcrumbsDef = defineComponent({
  name: "Breadcrumbs",
  props: z.object({
    items: z.array(BreadcrumbItemDef.ref),
  }),
  description: "Breadcrumb navigation trail.",
  component: ({ props }) => {
    const items = (props.items ?? []).map((it: any) => it.props);
    return _jsx(PlasmaBreadcrumbs, P({
      items: items.map((it: any) => ({
        title: it.text,
        href: it.href,
      })),
    }));
  },
});

export const PaginationDef = defineComponent({
  name: "Pagination",
  props: z.object({
    count: z.number(),
    page: z.number().optional(),
    size: z.enum(["l", "m", "s", "xs"]).optional(),
  }),
  description: 'Page navigation. count: total pages. page: current page (default 1). size: "m" (default)|"l"|"s"|"xs".',
  component: ({ props }) => {
    const [page, setPage] = useState(props.page ?? 1);
    return _jsx(PlasmaPagination, P({
      count: props.count,
      value: page,
      onChange: (_e: any, v: number) => setPage(v),
      size: props.size ?? "m",
      type: "default",
    }));
  },
});

// ========================================================
// 7. Layout
// ========================================================

export const StackDef = defineComponent({
  name: "Stack",
  props: z.object({
    children: z.array(z.any()),
    direction: z.enum(["row", "column"]).optional(),
    gap: z.enum(["none", "xs", "s", "m", "l", "xl"]).optional(),
    align: z.enum(["start", "center", "end", "stretch", "baseline"]).optional(),
    justify: z.enum(["start", "center", "end", "between", "around", "evenly"]).optional(),
    wrap: z.boolean().optional(),
  }),
  description: 'Flex container. direction: "row"|"column" (default). gap: "none"|"xs"|"s"|"m" (default)|"l"|"xl".',
  component: ({ props, renderNode }) => {
    const gapMap: Record<string, string> = { none: "0", xs: "4px", s: "8px", m: "16px", l: "24px", xl: "32px" };
    const alignMap: Record<string, string> = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" };
    const justifyMap: Record<string, string> = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around", evenly: "space-evenly" };
    return _jsx("div", {
      style: {
        display: "flex", flexDirection: props.direction ?? "column",
        gap: gapMap[props.gap ?? "m"],
        alignItems: props.align ? alignMap[props.align] : undefined,
        justifyContent: props.justify ? justifyMap[props.justify] : undefined,
        flexWrap: props.wrap ? "wrap" : undefined,
      },
      children: renderNode(props.children),
    });
  },
});

export const SeparatorDef = defineComponent({
  name: "Separator",
  props: z.object({}),
  description: "Visual divider between content sections.",
  component: () => _jsx(PlasmaDivider, P({})),
});

// ========================================================
// 8. Grid
// ========================================================

export const GridColDef = defineComponent({
  name: "GridCol",
  props: z.object({
    children: z.array(z.any()),
    size: z.number().optional(),
    offset: z.number().optional(),
    sizeSmallS: z.number().optional(),
    sizeMediumS: z.number().optional(),
    sizeMediumM: z.number().optional(),
    sizeLargeS: z.number().optional(),
    sizeLargeM: z.number().optional(),
    offsetSmallS: z.number().optional(),
    offsetMediumS: z.number().optional(),
    offsetMediumM: z.number().optional(),
    offsetLargeS: z.number().optional(),
    offsetLargeM: z.number().optional(),
  }),
  description: 'Grid column. size: column span (default full width). offset: column offset. Responsive variants: sizeSmallS/sizeMediumS/sizeMediumM/sizeLargeS/sizeLargeM and offsetSmallS/offsetMediumS/offsetMediumM/offsetLargeS/offsetLargeM.',
  component: ({ props, renderNode }) =>
    _jsx(PlasmaCol, P({
      size: props.size,
      offset: props.offset,
      sizeSmallS: props.sizeSmallS,
      sizeMediumS: props.sizeMediumS,
      sizeMediumM: props.sizeMediumM,
      sizeLargeS: props.sizeLargeS,
      sizeLargeM: props.sizeLargeM,
      offsetSmallS: props.offsetSmallS,
      offsetMediumS: props.offsetMediumS,
      offsetMediumM: props.offsetMediumM,
      offsetLargeS: props.offsetLargeS,
      offsetLargeM: props.offsetLargeM,
      children: renderNode(props.children),
    })),
});

export const GridRowDef = defineComponent({
  name: "GridRow",
  props: z.object({
    children: z.array(GridColDef.ref),
  }),
  description: "Grid row. Contains GridCol children arranged horizontally.",
  component: ({ props, renderNode }) =>
    _jsx(PlasmaRow, P({
      children: renderNode(props.children),
    })),
});

export const GridDef = defineComponent({
  name: "Grid",
  props: z.object({
    children: z.array(GridRowDef.ref),
  }),
  description: "Responsive grid container. Contains GridRow children. Breakpoints: smallS (6 cols), mediumS (12), mediumM (18), largeS (24), largeM (30).",
  component: ({ props, renderNode }) =>
    _jsx(PlasmaContainer, P({
      children: renderNode(props.children),
    })),
});

// ========================================================
// Library
// ========================================================

export const plasmaComponentGroups = [
  {
    name: "Layout",
    components: ["Stack", "Separator", "Grid", "GridRow", "GridCol"],
    notes: [
      '- Use Stack with direction="row" and wrap=true for simple flex layouts.',
      '- Use Grid > GridRow > GridCol for responsive column-based layouts with breakpoints.',
      '- GridCol supports responsive sizing: sizeSmallS (6 cols), sizeMediumS (12), sizeMediumM (18), sizeLargeS (24), sizeLargeM (30).',
      '- Use GridCol only inside GridRow, use GridRow only inside Grid.',
    ],
  },
  {
    name: "Content",
    components: ["Card", "CardHeader", "TextContent", "Link", "Image"],
  },
  {
    name: "Data Display",
    components: ["Badge", "Chip", "Avatar", "Progress", "Rating", "Price", "Counter", "Table", "Col", "Notification"],
  },
  {
    name: "Navigation",
    components: ["Tabs", "TabItem", "Accordion", "AccordionItem", "Steps", "StepItem", "Breadcrumbs", "BreadcrumbItem", "Pagination"],
  },
  {
    name: "Buttons",
    components: ["Button", "Buttons"],
  },
  {
    name: "Forms",
    components: ["Input", "TextArea", "Checkbox", "Switch", "RadioGroup", "RadioItem", "Select", "SelectItem", "Slider"],
  },
];

export const plasmaExamples = [
  `Example 1 — Card with text and button:
root = Stack([TextContent("Welcome to Plasma", "h2"), Card([CardHeader("Getting Started"), TextContent("This is a card."), Buttons([Button("Learn More", {type: "ContinueConversation"}, "accent")])])])`,
  `Example 2 — Form:
root = Stack([TextContent("Contact Us", "h2"), Card([CardHeader("Send a Message"), Input("Name", "Enter your name"), Input("Email", "Enter your email"), TextArea("Message", "Type your message..."), Buttons([Button("Submit", {type: "ContinueConversation"}, "accent"), Button("Cancel", {type: "ContinueConversation"}, "secondary")])])])`,
  `Example 3 — Dashboard:
root = Stack([TextContent("Status", "h2"), Stack([Badge("Online", "positive"), Badge("3 Warnings", "warning")], "row"), Card([CardHeader("Services"), Progress(75, "accent"), TextContent("75% capacity")])])`,
  `Example 4 — Tabs with content:
root = Stack([TextContent("Documentation", "h2"), Tabs([TabItem("Overview", [TextContent("Product overview here.")]), TabItem("Features", [TextContent("Feature list:"), Card([TextContent("Feature 1"), TextContent("Feature 2")])])])])`,
  `Example 5 — Table:
root = Stack([TextContent("Users", "h2"), Table([Col("Name"), Col("Role"), Col("Status")], [["Alice", "Admin", "Active"], ["Bob", "Editor", "Inactive"]])])`,
];

export const plasmaPromptOptions: PromptOptions = {
  examples: plasmaExamples,
  additionalRules: [
    "Always wrap top-level content in Stack.",
    "Use Card for grouped content sections.",
    "Use CardHeader as the first child of Card for titles.",
    'Use TextContent with size="h1" or "h2" for headings.',
    "Use Buttons to group multiple Button components.",
    "Use TabItem only inside Tabs, AccordionItem only inside Accordion, StepItem only inside Steps.",
    "Use Col only as columns in Table.",
    "Use SelectItem only as items in Select.",
    "Use RadioItem only inside RadioGroup.",
    "Use BreadcrumbItem only inside Breadcrumbs.",
    "Use GridRow only inside Grid, use GridCol only inside GridRow.",
    "Use Grid for responsive column-based layouts with breakpoints.",
  ],
};

export const plasmaLibrary = createLibrary({
  root: "Stack",
  componentGroups: plasmaComponentGroups,
  components: [
    // Content
    TextContent, CardHeaderDef, LinkDef, ImageDef,
    // Cards
    CardDef,
    // Buttons
    ButtonDef, ButtonsDef,
    // Forms
    InputDef, TextAreaDef, CheckboxDef, SwitchDef,
    RadioGroupDef, RadioItemDef, SelectDef, SelectItemDef,
    SliderDef, CounterDef,
    // Data display
    BadgeDef, ChipDef, AvatarDef, ProgressDef,
    RatingDef, PriceDef, TableDef, ColDef,
    NotificationDef,
    // Navigation
    TabsDef, TabItemDef, AccordionDef, AccordionItemDef,
    StepsDef, StepItemDef,
    BreadcrumbsDef, BreadcrumbItemDef, PaginationDef,
    // Layout
    StackDef, SeparatorDef, GridDef, GridRowDef, GridColDef,
  ],
});
