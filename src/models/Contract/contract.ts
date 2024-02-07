import { Schema, model, Document } from "mongoose";

interface Contract {
    contractAddress: string;
    owner: string;
    name: string;
    symbol: string;
    description: string;
}

const contractSchema = new Schema<Contract>({
    contractAddress: { type: String, required: true },
    owner: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    description: { type: String, required: true },
});
const ContractModel = model<Contract>("Contract", contractSchema);

export { ContractModel };
export {Contract}