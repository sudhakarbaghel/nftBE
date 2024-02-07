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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenInfo = exports.updateToken = exports.createTokenForUser = exports.getAllTokens = void 0;
const token_1 = require("../models/Token/token");
const contract_1 = require("../models/Contract/contract");
const getAllTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        const user = req.query.user;
        const contract = req.query.contract;
        console.log(contract, user);
        if (user) {
            query = { owner: user.trim() };
        }
        if (contract) {
            query = { contractAddress: contract.trim() };
        }
        const tokens = yield token_1.TokenModel.find(query);
        console.log(tokens);
        res.json(tokens);
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllTokens = getAllTokens;
const createTokenForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { user, tokenInfo } = req.body;
        if (!user || !tokenInfo) {
            return res.status(400).json({ error: "User and tokenInfo are required" });
        }
        const { tokenId, contractAddress, description, imageUri } = tokenInfo;
        if (!tokenId || !contractAddress || !description || !imageUri) {
            return res.status(400).json({
                error: "tokenId, contractAddress, and description ,imageUri ,sell are required",
            });
        }
        const existingToken = yield token_1.TokenModel.findOne({ tokenId });
        if (existingToken) {
            existingToken;
            return res
                .status(400)
                .json({ error: "Token with the given tokenId already exists" });
        }
        const existingContract = yield contract_1.ContractModel.findOne({ contractAddress });
        if (!existingContract) {
            return res.status(400).json({
                error: "Contract with the specified contractAddress does not exist",
            });
        }
        const newToken = yield token_1.TokenModel.create(Object.assign({ owner: user }, tokenInfo));
        res.status(201).json(newToken);
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createTokenForUser = createTokenForUser;
const updateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { tokenId } = _a, updatedValues = __rest(_a, ["tokenId"]);
        const existingToken = yield token_1.TokenModel.findOne({ tokenId });
        if (!existingToken) {
            return res.status(404).json({ error: "Token not found" });
        }
        Object.assign(existingToken, updatedValues);
        yield existingToken.save();
        res.status(200).json(existingToken);
    }
    catch (error) {
        console.error("Error updating token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateToken = updateToken;
const getTokenInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenId = req.params.tokenId;
        if (!tokenId) {
            return res.status(400).json({ error: "tokenId parameter is required" });
        }
        const token = yield token_1.TokenModel.findOne({ tokenId });
        if (token) {
            res.json(token);
        }
        else {
            res.status(404).json({ error: "Token not found" });
        }
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getTokenInfo = getTokenInfo;
