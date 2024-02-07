import mongoose, { Document, Schema } from 'mongoose';

const priceSchema = new Schema({
  currencyId: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

interface IPriceModel extends Document {
  currencyId: string;
  price: number;
  lastUpdated: Date;
  updatePrice(newPrice: number): void;
}

priceSchema.methods.updatePrice = function (newPrice: number): void {
  this.price = newPrice;
  this.lastUpdated = new Date();
};

const PriceModel = mongoose.model<IPriceModel>('Price', priceSchema);

export default PriceModel;
