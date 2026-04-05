import { AddCategoryModal } from '@/src/components/AddCategoryModal';
import { CategorySelectionModal } from '@/src/components/CategorySelectionModal';
import { ProductForm } from '@/src/components/ProductForm';
import { useCategory } from '@/src/hooks/useCategory';
import { categoryService } from '@/src/services/category.service';
import { productService } from '@/src/services/product.service';
import { UploadService } from '@/src/services/upload.service';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function AddProductScreen() {
  const router = useRouter();
  const { categories, loading: categoriesLoading, refreshCategories } = useCategory();
  const [image, setImage] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const pickImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSelectCategory = (category: string) => {
    setProductCategory(category);
    setShowCategoryModal(false);
  };

  const handleOpenCategoryModal = async () => {
    await refreshCategories();
    setShowCategoryModal(true);
  };

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setAddingCategory(true);
      await categoryService.addCategory(newCategory);
      setProductCategory(newCategory);
      setNewCategory('');
      setShowAddCategoryModal(false);
      Alert.alert('Thành công', 'Thêm danh mục thành công');
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm danh mục. Vui lòng thử lại');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleAddProduct = async () => {
    if (!productName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!productCategory.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập loại sản phẩm');
      return;
    }
    if (!productPrice.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá sản phẩm');
      return;
    }

    const price = parseFloat(productPrice);
    if (isNaN(price) || price < 0) {
      Alert.alert('Lỗi', 'Giá sản phẩm phải là số hợp lệ');
      return;
    }

    try {
      setLoading(true);
      let imageUrl: string | undefined;
      
      // Upload image to Firebase if selected
      if (image) {
        try {
          imageUrl = await UploadService.uploadImageToFirebase(image);
        } catch {
          Alert.alert('Lỗi', 'Không thể upload ảnh. Vui lòng thử lại');
          setLoading(false);
          return;
        }
      }
      
      const productData: any = {
        tensanpham: productName,
        loaisanpham: productCategory,
        gia: price,
      };
      if (imageUrl) {
        productData.hinhanh = imageUrl;
      }
      await productService.addProduct(productData);
      Alert.alert('Thành công', 'Thêm sản phẩm thành công', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);

      setProductName('');
      setProductCategory('');
      setProductPrice('');
      setImage(null);
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 mt-8">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
        <Text className="text-2xl font-bold text-gray-800">Thêm sản phẩm</Text>
      </View>

      <ProductForm
        productName={productName}
        productCategory={productCategory}
        productPrice={productPrice}
        image={image}
        onNameChange={setProductName}
        onCategoryPress={handleOpenCategoryModal}
        onPriceChange={setProductPrice}
        onImagePick={pickImage}
      />

      {/* Add Button */}
      <View className="px-6 mt-4">
        <TouchableOpacity
          className={`rounded-[10px] py-4 items-center ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
          onPress={handleAddProduct}
          disabled={loading}
        >
          <Text className="font-semibold text-white text-base">
            {loading ? 'Đang thêm...' : 'Thêm sản phẩm'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <CategorySelectionModal
        visible={showCategoryModal}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onSelectCategory={handleSelectCategory}
        onAddNewCategory={() => {
          setShowCategoryModal(false);
          setShowAddCategoryModal(true);
        }}
        onClose={() => setShowCategoryModal(false)}
      />

      <AddCategoryModal
        visible={showAddCategoryModal}
        value={newCategory}
        loading={addingCategory}
        onChangeText={setNewCategory}
        onAdd={handleAddNewCategory}
        onCancel={() => {
          setNewCategory('');
          setShowAddCategoryModal(false);
          setShowCategoryModal(true);
        }}
      />
    </View>
  );
}
