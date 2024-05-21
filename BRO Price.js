// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: handshake;
const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 10;

const widget = new ListWidget();
if (isDarkTheme) {
  widget.backgroundColor = new Color('#1C1C1E');
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://swap.ecko.finance/?token0=KDA&token1=BRO';

const headerStack = widget.addStack();
headerStack.setPadding(0, 0, 0, 0);
const headerText = headerStack.addText("$BRO Price");
headerText.font = Font.semiboldSystemFont(18);
if (isDarkTheme) {
  headerText.textColor = new Color('#FFFFFF');
}

async function buildWidget() {
  const broImage = await loadImage('https://swap.ecko.finance/images/crypto/bro.png');

  const broPriceInfo = await getTokenPriceInfo();
  const broPrice = broPriceInfo.price;
  
  const usdRate = await getUSDExchangeRate();
  const broPriceUSD = (parseFloat(broPrice) * parseFloat(usdRate)).toFixed(2);
  
  addCrypto(broImage, `${broPrice} KDA`, `$${broPriceUSD} USD`);
}

function addCrypto(image, kdaPrice, usdPrice) {
  const rowStack = widget.addStack();
  rowStack.setPadding(0, 0, 0, 0);
  rowStack.layoutVertically();

  const imageStack = rowStack.addStack();
  const priceStack = rowStack.addStack();
  const priceUSDStack = rowStack.addStack();

  imageStack.setPadding(5, 25, 5, 0);

  const imageNode = imageStack.addImage(image);
  imageNode.imageSize = new Size(50, 50);
  imageNode.leftAlignImage();

  const kdaPriceText = priceStack.addText(kdaPrice);
  kdaPriceText.font = Font.semiboldSystemFont(18);
  if (isDarkTheme) {
    kdaPriceText.textColor = new Color('#FFFFFF');
  }

  const usdPriceText = priceUSDStack.addText(usdPrice);
  usdPriceText.font = Font.systemFont(16);
  usdPriceText.textColor = new Color('#888888');
}

async function getTokenPriceInfo() {
  const url = 'https://backend2.euclabs.net/kadena-indexer/v1/account/P1J6eqZteaU19umFecSjpEuc7Pea79SdDzz2Vp9LOpc'
  const req = new Request(url)
  const apiResult = await req.loadJSON();
  return { price: (apiResult['assets'][0].totalBalance / apiResult['assets'][1].totalBalance).toFixed(2) };
}

async function getUSDExchangeRate() {
  const url = 'https://api.coinbase.com/v2/exchange-rates?currency=KDA';
  const req = new Request(url);
  const apiResult = await req.loadJSON();
  return apiResult['data']['rates']['USD'];
}

async function loadImage(imgUrl) {
  const req = new Request(imgUrl);
  return await req.loadImage();
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();