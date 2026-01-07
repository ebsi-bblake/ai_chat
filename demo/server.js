import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname);

const server = http.createServer((req, res) => {
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(root, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    if (filePath.endsWith(".html")) {
      res.setHeader("Content-Type", "text/html");
    } else if (filePath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript");
    } else if (filePath.endsWith(".json")) {
      res.setHeader("Content-Type", "application/json");
    }

    res.end(data);
  });
});

server.listen(8080, () => {
  console.log("Demo server running at http://localhost:8080");
});
