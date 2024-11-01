const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 10;

const widget = new ListWidget();
if (isDarkTheme) {
  widget.backgroundColor = new Color('#1C1C1E');
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://mobula.io/pair/25ywM8iGxKpZWuGA5z6DXKGcZCXtPBmnbQyJEsjvjjWTy';

const headerStack = widget.addStack();
headerStack.setPadding(0, 5, 0, 0);
const headerText = headerStack.addText("$APAD Price");
headerText.font = Font.semiboldSystemFont(18);
  headerText.textColor = new Color('#FFFFFF');

async function buildWidget() {
  const apadImage = await loadImage('https://raw.githubusercontent.com/alephium/token-list/master/logos/APAD.png');

  const apadPriceInfo = await getTokenPriceInfo();
  const apadPrice = apadPriceInfo.price;
  
  const apadPriceToken = apadPriceInfo.priceToken;
  
  addCrypto(apadImage, `${apadPriceToken} ALPH`, `$${apadPrice} USD`);
}

function addCrypto(image, alphPrice, usdPrice) {
  const rowStack = widget.addStack();
  rowStack.setPadding(0, 0, 0, 0);
  rowStack.layoutVertically();

  const imageStack = rowStack.addStack();
  const priceTokenStack = rowStack.addStack();
  const priceStack = rowStack.addStack();

  imageStack.setPadding(5, 32, 5, 5);

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
  const url = 'https://api.mobula.io/api/1/market/pair?blockchain=alephium&address=vFpZ1DF93x1xGHoXM8rsDBFjpcoSsCi5ZEuA5NG5UJGX';
  const req = new Request(url)
  const apiResult = await req.loadJSON();
  const token1Data = apiResult.data.token1;
  return { priceToken: token1Data.priceToken.toFixed(4), price: token1Data.price.toFixed(3) };
}

async function loadImage(imgUrl) {
  const imgreq = new Request(imgUrl);
  return await imgreq.loadImage();
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
