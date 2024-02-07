"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractModel = void 0;
const mongoose_1 = require("mongoose");
const contractSchema = new mongoose_1.Schema({
    contractAddress: { type: String, required: true },
    owner: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    description: { type: String, required: true },
});
const ContractModel = (0, mongoose_1.model)("Contract", contractSchema);
exports.ContractModel = ContractModel;
