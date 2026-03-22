import type { ChatMessage } from "@/hooks/use-chat-stream";

const mockResponses: Record<string, string> = {
  default: `root = Stack([TextContent("Here's a quick demo of Plasma Web components!", "h2"), Card([CardHeader("Welcome"), TextContent("This is a mock response using Plasma Web UI components from Sber."), Buttons([Button("Get Started", {type: "ContinueConversation"}, "accent"), Button("Learn More", {type: "ContinueConversation"}, "secondary")])])])`,

  hello: `root = Stack([TextContent("Hello!", "h2"), Card([CardHeader("Plasma UI Generator"), TextContent("I can generate interfaces using Plasma Web components:"), Stack([Badge("Buttons", "accent"), Badge("Cards", "positive"), Badge("Forms", "warning"), Badge("Typography", "default")], "row"), Buttons([Button("Show a form", {type: "ContinueConversation"}, "accent")])])])`,

  form: `root = Stack([TextContent("Contact Form", "h2"), Card([CardHeader("Send us a message"), Input("Name", "Enter your name"), Input("Email", "Enter your email"), TextArea("Message", "Type your message here..."), Stack([Checkbox("I agree to the terms"), Switch("Subscribe to newsletter")]), Buttons([Button("Submit", {type: "ContinueConversation"}, "accent"), Button("Cancel", {type: "ContinueConversation"}, "secondary")])])])`,

  dashboard: `root = Stack([Stack([Stack([TextContent("Analytics Dashboard", "h1"), TextContent("Real-time overview of your platform", "body-m", false, "var(--plasma-colors-secondary)")], "column", "xs"), Stack([Badge("Live", "positive", "s"), TextContent("Last updated: 2 min ago", "body-xs", false, "var(--plasma-colors-secondary)")], "row", "xs", "center")], "row", "m", "center", "between"), Notification("Revenue target achieved!", "Monthly revenue exceeded target by 12%. Great job, team!", "success"), Stack([Card([Stack([TextContent("Revenue", "body-s", true, "var(--plasma-colors-secondary)"), TextContent("$284,500", "dspl-s", true, "#1a73e8")], "column", "xs"), Stack([Badge("+18.2%", "positive", "s"), TextContent("vs last month", "body-xs", false, "var(--plasma-colors-secondary)")], "row", "xs", "center")]), Card([Stack([TextContent("Active Users", "body-s", true, "var(--plasma-colors-secondary)"), TextContent("12,847", "dspl-s", true, "#1e8e3e")], "column", "xs"), Stack([Badge("+5.4%", "positive", "s"), TextContent("vs last month", "body-xs", false, "var(--plasma-colors-secondary)")], "row", "xs", "center")]), Card([Stack([TextContent("Conversion", "body-s", true, "var(--plasma-colors-secondary)"), TextContent("3.24%", "dspl-s", true, "#e37400")], "column", "xs"), Stack([Badge("-0.8%", "warning", "s"), TextContent("vs last month", "body-xs", false, "var(--plasma-colors-secondary)")], "row", "xs", "center")]), Card([Stack([TextContent("Avg. Session", "body-s", true, "var(--plasma-colors-secondary)"), TextContent("4m 32s", "dspl-s", true, "#9334e6")], "column", "xs"), Stack([Badge("+12.1%", "positive", "s"), TextContent("vs last month", "body-xs", false, "var(--plasma-colors-secondary)")], "row", "xs", "center")])], "row", "m"), Tabs([TabItem("Overview", [Stack([Card([CardHeader("System Health"), Stack([Cell("API Gateway", "Response time: 42ms", "", "l", [], [Badge("Healthy", "positive", "s")]), Separator, Cell("Database Cluster", "3 replicas active", "", "l", [], [Badge("Healthy", "positive", "s")]), Separator, Cell("Cache Layer", "Hit rate: 94.2%", "", "l", [], [Badge("Warning", "warning", "s")]), Separator, Cell("Worker Queue", "148 jobs pending", "", "l", [], [Badge("Healthy", "positive", "s")])]), Progress(87, "success"), TextContent("Overall health: 87%", "body-s", false, "var(--plasma-colors-secondary)")]), Card([CardHeader("Recent Activity"), Stack([Cell("New deployment", "Production v2.14.0 deployed successfully", "", "m", [Avatar("AK", "", "s")]), Separator, Cell("Alert resolved", "High memory usage on worker-03 normalized", "", "m", [Avatar("SY", "", "s")]), Separator, Cell("Config update", "Rate limiting threshold increased to 1000 req/s", "", "m", [Avatar("MR", "", "s")]), Separator, Cell("Incident closed", "Payment gateway timeout issue fixed", "", "m", [Avatar("DL", "", "s")])])])], "row", "m")]), TabItem("Team", [Stack([Card([CardHeader("Team Performance", "Sprint 24 progress"), Steps([StepItem("Planning", "Completed Mar 1"), StepItem("Development", "In progress"), StepItem("Testing", "Upcoming"), StepItem("Release", "Mar 28")]), Progress(62, "accent"), TextContent("62% sprint completion", "body-s")]), Card([CardHeader("Top Contributors"), Stack([Cell("Alice Kim", "42 commits, 18 PRs merged", "", "m", [Avatar("AK", "", "s")], [Counter(42, "xs", "accent")]), Separator, Cell("Sam Yang", "38 commits, 15 PRs merged", "", "m", [Avatar("SY", "", "s")], [Counter(38, "xs", "accent")]), Separator, Cell("Maria Rodriguez", "29 commits, 12 PRs merged", "", "m", [Avatar("MR", "", "s")], [Counter(29, "xs", "accent")]), Separator, Cell("David Lee", "24 commits, 9 PRs merged", "", "m", [Avatar("DL", "", "s")], [Counter(24, "xs", "accent")])])])], "row", "m")]), TabItem("Traffic", [Card([CardHeader("Traffic Sources"), Table([Col("Source"), Col("Visitors"), Col("Bounce Rate"), Col("Avg Duration"), Col("Conversion")], [["Organic Search", "5,240", "32.1%", "5m 12s", "4.2%"], ["Direct", "3,812", "28.5%", "6m 45s", "5.1%"], ["Social Media", "2,156", "45.3%", "2m 30s", "1.8%"], ["Email Campaign", "1,024", "22.8%", "7m 15s", "6.3%"], ["Referral", "615", "38.7%", "3m 50s", "3.0%"]])])])]), Stack([Buttons([Button("Export Report", {type: "ContinueConversation"}, "accent"), Button("Schedule Report", {type: "ContinueConversation"}, "secondary"), Button("Settings", {type: "ContinueConversation"}, "clear")])], "row", "m", "center", "end")])`,

  table: `root = Stack([Breadcrumbs([BreadcrumbItem("Home"), BreadcrumbItem("Organization"), BreadcrumbItem("Team Members")]), TextContent("Team Members", "h2"), Stack([Card([TextContent("Total Members", "text-s", true), TextContent("20", "h1", true, "#1a73e8"), TextContent("across all departments", "body-s")], "m", "solid"), Card([TextContent("Active Now", "text-s", true), TextContent("18", "h1", true, "#1e8e3e"), TextContent("90% of team", "body-s")], "m", "solid"), Card([TextContent("Departments", "text-s", true), TextContent("4", "h1", true, "#e37400"), TextContent("Engineering, Design, Product, Marketing", "body-s")], "m", "solid"), Card([TextContent("Avg. Tenure", "text-s", true), TextContent("3.2 yrs", "h1", true, "#9334e6"), TextContent("team experience level", "body-s")], "m", "solid")], "row", "m"), Separator(), Stack([Input("Search", "Search by name...", "s"), Select("Department", "All Departments", [SelectItem("all", "All Departments"), SelectItem("engineering", "Engineering"), SelectItem("design", "Design"), SelectItem("product", "Product"), SelectItem("marketing", "Marketing"), SelectItem("analytics", "Analytics")], "s"), Select("Status", "All Statuses", [SelectItem("all", "All Statuses"), SelectItem("active", "Active"), SelectItem("onleave", "On Leave")], "s"), Button("Apply Filters", {type: "ContinueConversation"}, "accent", "s")], "row", "s", "end"), Table([Col("Name"), Col("Role"), Col("Department"), Col("Status")], [["Alice Johnson", "Product Manager", "Product", "Active"], ["Bob Smith", "Senior Developer", "Engineering", "Active"], ["Carol Williams", "UX Designer", "Design", "Active"], ["David Brown", "DevOps Engineer", "Engineering", "On Leave"], ["Emma Davis", "Marketing Lead", "Marketing", "Active"], ["Frank Miller", "QA Analyst", "Engineering", "Active"], ["Grace Lee", "Data Scientist", "Analytics", "Active"], ["Henry Wilson", "Frontend Developer", "Engineering", "Active"], ["Irene Chen", "Backend Developer", "Engineering", "Active"], ["Jack Thompson", "Product Designer", "Design", "Active"], ["Karen White", "Content Strategist", "Marketing", "Active"], ["Leo Martinez", "Security Engineer", "Engineering", "On Leave"], ["Mia Patel", "Scrum Master", "Product", "Active"], ["Nathan Kim", "ML Engineer", "Analytics", "Active"], ["Olivia Scott", "Technical Writer", "Product", "Active"], ["Paul Adams", "iOS Developer", "Engineering", "Active"], ["Quinn Roberts", "Growth Analyst", "Marketing", "Active"], ["Rachel Green", "Platform Engineer", "Engineering", "Active"], ["Steve Park", "UX Researcher", "Design", "Active"], ["Tina Nguyen", "Data Engineer", "Analytics", "Active"]])])`,

  tabs: `root = Stack([Stack([Image("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=480&h=480&fit=crop", "Sony WH-1000XM5", "100%", "360px"), Stack([Stack([Badge("New", "positive", "s"), Badge("In Stock", "accent", "s"), Badge("-20%", "warning", "s")], "row", "xs"), TextContent("Sony WH-1000XM5", "h2", true), TextContent("Wireless Noise-Cancelling Headphones", "body-m", false, "var(--plasma-colors-secondary)"), Stack([Rating(4.5, "m", "accent"), TextContent("(2,847 reviews)", "body-s", false, "var(--plasma-colors-secondary)")], "row", "xs", "center"), Separator, Stack([Stack([TextContent("Price", "body-s", false, "var(--plasma-colors-secondary)"), Price(27990, "rub")], "column", "xs"), Stack([TextContent("Old price", "body-s", false, "var(--plasma-colors-secondary)"), TextContent("34 990 ₽", "body-m", false, "var(--plasma-colors-secondary)")], "column", "xs")], "row", "l", "end"), Separator, Stack([TextContent("Color", "body-s", true), Stack([Chip("Black", "secondary", "s", false), Chip("Silver", "secondary", "s", false), Chip("Midnight Blue", "secondary", "s", false)], "row", "xs")], "column", "xs"), Separator, Stack([Button("Add to Cart", {type: "ContinueConversation"}, "accent", "s"), Button("Buy Now", {type: "ContinueConversation"}, "secondary", "s"), Button("Add to Wishlist", {type: "ContinueConversation"}, "clear", "s")], "row", "s")], "column", "m")], "row", "l"), Tabs([TabItem("Description", [Card([TextContent("Industry-leading noise cancellation with Auto NC Optimizer automatically adjusts to your environment. Crystal-clear hands-free calling with 4 beamforming microphones and advanced audio signal processing.", "body-m"), Separator, Stack([Cell("Battery Life", "Up to 30 hours with NC on", "", "m"), Separator, Cell("Quick Charge", "3 min charge = 3 hours playback", "", "m"), Separator, Cell("Connectivity", "Bluetooth 5.2, Multipoint", "", "m"), Separator, Cell("Driver Size", "30mm carbon fiber composite", "", "m")]), Separator, TextContent("What's in the box:", "body-m", true), Stack([TextContent("• WH-1000XM5 Headphones", "body-s"), TextContent("• Carrying case", "body-s"), TextContent("• USB-C charging cable (approx. 20 cm)", "body-s"), TextContent("• Stereo mini plug cable (approx. 1.2 m)", "body-s"), TextContent("• Audio adapter for in-flight use", "body-s")])])]), TabItem("Specifications", [Card([Stack([Stack([Cell("Model", "WH-1000XM5", "", "m"), Separator, Cell("Type", "Closed, Dynamic", "", "m"), Separator, Cell("Driver Unit", "30 mm", "", "m"), Separator, Cell("Frequency Response", "4 Hz – 40,000 Hz", "", "m"), Separator, Cell("Impedance", "16 Ω (1 kHz)", "", "m"), Separator, Cell("Weight", "Approx. 250 g", "", "m")]), Stack([Cell("Battery Life", "30 hrs (NC ON) / 40 hrs (NC OFF)", "", "m"), Separator, Cell("Charging Time", "Approx. 3.5 hours", "", "m"), Separator, Cell("Bluetooth", "5.2", "", "m"), Separator, Cell("Codecs", "SBC, AAC, LDAC", "", "m"), Separator, Cell("NFC", "Yes", "", "m"), Separator, Cell("Multipoint", "Up to 2 devices", "", "m")])], "row", "l")])]), TabItem("Reviews", [Stack([Stack([Stack([Stack([Avatar("Анна К.", "", "m"), Stack([TextContent("Анна К.", "body-m", true), TextContent("Verified Purchase", "body-xs", false, "var(--plasma-colors-secondary)")], "column", "none")], "row", "s", "center"), Rating(5, "s", "accent")], "row", "s", "center", "between"), TextContent("Absolutely incredible sound quality! The noise cancellation is on another level — I can't hear anything on the subway. Battery lasts forever. Best headphones I've ever owned.", "body-m"), Stack([Badge("Sound Quality", "default", "s", true), Badge("Comfort", "default", "s", true), Badge("Battery", "default", "s", true)], "row", "xs")]), Separator, Stack([Stack([Stack([Avatar("Дмитрий П.", "", "m"), Stack([TextContent("Дмитрий П.", "body-m", true), TextContent("Verified Purchase", "body-xs", false, "var(--plasma-colors-secondary)")], "column", "none")], "row", "s", "center"), Rating(4, "s", "accent")], "row", "s", "center", "between"), TextContent("Great headphones overall. Sound is premium, NC works perfectly. Only downside — they don't fold like the XM4 so the case is bigger. But comfort is noticeably better.", "body-m"), Stack([Badge("Comfort", "default", "s", true), Badge("NC Quality", "default", "s", true)], "row", "xs")]), Separator, Stack([Stack([Stack([Avatar("Мария С.", "", "m"), Stack([TextContent("Мария С.", "body-m", true), TextContent("Verified Purchase", "body-xs", false, "var(--plasma-colors-secondary)")], "column", "none")], "row", "s", "center"), Rating(5, "s", "accent")], "row", "s", "center", "between"), TextContent("Bought these for long flights and they're a game-changer. Super lightweight, premium build, and the multipoint connection is so convenient for switching between phone and laptop.", "body-m"), Stack([Badge("Travel", "default", "s", true), Badge("Lightweight", "default", "s", true), Badge("Multipoint", "default", "s", true)], "row", "xs")])], "column", "m")])], "m")`,

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
  messages: ChatMessage[];
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
