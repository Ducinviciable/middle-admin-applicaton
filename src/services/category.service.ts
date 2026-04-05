import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

const COLLECTION_NAME = "categories";

export const categoryService = {
  async getAllCategories(): Promise<string[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      const categories: string[] = [];
      
      querySnapshot.forEach((doc) => {
        categories.push(doc.data().name);
      });
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async addCategory(categoryName: string): Promise<void> {
    try {
      // Check if category already exists
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      
      const exists = querySnapshot.docs.some(
        (doc) => doc.data().name.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (exists) {
        throw new Error("Danh mục này đã tồn tại");
      }

      await addDoc(collection(db, COLLECTION_NAME), {
        name: categoryName,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  },
};
