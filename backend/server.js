import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import initializeDb from "./configs/db-init.js";
import createTable from "./configs/tables-init.js";
const PORT = process.env.PORT || 5000;
async function startServer() {
  await initializeDb();
  await createTable();
  app.listen(PORT,() => {
    console.log(`Server started listening on PORT ${PORT}`);
  });
}

startServer();