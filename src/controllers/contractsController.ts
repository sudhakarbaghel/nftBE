import { Request, Response } from "express";
import { ContractModel } from "../models/Contract/contract";


export const getAllContracts = async (req: Request, res: Response) => {
  try {
    let query = {};
    
  
    const user = req.query.user as string;
    if (user) {
      query = { owner: user };
    }

    const contracts = await ContractModel.find(query);
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createContractForUser = async (req: Request, res: Response) => {
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

    const existingContract = await ContractModel.findOne({ contractAddress });
    if (existingContract) {
      return res
        .status(400)
        .json({
          error: "Contract with the given contractAddress already exists",
        });
    }

    const newContract = await ContractModel.create({
      ...contractInfo,
      owner: user,
    });
    res.status(201).json(newContract);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getContractInfo = async (req: Request, res: Response) => {
  try {
    const contractAddress = req.params.contractAddress;
    const contract = await ContractModel.findOne({ contractAddress });
    if (contract) {
      res.json(contract);
    } else {
      res.status(404).json({ error: "Contract not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
