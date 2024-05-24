const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 10;

const widget = new ListWidget();
if (isDarkTheme) {
  widget.backgroundColor = new Color('#1C1C1E');
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://dexscreener.com/solana/53vkphezqcbuyugc3sg3p9fnrthclu8uz5wghkxbfavg';

const headerStack = widget.addStack();
headerStack.setPadding(0, 20, 0, 0);
const headerText = headerStack.addText("$RFKJ Price");
headerText.font = Font.semiboldSystemFont(18);
if (isDarkTheme) {
  headerText.textColor = new Color('#FFFFFF');
}

async function buildWidget() {
  const rfkjImage = await loadImage('https://assets-global.website-files.com/65e1905c241e9fc8cbf9fc16/6622218d296f57acac282a29_NEW_LOGO_TRANSPARENT-p-500.png');

  const rfkjPriceInfo = await getTokenPriceInfo();
  const rfkjPrice = rfkjPriceInfo.priceNative;
  const rfkjPriceUSD = rfkjPriceInfo.priceUsd;
  const priceChangeInfo = await getPriceChangeInfo();
  
  addCrypto(rfkjImage, `${rfkjPrice} SOL`, priceChangeInfo, `$${rfkjPriceUSD} USD`);
}

function addCrypto(image, solPrice, priceChangeInfo, usdPrice) {
  const rowStack = widget.addStack();
  rowStack.setPadding(0, 0, 0, 0);
  rowStack.layoutVertically();

  const imageStack = rowStack.addStack();
  const priceStack = rowStack.addStack();
  const priceUSDStack = rowStack.addStack();
  const changeStack = rowStack.addStack();

  imageStack.setPadding(0, 45, 0, 0);

  const imageNode = imageStack.addImage(image);
  imageNode.imageSize = new Size(50, 50);
  imageNode.leftAlignImage();

  const solPriceText = priceStack.addText(solPrice);
  solPriceText.font = Font.semiboldSystemFont(18);
  if (isDarkTheme) {
    solPriceText.textColor = new Color('#FFFFFF');
  }

  const changeText = changeStack.addText(`${priceChangeInfo.arrow}${priceChangeInfo.changePercent}%`);
  changeText.font = Font.systemFont(14);
  if (priceChangeInfo.isPositive) {
    changeText.textColor = new Color('#0fd429'); // Green
  } else {
    changeText.textColor = new Color('#D22E2E'); // Red
  }

  const usdPriceText = priceUSDStack.addText(usdPrice);
  usdPriceText.font = Font.systemFont(16);
  usdPriceText.textColor = new Color('#888888');
  
  // Adjust spacing between texts
  changeStack.spacing = 2;
}

async function getTokenPriceInfo() {
  const url = 'https://api.dexscreener.com/latest/dex/pairs/solana/53vkpheZqcBuyuGc3Sg3p9FNRThCLU8uz5WghKxbFavG';
  const req = new Request(url);
  const apiResult = await req.loadJSON();
  const pairData = apiResult['pairs'][0];
  
  return { 
    priceNative: parseFloat(pairData.priceNative).toFixed(8), 
    priceUsd: parseFloat(pairData.priceUsd).toFixed(6) 
  };
}

async function getPriceChangeInfo() {
  const url = 'https://api.dexscreener.com/latest/dex/pairs/solana/53vkpheZqcBuyuGc3Sg3p9FNRThCLU8uz5WghKxbFavG';
  const req = new Request(url);
  const apiResult = await req.loadJSON();
  const priceChange = apiResult['pairs'][0]['priceChange']['h24'];
  const isPositive = priceChange >= 0;
  const arrow = isPositive ? '↗' : '↘';

  return { changePercent: priceChange.toFixed(2), isPositive, arrow };
}

async function loadImage(imgUrl) {
  const req = new Request(imgUrl);
  return await req.loadImage();
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
