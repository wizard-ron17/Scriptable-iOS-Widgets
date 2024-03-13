const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 10;

const widget = new ListWidget();
if (isDarkTheme) {
  widget.backgroundColor = new Color('#1C1C1E');
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://swap.ecko.finance/?token0=KDA&token1=HERON';

const headerStack = widget.addStack();
headerStack.setPadding(0, 0, 0, 0);
const headerText = headerStack.addText("$HERON Price");
headerText.font = Font.semiboldSystemFont(18);
if (isDarkTheme) {
  headerText.textColor = new Color('#FFFFFF');
}

async function buildWidget() {
  const heronImage = await loadImage('https://swap.ecko.finance/images/crypto/heron.png');

  const heronPriceInfo = await getTokenPriceInfo();
  const heronPrice = heronPriceInfo.price;
  
  const usdRate = await getUSDExchangeRate();
  const heronPriceUSD = (parseFloat(heronPrice) * parseFloat(usdRate)).toFixed(5);
  
  addCrypto(heronImage, ${heronPrice} KDA, $${heronPriceUSD} USD);
}

function addCrypto(image, kdaPrice, usdPrice) {
  const rowStack = widget.addStack();
  rowStack.setPadding(0, 0, 0, 0);
  rowStack.layoutVertically();

  const imageStack = rowStack.addStack();
  const priceStack = rowStack.addStack();
  const priceUSDStack = rowStack.addStack();

  imageStack.setPadding(5, 35, 5, 0);

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
  const url = 'https://backend2.euclabs.net/kadena-indexer/v1/account/PUS35mt6HequLHptLo9cid_X6x1sSPOTUgWLuuQM0hc'
  const req = new Request(url)
  const apiResult = await req.loadJSON();
  return { price: (apiResult['assets'][0].totalBalance / apiResult['assets'][1].totalBalance).toFixed(6) };
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
