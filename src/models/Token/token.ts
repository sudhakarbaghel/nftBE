import { Schema, model, Document } from "mongoose";

export interface Token extends Document {
  tokenId: string;
  owner: string;
  contractAddress: string;
  description: string;
  imageUri: string;
  sell: boolean;
  price:string
}

const tokenSchema = new Schema<Token>({
  tokenId: { type: String, required: true },
  owner: { type: String, required: true },
  contractAddress: { type: String, required: true },
  description: { type: String, required: true },
  imageUri: { type: String, required: true },
  sell: { type: Boolean, required: true },
  price:{type:String,required:true}
});

const TokenModel = model<Token>("Token", tokenSchema);

export { TokenModel };
