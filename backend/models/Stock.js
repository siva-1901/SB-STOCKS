const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    previousClose: { type: Number, default: 0 },
    marketCap: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    sector: { type: String, default: 'General' },
    logo: { type: String, default: '' },
  },
  { timestamps: true }
);

stockSchema.virtual('changePercent').get(function () {
  if (!this.previousClose) return 0;
  return ((this.price - this.previousClose) / this.previousClose) * 100;
});

stockSchema.set('toJSON', { virtuals: true });
stockSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Stock', stockSchema);
