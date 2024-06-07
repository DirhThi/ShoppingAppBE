import mongoose from 'mongoose';
import removeAccents from 'remove-accents';

const searchContentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  hits: {
    type: Number,
    default: 0
  },
  normalizedContent: {
    type: String,
    required: true
  }
});

// Middleware để chuẩn hóa văn bản trước khi lưu
searchContentSchema.pre('validate', function (next) {
  if (this.content) {
    this.normalizedContent = removeAccents(this.content.toLowerCase());
  }
  next();
});

const SearchContent = mongoose.model('SearchContent', searchContentSchema);
export default SearchContent;
