import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Product, ProductID } from "../types/product";

const COLLECTION_NAME = "products";
export const productService = {
    async getAllProducts(): Promise<Product[]>{
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
            const products: Product[] = [];

            querySnapshot.forEach((doc) => {
                products.push({
                    ...doc.data(), 
                    idsanpham: doc.id  
                } as Product);
            });
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    },

    async addProduct(ProductData: ProductID): Promise<void> {
        try {
            const newProductRef = doc(collection(db, COLLECTION_NAME));
            await setDoc(newProductRef, {
                ...ProductData,
                idsanpham: newProductRef.id,
            });
        } catch (error) {
            console.error("Error adding product:", error);
            throw error;
        }
    },

    async deleteProduct(productId: string): Promise<void> {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, productId));
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },

    async updateProduct(productId: string, productData: ProductID): Promise<void> {
        try {
            await updateDoc(doc(db, COLLECTION_NAME, productId), {
                ...productData,
                idsanpham: productId,
            });
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    }
}

