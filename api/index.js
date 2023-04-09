const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require ('dotenv').config();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const productcategoryRouter = require("./routes/productcategoryRoute");
const blogcategoryRouter = require("./routes/blogcategoryRoute");
const brandRouter = require("./routes/brandRoute");
const blogRouter = require("./routes/blogRoute");
const couponRouter = require("./routes/couponRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
dbConnect();

//registering the dependencies
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN
  }));

//registering the routes
app.use("/api/user",authRouter);
app.use("/api/product",productRouter);
app.use("/api/blog",blogRouter);
app.use("/api/productcategory",productcategoryRouter);
app.use("/api/blogcategory",blogcategoryRouter);
app.use("/api/brand",brandRouter);
app.use("/api/coupon",couponRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);


app.use(notFound);
app.use(errorHandler);
app.listen(PORT,()=>{
    console.log(`server is running at PORT ${PORT}`);
});

