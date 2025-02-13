const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 10;

const widget = new ListWidget();
if (isDarkTheme) {
  widget.backgroundColor = new Color('#1C1C1E');
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://rondex.xyz/kds';

const headerStack = widget.addStack();
headerStack.setPadding(0, 5, 0, 0);
const headerText = headerStack.addText("$KDS Price");
headerText.font = Font.semiboldSystemFont(18);
if (isDarkTheme) {
  headerText.textColor = new Color('#FFFFFF');
}

async function buildWidget() {
  const wizaImage = await loadImage('https://assets.coingecko.com/coins/images/26970/large/kds.png?1696526024');

  const wizaPriceInfo = await getTokenPriceInfo();
  const wizaPrice = wizaPriceInfo.price;
  const wizaPriceUSD = wizaPriceInfo.priceUSD;
  const priceChangeInfo = await getPriceChangeInfo();
  
  addCrypto(wizaImage, `${wizaPrice} KDA`, priceChangeInfo, `$${wizaPriceUSD} USD`);
}

function addCrypto(image, kdaPrice, priceChangeInfo, usdPrice) {
  const rowStack = widget.addStack();
  rowStack.setPadding(0, 0, 0, 0);
  rowStack.layoutVertically();

  const imageStack = rowStack.addStack();
  const priceStack = rowStack.addStack();
  const priceUSDStack = rowStack.addStack();
  const changeStack = rowStack.addStack();

  imageStack.setPadding(5, 30, 5, 0);

  const imageNode = imageStack.addImage(image);
  imageNode.imageSize = new Size(50, 50);
  imageNode.leftAlignImage();

  const kdaPriceText = priceStack.addText(kdaPrice);
  kdaPriceText.font = Font.semiboldSystemFont(18);
  if (isDarkTheme) {
    kdaPriceText.textColor = new Color('#FFFFFF');
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
  const url = 'https://api.kdswap.exchange/graphql?query={price(token:"kdlaunch.kdswap-token", period:1){id,timestamp,token,price,priceInKda,intervalStamp}}';
  const req = new Request(url);
  const apiResult = await req.loadJSON();
  const firstPrice = apiResult['data']['price'][0].priceInKda;
  const lastPrice = apiResult['data']['price'][apiResult['data']['price'].length - 1].priceInKda;
  const priceChange = firstPrice - lastPrice;
  const changePercent = ((priceChange / lastPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;
  const arrow = isPositive ? '↑' : '↓';

  return { price: firstPrice.toFixed(5), priceUSD: apiResult['data']['price'][0].price.toFixed(4), changePercent, isPositive, arrow };
}

async function loadImage(imgUrl) {
  const req = new Request(imgUrl);
  return await req.loadImage();
}

async function getPriceChangeInfo() {
  const url = 'https://api.kdswap.exchange/graphql?query={price(token:"kdlaunch.kdswap-token",period:1){id,timestamp,token,price,priceInKda,intervalStamp}}';
  const req = new Request(url);
  const apiResult = await req.loadJSON();
  const firstPrice = apiResult['data']['price'][0].priceInKda;
  const lastPrice = apiResult['data']['price'][apiResult['data']['price'].length - 1].priceInKda;
  const priceChange = firstPrice - lastPrice;
  const changePercent = ((priceChange / lastPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;
  const arrow = isPositive ? '↗' : '↘';

  return { changePercent, isPositive, arrow };
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
