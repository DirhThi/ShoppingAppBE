import mongoose from "mongoose";

async function connectToDB() {
    const serverSelectionTimeoutMS = 10000;
    for (let i = 0; i < 3; ++i) {
      try {
        mongoose.connect(process.env.MONGODB_URL, {
          serverSelectionTimeoutMS,
        });
        break;
      } catch (err) {
        console.log("Failed", i);
        if (i >= 2) {
          throw err;
        }
      }
    }
  }

  async function disconnectFromDB() {
    try {
      await mongoose.disconnect();
      console.log('Ngắt kết nối với MongoDB thành công!');
    } catch (error) {
      console.error('Ngắt kết nối với MongoDB thất bại:', error);
    }
  }

export {connectToDB,disconnectFromDB}