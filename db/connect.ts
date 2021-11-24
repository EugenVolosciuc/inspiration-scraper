import path from "path";
import { createConnection } from "typeorm";

const isProduction = process.env.NODE_ENV === "production";

const connect = async () => {
  return await createConnection({
    type: "postgres",
    url: process.env.DB_URL,
    synchronize: !isProduction,
    // logging: !isProduction,
    entities: [
      path.join(__dirname, "entities", "*.ts"),
      path.join(__dirname, "entities", "*.js"),
    ],
  });
};

export default connect;
