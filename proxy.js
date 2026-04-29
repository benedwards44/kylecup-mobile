const http = require("http");
const https = require("https");

const PORT = 3333;

const server = http.createServer((req, res) => {
  // Expect paths like /api/apr/activities
  const targetUrl = `https://kylecup.edwards.nz${req.url}`;

  res.setHeader("Access-Control-Allow-Origin", "*");

  const options = {
    hostname: "kylecup.edwards.nz",
    path: req.url,
    method: req.method,
    headers: {
      host: "kylecup.edwards.nz",
      accept: "application/json",
    },
  };

  const proxyReq = https
    .request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    })
    .on("error", (err) => {
      res.writeHead(502);
      res.end(JSON.stringify({ error: err.message }));
    });

  req.pipe(proxyReq);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Proxy running on http://0.0.0.0:${PORT}`);
});
