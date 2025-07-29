const address = "const address = "vJVHE5q1V4bcKvwjRqGj5mGC4BT8oiHXrJoyyFR49TLT";
const goal = 200000;

const widget = new ListWidget();
widget.setPadding(16, 16, 16, 16);
widget.url = "https://app.alphpad.com/launchpad/1000022/sale_v3";

widget.backgroundColor = Color.dynamic(
  new Color("#FFFFFF"),
  new Color("#1C1C1E")
);

// Title
const title = widget.addText("Aura Sale");
title.font = Font.semiboldSystemFont(18);
title.textColor = Color.dynamic(new Color("#000000"), new Color("#FFFFFF"));
title.centerAlignText();

const balance = await getBalance(address);
const percent = Math.min((balance / goal) * 100, 100);
const percentRounded = percent.toFixed(1);

const formattedBalance = formatK(balance);
const formattedGoal = formatK(goal);
widget.addSpacer(8);

const balanceText = widget.addText(`${formattedBalance}/${formattedGoal}`);
balanceText.font = Font.semiboldSystemFont(14);
balanceText.textColor = Color.gray();
balanceText.centerAlignText();

const unitText = widget.addText(`$ALPH`);
unitText.font = Font.systemFont(12);
unitText.textColor = Color.gray();
unitText.centerAlignText();

widget.addSpacer(6);
drawProgressBar(widget, percent);
widget.addSpacer(6);

const percentText = widget.addText(`${percentRounded}%`);
percentText.font = Font.systemFont(12);
percentText.textColor = Color.gray();
percentText.centerAlignText();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();

// --- Helpers ---
async function getBalance(addr) {
  const url = `https://backend.mainnet.alephium.org/addresses/${addr}`;
  const data = await new Request(url).loadJSON();
  return parseFloat(data.balance) / 1e18;
}

function formatK(num) {
  return `${Math.floor(num / 1000)}k`;
}

function drawProgressBar(widget, percent) {
  const width = 140;
  const height = 8;
  const progressWidth = Math.floor(width * (percent / 100));

  const bar = widget.addStack();
  bar.layoutHorizontally();
  bar.size = new Size(width, height);
  bar.cornerRadius = 4;
  bar.backgroundColor = new Color("#888888");

  const fill = bar.addStack();
  fill.size = new Size(progressWidth, height);
  fill.backgroundColor = new Color("#00FF6A"); // green
  fill.cornerRadius = 4;

  // This spacer pushes the fill to the left, preventing centering
  bar.addSpacer();
}";
const goal = 200000;

const widget = new ListWidget();
widget.setPadding(16, 16, 16, 16);
widget.url = "https://app.alphpad.com/launchpad/1000022/sale_v3";

widget.backgroundColor = Color.dynamic(
  new Color("#FFFFFF"),
  new Color("#1C1C1E")
);

// Title
const title = widget.addText("Aura Sale");
title.font = Font.semiboldSystemFont(18);
title.textColor = Color.dynamic(new Color("#000000"), new Color("#FFFFFF"));
title.centerAlignText();

const balance = await getBalance(address);
const percent = Math.min((balance / goal) * 100, 100);
const percentRounded = percent.toFixed(1);

const formattedBalance = formatK(balance);
const formattedGoal = formatK(goal);
widget.addSpacer(8);

const balanceText = widget.addText(`${formattedBalance}/${formattedGoal}`);
balanceText.font = Font.semiboldSystemFont(14);
balanceText.textColor = Color.gray();
balanceText.centerAlignText();

const unitText = widget.addText(`$ALPH`);
unitText.font = Font.systemFont(12);
unitText.textColor = Color.gray();
unitText.centerAlignText();

widget.addSpacer(6);
drawProgressBar(widget, percent);
widget.addSpacer(6);

const percentText = widget.addText(`${percentRounded}%`);
percentText.font = Font.systemFont(12);
percentText.textColor = Color.gray();
percentText.centerAlignText();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();

// --- Helpers ---
async function getBalance(addr) {
  const url = `https://backend.mainnet.alephium.org/addresses/${addr}`;
  const data = await new Request(url).loadJSON();
  return parseFloat(data.balance) / 1e18;
}

function formatK(num) {
  return `${Math.floor(num / 1000)}k`;
}

function drawProgressBar(widget, percent) {
  const width = 140;
  const height = 8;
  const progressWidth = Math.floor(width * (percent / 100));

  const bar = widget.addStack();
  bar.layoutHorizontally();
  bar.size = new Size(width, height);
  bar.cornerRadius = 4;
  bar.backgroundColor = new Color("#888888");

  const fill = bar.addStack();
  fill.size = new Size(progressWidth, height);
  fill.backgroundColor = new Color("#00FF6A"); // green
  fill.cornerRadius = 4;

  // This spacer pushes the fill to the left, preventing centering
  bar.addSpacer();
}
