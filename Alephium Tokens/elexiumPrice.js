const params = args.widgetParameter ? args.widgetParameter.split(",") : [];
const isDarkTheme = params?.[0] === 'dark';
const padding = 10;

const widget = new ListWidget();
if (isDarkTheme) {
  widget.backgroundColor = new Color('#1C1C1E');
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://www.elexium.finance';

// Add header
const headerStack = widget.addStack();
headerStack.setPadding(0, 5, 0, 0);
const headerText = headerStack.addText("$EX Price");
headerText.font = Font.semiboldSystemFont(18);
headerText.textColor = new Color('#FFFFFF');

// Main function to build the widget
async function buildWidget() {
  const exImage = await loadImage('https://raw.githubusercontent.com/alephium/token-list/master/logos/EX.png');
  const { alphPrice, usdPrice } = await getTokenPriceInfo();
  
  addCrypto(exImage, `${alphPrice} ALPH`, `$${usdPrice} USD`);
}

// Function to add the crypto info to the widget
function addCrypto(image, alphPrice, usdPrice) {
  const rowStack = widget.addStack();
  rowStack.setPadding(0, 0, 0, 0);
  rowStack.layoutVertically();

  const imageStack = rowStack.addStack();
  const priceTokenStack = rowStack.addStack();
  const priceStack = rowStack.addStack();

  imageStack.setPadding(5, 25, 5, 5);

  const imageNode = imageStack.addImage(image);
  imageNode.imageSize = new Size(50, 50);
  imageNode.leftAlignImage();

  const alphPriceText = priceTokenStack.addText(alphPrice);
  alphPriceText.font = Font.semiboldSystemFont(18);
  alphPriceText.textColor = isDarkTheme ? new Color('#FFFFFF') : new Color('#FFFFFF');

  const usdPriceText = priceStack.addText(usdPrice);
  usdPriceText.font = Font.systemFont(16);
  usdPriceText.textColor = new Color('#888888');
}

// Function to fetch ALPH and EX balances, calculate ALPH price in EX, and get USD conversion rate
async function getTokenPriceInfo() {
  // Fetch ALPH balance
  const alphResponse = await new Request('https://backend.mainnet.alephium.org/addresses/27Ub32AhfC9ULKGKGUTdDGU2ehvUN55aLS4oU8nmW3x9M/balance').loadJSON();
  const alphBalance = parseFloat(alphResponse.balance) / 1e18;

  // Fetch EX token balance
  const tokenResponse = await new Request('https://backend.mainnet.alephium.org/addresses/27Ub32AhfC9ULKGKGUTdDGU2ehvUN55aLS4oU8nmW3x9M/tokens-balance?limit=100&page=1').loadJSON();
  const exToken = tokenResponse.find(token => token.tokenId === "cad22f7c98f13fe249c25199c61190a9fb4341f8af9b1c17fcff4cd4b2c3d200");
  const exBalance = parseFloat(exToken.balance) / 1e18;

  // Calculate the price in ALPH (ALPH/EX)
  const alphPrice = (alphBalance / exBalance).toFixed(3);

  // Fetch USD conversion rate for ALPH
  const usdConversionRate = await getUSDConversionRate();
  const usdPrice = (alphPrice * usdConversionRate).toFixed(2);
  
  return { alphPrice, usdPrice };
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

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
