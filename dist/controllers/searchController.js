"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchController = void 0;
const contract_1 = require("../models/Contract/contract");
const token_1 = require("../models/Token/token");
const searchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.search;
        console.log(searchQuery);
        if (!searchQuery || searchQuery.trim() === "") {
            const errorResponse = {
                type: "error",
                message: "Search query is required",
            };
            res.status(400).json(errorResponse);
            return;
        }
        const tokenResults = yield token_1.TokenModel.find({
            $or: [
                { tokenId: { $regex: new RegExp(searchQuery, "i") } },
                { owner: { $regex: new RegExp(searchQuery, "i") } },
                { description: { $regex: new RegExp(searchQuery, "i") } },
            ],
        });
        const contractResults = yield contract_1.ContractModel.find({
            $or: [
                { contractAddress: { $regex: new RegExp(searchQuery, "i") } },
                { owner: { $regex: new RegExp(searchQuery, "i") } },
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { symbol: { $regex: new RegExp(searchQuery, "i") } },
            ],
        });
        console.log(contractResults);
        if (tokenResults.length === 0 && contractResults.length === 0) {
            const errorResponse = {
                type: "error",
                message: "No matching tokens or contracts found",
            };
            res.status(404).json(errorResponse);
            return;
        }
        const combinedResults = [];
        const isContractAddressExists = (address) => {
            return combinedResults.some((result) => result.contractAddress === address);
        };
        tokenResults.forEach((result) => {
            if (!isContractAddressExists(result.contractAddress)) {
                if (result.owner &&
                    result.owner.toLowerCase() === searchQuery.toLowerCase()) {
                    const ownerResult = {
                        type: "owner",
                        contractAddress: result.contractAddress,
                        owner: result.owner,
                    };
                    combinedResults.push(ownerResult);
                }
                else {
                    const tokenResult = {
                        type: "token",
                        contractAddress: result.contractAddress,
                        tokenId: result.tokenId,
                        owner: result.owner,
                        description: result.description,
                        imageUri: result.imageUri,
                        sell: result.sell,
                        price: result.price,
                    };
                    combinedResults.push(tokenResult);
                }
            }
        });
        contractResults.forEach((result) => {
            if (!isContractAddressExists(result.contractAddress)) {
                if (result.owner &&
                    result.owner.toLowerCase() === searchQuery.toLowerCase()) {
                    const ownerResult = {
                        type: "owner",
                        contractAddress: result.contractAddress,
                        owner: result.owner,
                    };
                    combinedResults.push(ownerResult);
                }
                else {
                    const contractResult = {
                        type: "contract",
                        contractAddress: result.contractAddress,
                        owner: result.owner,
                        name: result.name,
                        symbol: result.symbol,
                        description: result.description,
                    };
                    combinedResults.push(contractResult);
                }
            }
        });
        res.status(200).json({
            type: "success",
            data: combinedResults,
        });
    }
    catch (error) {
        console.error("Error searching tokens and contracts:", error);
        const errorResponse = {
            type: "error",
            message: "Internal Server Error",
        };
        res.status(500).json(errorResponse);
    }
});
exports.searchController = searchController;
