const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Insert your secret key here
const SECRET_KEY = "ADD_YOUR_SECRET_KEY";

app.post("/create-payment-sessions", async (_req, res) => {
  // Create a PaymentSession
  const request = await fetch(
    "https://api.sandbox.checkout.com/payment-sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 1000,
        currency: "AED",
        reference: "ORD-123A",
        description: "Payment for Guitars and Amps",
        billing_descriptor: {
          name: "Jia Tsang",
          city: "Dubai",
        },
        customer: {
          email: "jia.tsang@example.com",
          name: "Jia Tsang",
        },
       // disabled_payment_methods:[
       //   "card","googlepay",

       // ],
        shipping: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "Dubai",
            zip: "SW1A 1AA",
            country: "AE",
          },
          phone: {
            number: "547137304",
            country_code: "+971",
          },
        },
        billing: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "Dubai",
            zip: "SW1A 1AA",
            country: "AE",
          },
          phone: {
            number: "547137304",
            country_code: "+971",
          },
        },
        processing_channel_id:"pc_en2cwboejfruzgoe6effb6jkw4",
        risk: {
          enabled: true,
        },
       "3ds": {
      "enabled": false,
      "challenge_indicator": "challenge_requested_mandate",
    },
        success_url: "http://localhost:3000/?status=succeeded",
        failure_url: "http://localhost:3000/?status=failed",
        metadata: {},
        items: [
          {
            name: "Guitar",
            quantity: 1,
            unit_price: 500,
          },
          {
            name: "Amp",
            quantity: 1,
            unit_price: 500,
          },
        ],
      }),
    }
  );

  const parsedPayload = await request.json();

  res.status(request.status).send(parsedPayload);
});


app.listen(3000, () =>
  console.log("Node server listening on port 3000: http://localhost:3000/")
);
