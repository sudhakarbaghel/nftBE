import { Request, Response } from "express";
import { TokenModel } from "../models/Token/token";
import { ContractModel } from "../models/Contract/contract";

export const getAllTokens = async (req: Request, res: Response) => {
  try {
    let query = {};

    const user = req.query.user as string;
    const contract = req.query.contract as string;
    console.log(contract,user)
    if (user) {
      query = { owner: user .trim()};
    }
    if (contract) {
      query = { contractAddress: contract.trim() };
    }

    const tokens = await TokenModel.find(query);
    console.log(tokens)
    res.json(tokens);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createTokenForUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { user, tokenInfo } = req.body;
    if (!user || !tokenInfo) {
      return res.status(400).json({ error: "User and tokenInfo are required" });
    }
    const { tokenId, contractAddress, description, imageUri } = tokenInfo;
    if (!tokenId || !contractAddress || !description || !imageUri) {
      return res.status(400).json({
        error:
          "tokenId, contractAddress, and description ,imageUri ,sell are required",
      });
    }
    const existingToken = await TokenModel.findOne({ tokenId });
    if (existingToken) {
      existingToken;
      return res
        .status(400)
        .json({ error: "Token with the given tokenId already exists" });
    }
    const existingContract = await ContractModel.findOne({ contractAddress });
    if (!existingContract) {
      return res.status(400).json({
        error: "Contract with the specified contractAddress does not exist",
      });
    }
    const newToken = await TokenModel.create({ owner: user, ...tokenInfo });
    res.status(201).json(newToken);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateToken = async (req: Request, res: Response) => {
  try {
    const { tokenId, ...updatedValues } = req.body;

    const existingToken = await TokenModel.findOne({ tokenId });

    if (!existingToken) {
      return res.status(404).json({ error: "Token not found" });
    }

    Object.assign(existingToken, updatedValues);

    await existingToken.save();

    res.status(200).json(existingToken);
  } catch (error) {
    console.error("Error updating token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTokenInfo = async (req: Request, res: Response) => {
  try {
    const tokenId = req.params.tokenId;
    if (!tokenId) {
      return res.status(400).json({ error: "tokenId parameter is required" });
    }
    const token = await TokenModel.findOne({ tokenId });
    if (token) {
      res.json(token);
    } else {
      res.status(404).json({ error: "Token not found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
