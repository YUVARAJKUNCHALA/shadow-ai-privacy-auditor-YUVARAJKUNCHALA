import http from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/", import.meta.url));
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8"
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = normalize(join(root, requested));

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, { "Content-Type": types[extname(filePath)] ?? "application/octet-stream" });
  createReadStream(filePath).pipe(response);
});

server.listen(port, () => {
  console.log(`Shadow AI Privacy Auditor running at http://localhost:${port}`);
});
