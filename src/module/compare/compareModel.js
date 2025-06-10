import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    date: { type: Date, required: true },
    weight: { type: Number, required: false },
    facing: { type: String, enum: ["Front", "Back", "Left", "Right"], required: false },
});

const compareSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gallery: [photoSchema],
    comparison: {
        beforePhoto: { type: photoSchema, required: false },
        afterPhoto: { type: photoSchema, required: false },
        progressPercentage: { type: Number, required: false },
        weightDifference: { type: Number, required: false },
        dateDifference: { type: Number, required: false },
    },
}, { timestamps: true });

const Compare = mongoose.model("Compare", compareSchema);

export default Compare;
