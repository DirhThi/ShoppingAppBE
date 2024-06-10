import mongoose from "mongoose";

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    if (!this.connection) {
      const uri = process.env.MONGODB_URL;
      try {
        this.connection = await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Kết nối MongoDB thành công!");
      } catch (error) {
        console.error("Kết nối MongoDB thất bại:", error);
        this.connection = null;
      }
    } else {
      console.log("Kết nối MongoDB đã tồn tại!");
    }
    return this.connection;
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      console.log("Ngắt kết nối MongoDB thành công!");
    } else {
      console.log("Chưa có kết nối nào được tạo!");
    }
  }
}

// Singleton pattern
const instance = new Database();

export default instance;