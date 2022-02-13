const express = require("express");

const { CB_API_KEY, CB_WH_S, DOMAIN } = require("./config");

const { Client, resources } = require("coinbase-commerce-node");

const PORT = process.env.PORT || 3000;

Client.init(CB_API_KEY);

const { Charge } = resources;

const app = express();

app.get("/create-charge", async (req, res) => {
	const chargeData = {
		name: "Sound Efect",
		description: "Awesome sound effect",
		local_price: {
			amount: "0.2",
			currency: "USD",
		},
		pricing_type: "fixed_price",
		metadata: {
			customer_id: "12554",
			customer_name: "John Doie",
		},
		redirect_url: `${DOMAIN}/success-payment`,
		cancel_url: `${DOMAIN}/cancel-payment`,
	};

	const charge = await Charge.create(chargeData);

	res.send(charge);
});

app.get("/success-payment", (req, res) => {
	res.send("Payment successfull");
});

app.get("/cancel-payment", (req, res) => {
	res.send("Cancel Payment");
});

app.listen(PORT);

console.log(`Server on port: `, PORT);
