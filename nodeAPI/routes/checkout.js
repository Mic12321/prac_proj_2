const express = require("express");
const router = express.Router();
const ShoppingCartItem = require("../models/ShoppingCartItem");
const Item = require("../models/Item");

router.post("/api/checkout", async (req, res) => {
  const { userId } = req.body;
  const cart = await getShoppingCart(userId);
  const validatedCart = await validateCartPrices(cart);

  if (!validatedCart.isValid) {
    return res.status(400).json({
      error: "Prices have changed",
      updatedCart: validatedCart.updatedCart,
    });
  }

  // Proceed with payment session creation or charge
  //   const paymentSessionUrl = await createPaymentSession(validatedCart);
  const paymentSessionUrl = { url: "hihi" };

  res.json({ paymentSessionUrl });
});

module.exports = router;
