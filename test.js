const productPrices = {
  "Product A": 20,
  "Product B": 40,
  "Product C": 50,
};

const discountRules = {
  flat_10_discount: { minTotal: 200, discountAmount: 10 },
  bulk_5_discount: { minTotal: 10, discountPercentage: 5 },
  bulk_10_discount: { minTotal: 20, discountPercentage: 10 },
  tiered_50_discount: {
    quantityTotal: 200,
    intvidualQuantityTotal: 15,
    discountPercentage: 50,
  },
};

const giftWrapFee = 1;
const shippingFeePerPackage = 5;
const unitsPerPackage = 10;

const calculateDiscount = (cart) => {
  let totalQuantity = Object.values(cart).reduce((acc, val) => acc + val, 0);
  let totalPrice = Object.keys(cart).reduce(
    (acc, product) => acc + productPrices(product) * cart[product],
    0
  );

  let discountAmounts = {};
  for (let rule in discountRules) {
    let ruleInfo = discountRules[rule];
    discountAmounts[rule] =
      rule === "flat_10_discount" && totalPrice > ruleInfo.minTotal
        ? ruleInfo.discountAmount
        : rule === "tiered_50_discount" &&
          totalQuantity > ruleInfo.quantityTotal
        ? Object.keys(cart).reduce((acc, product) => {
            if (cart[product] > ruleInfo.intvidualQuantityTotal) {
              let discountedUnits =
                cart[product] - ruleInfo.intvidualQuantityTotal;
              acc +=
                productPrices[product] *
                discountedUnits *
                (ruleInfo.discountPercentage / 100);
            }
            return acc;
          }, 0)
        : 0;
  }

  let maxDiscountRule = Object.keys(discountAmounts).reduce(
    (a, b) => (discountAmounts[a] > discountAmounts[b] ? a : b),
    null
  );

  let maxDiscountAmount = maxDiscountRule
    ? discountAmounts[maxDiscountRule]
    : 0;

  return [maxDiscountRule, maxDiscountAmount];
};

const calculateShippingFee = (cart) => {
  let totalQuantity = Object.values(cart).reduce((acc, val) => acc + val, 0);
  let totalPackages = Math.ceil(totalQuantity / unitsPerPackage);

  return totalQuantity * shippingFeePerPackage;
};

const handleOrder = () => {
  let cart = {};
  console.log("Please enter the quantity of each product:");
  for (let product in productPrices) {
    let quantity = parseInt(prompt(`Enter the quantity of ${product}:`));
    cart[product] = quantity;
  }

  let giftWraps = {};
  console.log("Do you want to wrap each product as a gift (yes/no):");
  for (let product in cart) {
    let giftwrap = prompt(
      `Do you want to wrap ${product} as a gift (yes/no):`
    ).toLowerCase();
    giftWraps[product] = giftwrap === "yes";
  }

  let subTotal = 0;
  console.log("\nItems:");
  for (let product in cart) {
    let quantity = cart[product];
    let totalAmount = productPrices[product] * quantity;
    if (giftWraps[product]) {
      totalAmount += giftWrapFee * quantity;
    }

    console.log(
      `${product}: ${quantity} x ${productPrices[product]} = ${totalAmount}`
    );
    subTotal += totalAmount;
  }

  let [discountRule, discountAmount] = calculateDiscount(cart);
  console.log(`\nDiscount applied: ${discountRule}`);
  console.log(`Discount amount: ${discountAmount}`);

  let shippingFee = calculateShippingFee(cart);
  console.log(`\nShipping fee: ${shippingFee}`);

  let total = subTotal - discountAmount + shippingFee;
  console.log(`\nTotal: ${total}`);
};

handleOrder();
