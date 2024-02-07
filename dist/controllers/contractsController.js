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
exports.getContractInfo = exports.createContractForUser = exports.getAllContracts = void 0;
const contract_1 = require("../models/Contract/contract");
const getAllContracts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        const user = req.query.user;
        if (user) {
            query = { owner: user };
        }
        const contracts = yield contract_1.ContractModel.find(query);
        res.json(contracts);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAllContracts = getAllContracts;
const createContractForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, contractInfo } = req.body;
        if (!user || !contractInfo) {
            return res
                .status(400)
                .json({ error: "User and contractInfo are required" });
        }
        const { contractAddress, name, symbol, description } = contractInfo;
        if (!contractAddress || !name || !symbol || !description) {
            return res
                .status(400)
                .json({
                error: "contractAddress, name, symbol, and description are required",
            });
        }
        const existingContract = yield contract_1.ContractModel.findOne({ contractAddress });
        if (existingContract) {
            return res
                .status(400)
                .json({
                error: "Contract with the given contractAddress already exists",
            });
        }
        const newContract = yield contract_1.ContractModel.create(Object.assign(Object.assign({}, contractInfo), { owner: user }));
        res.status(201).json(newContract);
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createContractForUser = createContractForUser;
const getContractInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contractAddress = req.params.contractAddress;
        const contract = yield contract_1.ContractModel.findOne({ contractAddress });
        if (contract) {
            res.json(contract);
        }
        else {
            res.status(404).json({ error: "Contract not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getContractInfo = getContractInfo;
