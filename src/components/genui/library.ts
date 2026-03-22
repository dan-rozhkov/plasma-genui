import { jsx as _jsx, jsxs as _jsxs, Fragment } from "react/jsx-runtime";
import { Children, useState, useEffect, useMemo } from "react";
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
  Table as PlasmaTable,
  Steps as PlasmaSteps,
  Container as PlasmaContainer,
  Row as PlasmaRow,
  Col as PlasmaCol,
  DsplL, DsplM, DsplS,
  H1, H2, H3, H4, H5,
  BodyL, BodyM, BodyS, BodyXS, BodyXXS,
  TextL, TextM, TextS, TextXS,
  Cell as PlasmaCell,
} from "@salutejs/plasma-web";

// ========================================================
// Helpers
// ========================================================

const P = (props: Record<string, unknown>) => props as any;

// ========================================================
// 1. Typography
// ========================================================

const typographyMap: Record<string, any> = {
  "dspl-l": DsplL, "dspl-m": DsplM, "dspl-s": DsplS,
  "h1": H1, "h2": H2, "h3": H3, "h4": H4, "h5": H5,
  "body-l": BodyL, "body-m": BodyM, "body-s": BodyS, "body-xs": BodyXS, "body-xxs": BodyXXS,
  "text-l": TextL, "text-m": TextM, "text-s": TextS, "text-xs": TextXS,
};

