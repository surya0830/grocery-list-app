import mongoose, { Schema } from 'mongoose';

export interface IGroceryItem {
  _id?: mongoose.Types.ObjectId;  // Add _id property
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isCompleted: boolean;
  notes?: string;
  usageRate?: number; // in days
  lastPurchased?: Date;
  expiryDate?: Date;
}

export interface IGroceryList extends mongoose.Document {
  name: string;
  user: mongoose.Types.ObjectId;
  items: IGroceryItem[];
  isDefault: boolean;
  dateCompleted?: Date;
  store?: mongoose.Types.ObjectId;
}

const groceryItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  unit: {
    type: String,
    default: 'item',
  },
  category: {
    type: String,
    default: 'Other',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  usageRate: {
    type: Number, // in days
  },
  lastPurchased: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
});

const groceryListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    items: [groceryItemSchema],
    isDefault: {
      type: Boolean,
      default: false,
    },
    dateCompleted: {
      type: Date,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
    },
  },
  {
    timestamps: true,
  }
);

const GroceryList = mongoose.model<IGroceryList>('GroceryList', groceryListSchema);

export default GroceryList;
