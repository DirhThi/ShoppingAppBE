import SearchContent from "../models/searchContentModel.js";
import removeAccents from "remove-accents";

const searchContentController = {
  addSearchContent: async (req, res, next) => {
    try {
      let { content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      content = content.trim().replace(/\s+/g, " ");
      const normalizedContent = removeAccents(content.toLowerCase());

      let existingContent = await SearchContent.findOne({ normalizedContent });

      if (existingContent) {
        existingContent.hits += 1;
        await existingContent.save();
        return res.status(200).json({
          isUpdated: true,
          content: existingContent,
        });
      } else {
        const newSearchContent = new SearchContent({
          content,
          normalizedContent,
          hits: 1,
        });
        await newSearchContent.save();
        return res.status(201).json({
          isUpdated:false,
          content: newSearchContent,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getTopSearchContents: async (req, res, next) => {
    try {
      const { keyword } = req.query;

      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required" });
      }

      const normalizedKeyword = removeAccents(keyword.trim().toLowerCase());

      const searchContents = await SearchContent.find({
        normalizedContent: { $regex: normalizedKeyword, $options: "i" },
      })
        .sort({ hits: -1 })
        .limit(10);

      return res.status(200).json(searchContents);
    } catch (error) {
      next(error);
    }
  },
};

export default searchContentController;
