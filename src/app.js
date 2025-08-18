const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const { notFound, errorHandler } = require("../errorMiddleware");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
