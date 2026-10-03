import mongoose from 'mongoose';

export const mochaHooks = {
  afterAll: async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  },
};
