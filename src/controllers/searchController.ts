import { Request, Response } from "express";
import { ContractModel, Contract } from "../models/Contract/contract";
import { TokenModel, Token } from "../models/Token/token";

type ResponseData = {
  type: "success" | "error";
  message?: string;
  data?: Array<SearchResult>;
};

interface SearchResult {
  type: string;
  contractAddress: string;
  tokenId?: string;
  owner?: string;
  name?: string;
  symbol?: string;
  description?: string;
  imageUri?: string;
  sell?: boolean;
  price?: string;
}

export const searchController = async (
  req: Request,
  res: Response<ResponseData>
): Promise<void> => {
  try {
    const searchQuery = req.query.search as string;
    console.log(searchQuery);

    if (!searchQuery || searchQuery.trim() === "") {
      const errorResponse: ResponseData = {
        type: "error",
        message: "Search query is required",
      };
      res.status(400).json(errorResponse);
      return;
    }

    const tokenResults: Token[] = await TokenModel.find({
      $or: [
        { tokenId: { $regex: new RegExp(searchQuery, "i") } },
        { owner: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
      ],
    });

    const contractResults: Contract[] = await ContractModel.find({
      $or: [
        { contractAddress: { $regex: new RegExp(searchQuery, "i") } },
        { owner: { $regex: new RegExp(searchQuery, "i") } },
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { symbol: { $regex: new RegExp(searchQuery, "i") } },
      ],
    });
    console.log(contractResults);

    if (tokenResults.length === 0 && contractResults.length === 0) {
      const errorResponse: ResponseData = {
        type: "error",
        message: "No matching tokens or contracts found",
      };
      res.status(404).json(errorResponse);
      return;
    }

    const combinedResults: Array<SearchResult> = [];

    const isContractAddressExists = (address: string): boolean => {
      return combinedResults.some((result) => result.contractAddress === address);
    };

    tokenResults.forEach((result) => {
      if (!isContractAddressExists(result.contractAddress)) {
        if (
          result.owner &&
          result.owner.toLowerCase() === searchQuery.toLowerCase()
        ) {
          const ownerResult: SearchResult = {
            type: "owner",
            contractAddress: result.contractAddress,
            owner: result.owner,
          };

          combinedResults.push(ownerResult);
        } else {
          const tokenResult: SearchResult = {
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
        if (
          result.owner &&
          result.owner.toLowerCase() === searchQuery.toLowerCase()
        ) {
          const ownerResult: SearchResult = {
            type: "owner",
            contractAddress: result.contractAddress,
            owner: result.owner,
          };

          combinedResults.push(ownerResult);
        } else {
          const contractResult: SearchResult = {
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
  } catch (error) {
    console.error("Error searching tokens and contracts:", error);
    const errorResponse: ResponseData = {
      type: "error",
      message: "Internal Server Error",
    };
    res.status(500).json(errorResponse);
  }
};
