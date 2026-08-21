const net = require("net");

module.exports = async (req, res) => {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT);

  const socket = new net.Socket();

  socket.setTimeout(5000);

  socket.connect(port, host, () => {
    socket.destroy();

    res.status(200).json({
      success: true,
      message: "TCP CONNECT OK",
      host,
      port,
    });
  });

  socket.on("timeout", () => {
    socket.destroy();

    res.status(500).json({
      success: false,
      error: "TCP CONNECT TIMEOUT",
      host,
      port,
    });
  });

  socket.on("error", (err) => {
    socket.destroy();

    res.status(500).json({
      success: false,
      error: err.message,
      code: err.code,
      host,
      port,
    });
  });
};
