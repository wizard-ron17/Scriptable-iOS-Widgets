const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 10;

const widget = new ListWidget();
if (isDarkTheme) {
  widget.backgroundColor = new Color('#1C1C1E');
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://mobula.io/pair/zXbdgDuFe82CwhnxVMfJHhJNGT78MWXELf53BRnwXFps';

const headerStack = widget.addStack();
headerStack.setPadding(0, 5, 0, 0);
const headerText = headerStack.addText("$ABX Price");
headerText.font = Font.semiboldSystemFont(18);
  headerText.textColor = new Color('#FFFFFF');

async function buildWidget() {
  const abxImage = await loadImage('https://raw.githubusercontent.com/alephium/token-list/master/logos/ABX.png');

  const abxPriceInfo = await getTokenPriceInfo();
  const abxPrice = abxPriceInfo.price;
  
  const abxPriceToken = abxPriceInfo.priceToken;
  
  addCrypto(abxImage, `${abxPriceToken} ALPH`, `$${abxPrice} USD`);
}

function addCrypto(image, alphPrice, usdPrice) {
  const rowStack = widget.addStack();
  rowStack.setPadding(0, 0, 0, 0);
  rowStack.layoutVertically();

  const imageStack = rowStack.addStack();
  const priceTokenStack = rowStack.addStack();
  const priceStack = rowStack.addStack();

  imageStack.setPadding(5, 27, 5, 5);

  const imageNode = imageStack.addImage(image);
  imageNode.imageSize = new Size(50, 50);
  imageNode.leftAlignImage();

  const alphPriceText = priceTokenStack.addText(alphPrice);
  alphPriceText.font = Font.semiboldSystemFont(18);
  if (isDarkTheme) {
    alphPriceText.textColor = new Color('#FFFFFF');
  }

  const usdPriceText = priceStack.addText(usdPrice);
  usdPriceText.font = Font.systemFont(16);
  usdPriceText.textColor = new Color('#888888');
}

async function getTokenPriceInfo() {
  const url = 'https://api.mobula.io/api/1/market/pair?blockchain=alephium&address=zXbdgDuFe82CwhnxVMfJHhJNGT78MWXELf53BRnwXFps';
  const req = new Request(url)
  const apiResult = await req.loadJSON();
  const token1Data = apiResult.data.token1;
  return { priceToken: token1Data.priceToken.toFixed(3), price: token1Data.price.toFixed(2) };
}

async function loadImage(imgUrl) {
  const imgreq = new Request(imgUrl);
  return await imgreq.loadImage();
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
