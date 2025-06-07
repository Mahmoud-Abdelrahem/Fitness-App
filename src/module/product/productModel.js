import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category", 
        required: true 
    },
    price: { type: Number, required: true }, 
    image: { type: String, required: true }, 
    inStock: { type: Boolean, default: true }, 
    description: { type: String }, 
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;