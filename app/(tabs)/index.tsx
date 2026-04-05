import { AddCategoryModal } from '@/src/components/AddCategoryModal';
import { CategorySelectionModal } from '@/src/components/CategorySelectionModal';
import { useCategory } from '@/src/hooks/useCategory';
import { useProduct } from '@/src/hooks/useProduct';
import { categoryService } from '@/src/services/category.service';
import { productService } from '@/src/services/product.service';
import { UploadService } from '@/src/services/upload.service';
import { userService } from '@/src/services/user.service';
import { Product } from '@/src/types/product';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const { products, loading } = useProduct();
  const { categories, loading: categoriesLoading, refreshCategories } = useCategory();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState('');
  const [tenSanPham, setTenSanPham] = useState('');
  const [loaiSanPham, setLoaiSanPham] = useState('');
  const [giaSanPham, setGiaSanPham] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await userService.logout();
          } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
          }
        },
      },
    ]);
  };

  const filteredProducts = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) {
      return products;
    }

    return products.filter((item) => {
      return (
        item.tensanpham.toLowerCase().includes(keyword) ||
        item.loaisanpham.toLowerCase().includes(keyword)
      );
    });
  }, [products, searchText]);

  const handleOpenEditModal = (product: Product) => {
    setEditingProductId(product.idsanpham);
    setTenSanPham(product.tensanpham);
    setLoaiSanPham(product.loaisanpham);
    setGiaSanPham(String(product.gia));
    setCurrentImageUrl(product.hinhanh);
    setNewImageUri(null);
    setIsEditModalVisible(true);
  };

  const handlePickNewImage = async () => {
    const pickedUri = await UploadService.pickImage();
    if (pickedUri) {
      setNewImageUri(pickedUri);
    }
  };

  const handleOpenCategoryModal = async () => {
    await refreshCategories();
    setShowCategoryModal(true);
  };

  const handleSelectCategory = (category: string) => {
    setLoaiSanPham(category);
    setShowCategoryModal(false);
  };

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setAddingCategory(true);
      await categoryService.addCategory(newCategory);
      setLoaiSanPham(newCategory);
      setNewCategory('');
      setShowAddCategoryModal(false);
      Alert.alert('Thành công', 'Thêm danh mục thành công');
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm danh mục. Vui lòng thử lại');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!tenSanPham.trim() || !loaiSanPham.trim() || !giaSanPham.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sản phẩm.');
      return;
    }

    const parsedPrice = parseFloat(giaSanPham);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Lỗi', 'Giá sản phẩm không hợp lệ.');
      return;
    }

    try {
      setUpdating(true);

      let finalImageUrl = currentImageUrl;
      if (newImageUri) {
        finalImageUrl = await UploadService.uploadImageToFirebase(newImageUri);
      }

      await productService.updateProduct(editingProductId, {
        tensanpham: tenSanPham,
        loaisanpham: loaiSanPham,
        gia: parsedPrice,
        hinhanh: finalImageUrl,
      });

      setIsEditModalVisible(false);
      Alert.alert('Thành công', 'Đã cập nhật sản phẩm.');
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật sản phẩm. Vui lòng thử lại.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa sản phẩm "${productName}" không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteProduct(productId);
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-400">Đang tải sản phẩm...</Text>
      </View>
    );
  }

  return (
    <View className="mt-10 flex-1 bg-gray-50" >
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
        <Text className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</Text>

        <View className="flex-row items-center gap-2">

          <Link href="/add" asChild>
            <TouchableOpacity className="rounded-xl bg-blue-600 px-5 py-2.5">
              <Text className="font-semibold text-white">+ Thêm mới</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="bg-white px-4 pb-3 pt-2">
        <TextInput
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800"
          placeholder="Tìm theo tên sản phẩm hoặc danh mục..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.idsanpham}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8, marginTop: 8 }}
        renderItem={({ item }) => (
          <View className="flex-1 mx-2 mt-4 rounded-xl bg-white p-4 shadow-sm overflow-hidden">
            <Text className="text-lg font-semibold">{item.tensanpham}</Text>
            {item.hinhanh && (
              <Image
                resizeMode='contain'
                className='h-[200px]'
                source={{ uri: item.hinhanh }}
                style={{ width: '100%', borderRadius: 12, marginBottom: 12, backgroundColor: '#f3f4f6' }}
              />
            )}
            <Text className="mt-2 text-xl font-bold text-green-600">{item.gia.toLocaleString()}đ</Text>
            <Text className="text-gray-500">Tag: {item.loaisanpham}</Text>
              <View className="mb-3 flex-row justify-start mt-2">
                <TouchableOpacity
                  className="rounded-lg bg-amber-500 px-3 py-1.5"
                  onPress={() => handleOpenEditModal(item)}
                >
                  <Text className="font-medium text-white">Sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="rounded-lg bg-red-500 ml-4 px-3 py-1.5"
                  onPress={() => handleDeleteProduct(item.idsanpham, item.tensanpham)}
                >
                  <Text className="font-medium text-white">Xóa</Text>
                </TouchableOpacity>
            </View>
          </View>
        )}
        
        ListEmptyComponent={
          <View className="mt-20 flex-1 items-center justify-center">
            <Text className="text-lg text-gray-400">
              {searchText.trim() ? 'Không tìm thấy sản phẩm phù hợp' : 'Chưa có sản phẩm nào'}
            </Text>

            {!searchText.trim() && (
              <Link href="/add" asChild>
                <TouchableOpacity className="mt-6 rounded-xl bg-blue-600 px-8 py-3">
                  <Text className="font-medium text-white">Thêm sản phẩm đầu tiên</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
        }
      />

      <Modal visible={isEditModalVisible} transparent animationType="slide" statusBarTranslucent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-2xl bg-white p-5 pb-8">
            <Text className="mb-4 text-xl font-bold text-gray-800">Sửa sản phẩm</Text>

            <TextInput
              className="mb-3 rounded-xl border border-gray-300 px-4 py-3 text-gray-800"
              placeholder="Tên sản phẩm"
              value={tenSanPham}
              onChangeText={setTenSanPham}
            />

            <TouchableOpacity
              className="mb-3 rounded-xl border border-gray-300 px-4 py-3"
              onPress={handleOpenCategoryModal}
            >
              <Text className={loaiSanPham ? 'text-gray-800' : 'text-gray-400'}>
                {loaiSanPham || 'Chọn hoặc thêm danh mục'}
              </Text>
            </TouchableOpacity>

            <TextInput
              className="mb-3 rounded-xl border border-gray-300 px-4 py-3 text-gray-800"
              placeholder="Giá sản phẩm"
              keyboardType="numeric"
              value={giaSanPham}
              onChangeText={setGiaSanPham}
            />

            <TouchableOpacity
              className="mb-3 rounded-xl bg-gray-100 px-4 py-3"
              onPress={handlePickNewImage}
            >
              <Text className="text-center font-medium text-gray-700">Chọn ảnh mới</Text>
            </TouchableOpacity>

            {(newImageUri || currentImageUrl) && (
              <Image
                resizeMode="contain"
                source={{ uri: newImageUri || currentImageUrl }}
                style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 12, backgroundColor: '#f3f4f6' }}
              />
            )}

            <View className="mt-2 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-xl bg-gray-300 py-3"
                disabled={updating}
                onPress={() => {
                  setIsEditModalVisible(false);
                  setShowCategoryModal(false);
                  setShowAddCategoryModal(false);
                }}
              >
                <Text className="text-center font-semibold text-gray-700">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 rounded-xl py-3 ${updating ? 'bg-blue-400' : 'bg-blue-600'}`}
                disabled={updating}
                onPress={handleUpdateProduct}
              >
                <Text className="text-center font-semibold text-white">{updating ? 'Đang lưu...' : 'Lưu'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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