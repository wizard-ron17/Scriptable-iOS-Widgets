const params = args.widgetParameter ? args.widgetParameter.split(",") : [];
const isDarkTheme = params?.[0] === 'dark';
const padding = 10;

const widget = new ListWidget();
if (isDarkTheme) {
  widget.backgroundColor = new Color('#1C1C1E');
}
widget.setPadding(padding, padding, padding, padding);
widget.url = 'https://sexy-pepe.xyz';

// Add header
const headerStack = widget.addStack();
headerStack.setPadding(0, 5, 0, 0);
const headerText = headerStack.addText("$EXY Price");
headerText.font = Font.semiboldSystemFont(18);
headerText.textColor = new Color('#FFFFFF');

// Main function to build the widget
async function buildWidget() {
  const exyImage = await loadImage('https://raw.githubusercontent.com/alephium/token-list/master/logos/EXY.png'); // Replace with EXY logo URL
  const { exyPriceInEx, usdPrice } = await getTokenPriceInfo();
  
  addCrypto(exyImage, `${exyPriceInEx} EX`, `$${usdPrice} USD`);
}

// Function to add the crypto info to the widget
function addCrypto(image, exPrice, usdPrice) {
  const rowStack = widget.addStack();
  rowStack.setPadding(0, 0, 0, 0);
  rowStack.layoutVertically();

  const imageStack = rowStack.addStack();
  const priceTokenStack = rowStack.addStack();
  const priceStack = rowStack.addStack();

  imageStack.setPadding(5, 30, 5, 5);

  const imageNode = imageStack.addImage(image);
  imageNode.imageSize = new Size(50, 50);
  imageNode.leftAlignImage();

  const exPriceText = priceTokenStack.addText(exPrice);
  exPriceText.font = Font.semiboldSystemFont(18);
  exPriceText.textColor = isDarkTheme ? new Color('#FFFFFF') : new Color('#FFFFFF');

  const usdPriceText = priceStack.addText(usdPrice);
  usdPriceText.font = Font.systemFont(16);
  usdPriceText.textColor = new Color('#888888');
}

// Function to fetch EXY price in EX and calculate the USD price of EXY
async function getTokenPriceInfo() {
  // Fetch EXY last trade price in EX
  const exyTradeData = await new Request('https://api.elexium.finance/coingecko/historical_trades?ticker=26ZZNScke9xJyVcZAktVGvwRwRd8ArVtpXK2hqpEK6UsR_28LgMeQGdvtXfsvWhpNNVx1DoSiz7TzrATv9qxMQP5is9&start_time=1731471405000').loadJSON();
  const exyPriceInEx = parseFloat(exyTradeData[exyTradeData.length - 1].price).toFixed(6);

  // Fetch ALPH balance
  const alphResponse = await new Request('https://backend.mainnet.alephium.org/addresses/27Ub32AhfC9ULKGKGUTdDGU2ehvUN55aLS4oU8nmW3x9M/balance').loadJSON();
  const alphBalance = parseFloat(alphResponse.balance) / 1e18;

  // Fetch EX token balance
  const tokenResponse = await new Request('https://backend.mainnet.alephium.org/addresses/27Ub32AhfC9ULKGKGUTdDGU2ehvUN55aLS4oU8nmW3x9M/tokens-balance?limit=100&page=1').loadJSON();
  const exToken = tokenResponse.find(token => token.tokenId === "cad22f7c98f13fe249c25199c61190a9fb4341f8af9b1c17fcff4cd4b2c3d200");
  const exBalance = parseFloat(exToken.balance) / 1e18;

  // Calculate the price in ALPH (ALPH/EX)
  const exPriceInAlph = (alphBalance / exBalance);

  // Fetch USD conversion rate for ALPH
  const usdConversionRate = await getUSDConversionRate();
  
  // Calculate USD price of EXY
  const usdPrice = (exyPriceInEx * exPriceInAlph * usdConversionRate).toFixed(5);
  
  return { exyPriceInEx, usdPrice };
}

// Function to fetch ALPH to USD conversion rate from Coinbase API
async function getUSDConversionRate() {
  const url = 'https://api.coinbase.com/v2/exchange-rates?currency=ALPH';
  const response = await new Request(url).loadJSON();
  return parseFloat(response.data.rates.USD);
}

// Helper function to load images
async function loadImage(imgUrl) {
  const req = new Request(imgUrl);
  return await req.loadImage();
}

await buildWidget();
*/

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
