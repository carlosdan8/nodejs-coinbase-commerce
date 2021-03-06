const express = require("express");

const { CB_API_KEY, CB_WH_S, DOMAIN } = require("./config");

const { Client, resources } = require("coinbase-commerce-node");

const morgan = require("morgan");

const PORT = process.env.PORT || 3000;

Client.init(CB_API_KEY);

const { Charge } = resources;

const app = express();

app.use(morgan("dev"));

app.use(
	express.json({
		verify: (req, res, buf) => {
			req.rawBody = buf;
		},
	})
);

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

app.post("payment-handler", (req, res) => {
	const rawBody = req.rawBody;
	const signature = req.headers["x-cc-webhook-signature"];
	const webhookSecret = CB_WH_S;

	let event;

	try {
		event = webhookSecret.verifyEventBody(
			rawBody,
			signature,
			webhookSecret
		);
		console.log(event);
		if (event.type === "charge:pending") {
			console.info("Charge is pending");
		}
		if (event.type === "charge:confirmed") {
			console.info("Charge is confirmed");
		}
		if (event.type === "charge:failed") {
			console.info("Chargue failed");
		}
		return res.status(200).send(event.id);
	} catch (error) {
		console.error(error);
		res.status(400).send("failed");
	}
});

app.get("/success-payment", (req, res) => {
	res.send("Payment successfull");
});

app.get("/cancel-payment", (req, res) => {
	res.send("Cancel Payment");
});

app.listen(PORT);

console.log(`Server on port: `, PORT);