export const TextContent = defineComponent({
  name: "TextContent",
  props: z.object({
    text: z.string(),
    size: z.enum([
      "dspl-l", "dspl-m", "dspl-s",
      "h1", "h2", "h3", "h4", "h5",
      "body-l", "body-m", "body-s", "body-xs", "body-xxs",
      "text-l", "text-m", "text-s", "text-xs",
    ]).optional(),
    bold: z.boolean().optional(),
    color: z.string().optional(),
    noWrap: z.boolean().optional(),
    breakWord: z.boolean().optional(),
    isNumeric: z.boolean().optional(),
    isItalic: z.boolean().optional(),
  }),
  description: 'Text block. size: "dspl-l/m/s" (hero), "h1"-"h5" (headings), "body-l/m/s/xs/xxs" (body, default "body-m"), "text-l/m/s/xs" (UI labels). Optional: bold, color, noWrap, breakWord, isNumeric, isItalic.',
  component: ({ props }) => {
    const Comp = typographyMap[props.size ?? "body-m"] ?? BodyM;
    return _jsx(Comp, P({
      bold: props.bold,
      color: props.color,
      noWrap: props.noWrap,
      breakWord: props.breakWord,
      isNumeric: props.isNumeric,
      isItalic: props.isItalic,
      children: props.text ?? "",
    }));
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

export const CellDef = defineComponent({
  name: "Cell",
  props: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    label: z.string().optional(),
    size: z.enum(["l", "m", "s", "xs"]).optional(),
    contentLeft: z.array(z.any()).optional(),
    contentRight: z.array(z.any()).optional(),
    stretching: z.enum(["fixed", "filled", "auto"]).optional(),
  }),
  description: 'List cell with title/subtitle/label and optional left/right content slots. size: "l"|"m" (default)|"s"|"xs". stretching: "filled" (default)|"fixed"|"auto". Use contentLeft for Avatar/Icon, contentRight for Badge/Button.',
  component: ({ props, renderNode }) =>
    _jsx(PlasmaCell, P({
      title: props.title,
      subtitle: props.subtitle,
      label: props.label,
      size: props.size ?? "m",
      stretching: props.stretching ?? "filled",
      contentLeft: props.contentLeft ? _jsx(Fragment, { children: renderNode(props.contentLeft) }) : undefined,
      contentRight: props.contentRight ? _jsx(Fragment, { children: renderNode(props.contentRight) }) : undefined,
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
    background: z.enum(["solid", "none"]).optional(),
  }),
  description: 'Card container. size: "l"|"m" (default)|"s". background: "solid" (default)|"none".',
  component: ({ props, renderNode }) =>
    _jsx(PlasmaCard, P({
      size: props.size ?? "m",
      backgroundType: props.background ?? "solid",
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
    stretch: z.boolean().optional(),
  }),
  description: 'Group of Button components. direction: "row" (default)|"column". stretch: true to make buttons fill equal width.',
  component: ({ props, renderNode }) => {
    const children = renderNode(props.buttons);
    return _jsx("div", {
      style: {
        display: "flex",
        flexDirection: props.direction ?? "row",
        gap: "8px",
        flexWrap: props.stretch ? undefined : "wrap",
        width: props.stretch ? "100%" : undefined,
      },
      children: props.stretch
        ? Children.map(children as React.ReactElement[], (child) =>
            _jsx("div", { style: { flex: 1, display: "grid" }, children: child })
          )
        : children,
    });
  },
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
    transparent: z.boolean().optional(),
  }),
  description: 'Badge indicator. view: "default"|"accent"|"positive"|"warning"|"negative"|"dark"|"light". size: "l"|"m" (default)|"s"|"xs". transparent: false (default)|true — transparent background.',
  component: ({ props }) =>
    _jsx(PlasmaBadge, P({ text: props.text, view: props.view ?? "default", size: props.size ?? "m", transparent: props.transparent ?? false })),
});

export const ChipDef = defineComponent({
  name: "Chip",
  props: z.object({
    text: z.string(),
    view: z.enum(["default", "accent", "secondary", "positive", "warning", "negative"]).optional(),
    size: z.enum(["l", "m", "s", "xs"]).optional(),
    hasClear: z.boolean().optional(),
  }),
  description: 'Chip/tag element. view: "default"|"accent"|"secondary"|"positive"|"warning"|"negative". size: "l"|"m" (default)|"s"|"xs". hasClear: true (default)|false — show/hide close icon.',
  component: ({ props }) =>
    _jsx(PlasmaChip, P({ text: props.text, view: props.view ?? "default", size: props.size ?? "m", hasClear: props.hasClear ?? true })),
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
    const allRows = props.rows ?? [];

    const columns = useMemo(() =>
      cols.map((c: any, i: number) => ({ id: `col${i}`, label: c.label })),
      [cols.map((c: any) => c.label).join(",")]
    );

    const allData = useMemo(() =>
      allRows.map((row: any[], ri: number) => {
        const obj: Record<string, any> = { id: String(ri) };
        row.forEach((cell: any, ci: number) => { obj[`col${ci}`] = String(cell); });
        return obj;
      }),
      [allRows]
    );

    const perPageList = [5, 10, 20];
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(allData.length / perPage));

    useEffect(() => {
      if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const pageData = useMemo(() =>
      allData.slice((page - 1) * perPage, page * perPage),
      [allData, page, perPage]
    );

    const handlePaginationChange = (_page?: number, _perPage?: number) => {
      if (_perPage !== undefined && _perPage !== perPage) {
        setPerPage(_perPage);
        setPage(1);
      } else if (_page !== undefined) {
        setPage(_page);
      }
    };

    const showPagination = allData.length > perPageList[0];

    return _jsx(PlasmaTable, P({
      data: pageData,
      columns,
      size: "m",
      style: { display: "flex", flexDirection: "column", alignItems: "stretch", width: "100%" },
      classNames: { table: "plasma-table-fw" },
      bottomContent: showPagination
        ? _jsx("div", {
            style: { padding: "12px 0", width: "100%", display: "flex", justifyContent: "center" },
            children: _jsx(PlasmaPagination, P({
              size: "xs",
              value: page,
              count: allData.length,
              perPage,
              perPageList,
              hasPerPage: true,
              hasQuickJump: false,
              onChange: handlePaginationChange,
              type: "default",
            })),
          })
        : undefined,
    }));
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
    size: z.enum(["m", "s", "xs"]).optional(),
  }),
  description: 'Tabbed container. Each TabItem has a label and content. size: "m" (default)|"s"|"xs".',
  component: ({ props, renderNode }) => {
    const items = props.items ?? [];
    const [active, setActive] = useState(0);
    return _jsxs("div", {
      style: { width: "100%" },
      children: [
        _jsx(PlasmaTabs, P({
          size: props.size ?? "xs",
          view: "divider" as any,
          children: items.map((tab: any, i: number) =>
            _jsx(PlasmaTabItem, P({
              key: i,
              size: props.size ?? "xs",
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
    padding: z.string().optional(),
  }),
  description: 'Flex container. direction: "row"|"column" (default). gap: "none"|"xs"|"s"|"m" (default)|"l"|"xl". padding: optional CSS padding (e.g. "2rem").',
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
        padding: props.padding,
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
    components: ["Card", "CardHeader", "TextContent", "Cell", "Link", "Image"],
    notes: [
      '- TextContent "dspl-*" for hero/landing, "h1"-"h5" for headings, "body-*" for paragraphs, "text-*" for UI labels.',
      '- Use bold prop for emphasis, color for custom text colors.',
    ],
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
root = Stack([TextContent("Welcome to Plasma", "h2"), Card([CardHeader("Getting Started"), TextContent("This is a card."), Buttons([Button("Learn More", {type: "ContinueConversation"}, "accent")])], "m", "solid")])`,
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
    'Use Card for grouped content sections. Card background defaults to "solid"; use "none" for transparent cards.',
    "Use CardHeader as the first child of Card for titles.",
    'Use TextContent for all text. Sizes: "dspl-l/m/s" for hero text, "h1"-"h5" for headings, "body-l/m/s/xs/xxs" for body (default "body-m"), "text-l/m/s/xs" for UI labels/captions. Optional: bold, color, isItalic.',
    "Use Buttons to group multiple Button components.",
    "Use TabItem only inside Tabs, AccordionItem only inside Accordion, StepItem only inside Steps.",
    "Use Col only as columns in Table.",
    "Use SelectItem only as items in Select.",
    "Use RadioItem only inside RadioGroup.",
    "Use BreadcrumbItem only inside Breadcrumbs.",
    "Use GridRow only inside Grid, use GridCol only inside GridRow.",
    "Use Grid for responsive column-based layouts with breakpoints.",
    "Do not add padding to the root Stack — padding is applied automatically by the container.",
    "Form inputs (Input, TextArea, Select) must always be full-width within their container — never restrict their width.",
    "When using Buttons with 2 or more buttons, always set stretch=true so buttons fill the full width equally.",
  ],
};

export const plasmaLibrary = createLibrary({
  root: "Stack",
  componentGroups: plasmaComponentGroups,
  components: [
    // Content
    TextContent, CardHeaderDef, CellDef, LinkDef, ImageDef,
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
