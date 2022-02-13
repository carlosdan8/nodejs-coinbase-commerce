const { config } = require("dotenv");

config();

const CB_API_KEY = process.env.CB_API_KEY;
const CB_WH_S = process.env.CB_WH_S;
const DOMAIN = process.env.DOMAIN;

module.exports = {
	CB_API_KEY,
	CB_WH_S,
	DOMAIN,
};
