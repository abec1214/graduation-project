const dns = require("dns");

module.exports = async (req, res) => {
  try {
    const host = process.env.DB_HOST;

    const addresses = await dns.promises.lookup(host, {
      all: true,
    });

    res.status(200).json({
      host,
      addresses,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
