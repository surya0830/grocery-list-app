import mongoose from 'mongoose';

export interface IStore extends mongoose.Document {
  name: string;
  logoUrl: string;
  apiIntegrationKey?: string;
  apiEndpoint?: string;
  isActive: boolean;
}

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    apiIntegrationKey: {
      type: String,
    },
    apiEndpoint: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model<IStore>('Store', storeSchema);

export default Store;
