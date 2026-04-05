// src/services/upload.service.ts
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const UploadService = {

  async pickImage(): Promise<string | null> {
    try {
      // Yêu cầu quyền truy cập thư viện ảnh
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Cần cấp quyền truy cập thư viện ảnh để tiếp tục!');
        return null;
      }

      // Mở trình chọn ảnh
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, 
        aspect: [4, 3],      
        quality: 0.5,        
      });

      if (!result.canceled) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      console.error("Lỗi khi chọn ảnh: ", error);
      return null;
    }
  },

  /**
   * 2. Hàm upload ảnh lên Firebase Storage và lấy link trả về
   * @param uri Đường dẫn cục bộ của ảnh (lấy từ hàm pickImage)
   * @returns Download URL (link web) để lưu vào Firestore
   */
  async uploadImageToFirebase(uri: string): Promise<string> {
    try {

      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `products/image-${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error("Lỗi khi upload ảnh lên Firebase: ", error);
      throw error;
    }
  }
};