"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModel = void 0;
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    tokenId: { type: String, required: true },
    owner: { type: String, required: true },
    contractAddress: { type: String, required: true },
    description: { type: String, required: true },
    imageUri: { type: String, required: true },
    sell: { type: Boolean, required: true },
    price: { type: String, required: true }
});
const TokenModel = (0, mongoose_1.model)("Token", tokenSchema);
exports.TokenModel = TokenModel;
