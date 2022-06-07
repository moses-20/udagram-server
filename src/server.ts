import express from "express";
import { query, validationResult } from "express-validator";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", query("image_url").isURL(), async (req, res) => {
    try {
      // throws if there's validation error, else continue
      validationResult(req).throw();

      const imgURL = req.query.image_url;
      const filterURL = await filterImageFromURL(imgURL);

      res.status(200).sendFile(filterURL, (err) => {
        deleteLocalFiles([filterURL]);
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        error: e,
      });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
