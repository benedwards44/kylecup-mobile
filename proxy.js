const http = require("http");
const https = require("https");

const PORT = 3333;

const server = http.createServer((req, res) => {
  // Expect paths like /api/apr/activities
  const targetUrl = `https://kylecup.edwards.nz${req.url}`;

  res.setHeader("Access-Control-Allow-Origin", "*");

  https
    .get(targetUrl, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    })
    .on("error", (err) => {
      res.writeHead(502);
      res.end(JSON.stringify({ error: err.message }));
    });
});

server.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
