import { collection, onSnapshot, query, orderBy, getDocs } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { db } from "../lib/firebase";

export const useCategory = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Refresh categories manually
  const refreshCategories = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "categories"), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      const categoriesData: string[] = [];
      querySnapshot.forEach((doc) => {
        categoriesData.push(doc.data().name);
      });
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error refreshing categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categoriesData: string[] = [];
      querySnapshot.forEach((doc) => {
        categoriesData.push(doc.data().name);
      });
      setCategories(categoriesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching categories:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { categories, loading, refreshCategories };
};
