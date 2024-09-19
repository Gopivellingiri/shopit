import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://designergopicbe:kOhYljvSYDC0vufI@cluster0.wv9pb.mongodb.net/shopit?retryWrites=true&w=majority&appName=Cluster0"
    );
    await Product.deleteMany();
    console.log("Products are deleted");
    await Product.insertMany(products);
    console.log("Products are added");
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
