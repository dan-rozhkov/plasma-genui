import type { Message } from "@openuidev/react-headless";

const mockResponses: Record<string, string> = {
  default: `root = Stack([TextContent("Here's a quick demo of Plasma Web components!", "h2"), Card([CardHeader("Welcome"), TextContent("This is a mock response using Plasma Web UI components from Sber."), Buttons([Button("Get Started", {type: "ContinueConversation"}, "accent"), Button("Learn More", {type: "ContinueConversation"}, "secondary")])])])`,

  hello: `root = Stack([TextContent("Hello!", "h2"), Card([CardHeader("Plasma UI Generator"), TextContent("I can generate interfaces using Plasma Web components:"), Stack([Badge("Buttons", "accent"), Badge("Cards", "positive"), Badge("Forms", "warning"), Badge("Typography", "default")], "row"), Buttons([Button("Show a form", {type: "ContinueConversation"}, "accent")])])])`,

  form: `root = Stack([TextContent("Contact Form", "h2"), Card([CardHeader("Send us a message"), Input("Name", "Enter your name"), Input("Email", "Enter your email"), TextArea("Message", "Type your message here..."), Stack([Checkbox("I agree to the terms"), Switch("Subscribe to newsletter")]), Buttons([Button("Submit", {type: "ContinueConversation"}, "accent"), Button("Cancel", {type: "ContinueConversation"}, "secondary")])])])`,

  dashboard: `root = Stack([TextContent("System Status", "h2"), Stack([Badge("Online", "positive"), Badge("3 Warnings", "warning"), Badge("1 Error", "negative")], "row"), Card([CardHeader("Services", "All systems operational"), Progress(75, "accent"), TextContent("75% capacity")]), Card([CardHeader("Quick Actions"), Buttons([Button("Restart Service", {type: "ContinueConversation"}, "warning"), Button("View Logs", {type: "ContinueConversation"}, "secondary"), Button("Settings", {type: "ContinueConversation"}, "clear")])])])`,

  table: `root = Stack([TextContent("Team Members", "h2"), Table([Col("Name"), Col("Role"), Col("Status")], [["Alice Johnson", "Admin", "Active"], ["Bob Smith", "Editor", "Active"], ["Carol White", "Viewer", "Inactive"], ["Dave Brown", "Editor", "Active"]]), Stack([Badge("3 Active", "positive"), Badge("1 Inactive", "warning")], "row")])`,

  tabs: `root = Stack([TextContent("Product Info", "h2"), Tabs([TabItem("Overview", [Card([CardHeader("About"), TextContent("A comprehensive platform for building modern interfaces."), Stack([Rating(4, "m", "accent"), Price(9900, "rub")], "row", "s", "center")])]), TabItem("Features", [Card([CardHeader("Key Features"), Accordion([AccordionItem("Fast Performance", [TextContent("Optimized rendering engine with minimal overhead.")]), AccordionItem("Easy Integration", [TextContent("Works with any React project. Just install and use.")]), AccordionItem("Full Customization", [TextContent("Theme tokens, CSS variables, and styled-components support.")])])])]), TabItem("Reviews", [Card([CardHeader("User Reviews"), Stack([Stack([Avatar("Alice"), TextContent("Great library!"), Rating(5)]), Stack([Avatar("Bob"), TextContent("Very useful components."), Rating(4)]), Stack([Avatar("Carol"), TextContent("Good documentation."), Rating(4)])])])])])])`,

  components: `root = Stack([TextContent("All Components Demo", "h2"), Card([CardHeader("Data Display"), Stack([Badge("Badge", "accent"), Chip("Chip", "secondary"), Counter(42, "xs", "positive")], "row", "s", "center"), Separator, Progress(60, "success"), Rating(3.5, "m", "accent"), Price(1299, "usd")]), Card([CardHeader("Navigation"), Breadcrumbs([BreadcrumbItem("Home", "/"), BreadcrumbItem("Products", "/products"), BreadcrumbItem("Details")]), Steps([StepItem("Order", "Place your order"), StepItem("Payment", "Complete payment"), StepItem("Delivery", "Await delivery")])]), Card([CardHeader("Form Elements"), Input("Username", "Enter username"), Select("Country", "Choose country", [SelectItem("ru", "Russia"), SelectItem("us", "United States"), SelectItem("de", "Germany")]), RadioGroup([RadioItem("Small", "s"), RadioItem("Medium", "m"), RadioItem("Large", "l")]), Slider(0, 100, 50)])])`,
};

function pickResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("привет")) return mockResponses.hello;
  if (lower.includes("form") || lower.includes("форм") || lower.includes("contact")) return mockResponses.form;
  if (lower.includes("dashboard") || lower.includes("status") || lower.includes("статус")) return mockResponses.dashboard;
  if (lower.includes("table") || lower.includes("табли") || lower.includes("team")) return mockResponses.table;
  if (lower.includes("tab") || lower.includes("product") || lower.includes("товар")) return mockResponses.tabs;
  if (lower.includes("component") || lower.includes("компонент") || lower.includes("demo") || lower.includes("all")) return mockResponses.components;
  return mockResponses.default;
}

export async function mockProcessMessage({
  messages,
}: {
  threadId: string;
  messages: Message[];
  abortController: AbortController;
}): Promise<Response> {
  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");

  const content =
    typeof lastUserMessage?.content === "string"
      ? lastUserMessage.content
      : "";

  const responseText = pickResponse(content);

  const chunkSize = 20;
  const chunks: string[] = [];
  for (let i = 0; i < responseText.length; i += chunkSize) {
    chunks.push(responseText.slice(i, i + chunkSize));
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < chunks.length; i++) {
        const sseData = {
          choices: [
            {
              delta: { content: chunks[i], ...(i === 0 ? { role: "assistant" } : {}) },
              index: 0,
              finish_reason: null,
            },
          ],
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`)
        );
        await new Promise((r) => setTimeout(r, 30));
      }

      const doneData = {
        choices: [{ delta: {}, index: 0, finish_reason: "stop" }],
      };
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(doneData)}\n\n`)
      );
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
