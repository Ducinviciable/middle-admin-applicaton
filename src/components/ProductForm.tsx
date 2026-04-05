import { FontAwesome } from '@expo/vector-icons';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ProductFormProps {
  productName: string;
  productCategory: string;
  productPrice: string;
  image: string | null;
  onNameChange: (text: string) => void;
  onCategoryPress: () => void;
  onPriceChange: (text: string) => void;
  onImagePick: () => void;
}

export function ProductForm({
  productName,
  productCategory,
  productPrice,
  image,
  onNameChange,
  onCategoryPress,
  onPriceChange,
  onImagePick,
}: ProductFormProps) {
  return (
    <View className="mt-6 px-6 gap-4">

      <View className="h-[55px] flex-row items-center rounded-[10px] border border-[#A8A8A9] bg-[#F3F3F3] px-3">
        <FontAwesome
          name="product-hunt"
          size={18}
          color="#676767"
          style={{ marginRight: 10, width: 20, textAlign: 'center' }}
        />
        <TextInput
          className="flex-1 text-xs font-medium text-[#676767]"
          placeholder="Tên sản phẩm"
          placeholderTextColor="#676767"
          value={productName}
          onChangeText={onNameChange}
        />
      </View>

      <TouchableOpacity
        className="h-[55px] flex-row items-center rounded-[10px] mt-4 border border-[#A8A8A9] bg-[#F3F3F3] px-3"
        onPress={onCategoryPress}
      >
        <FontAwesome
          name="list"
          size={18}
          color="#676767"
          style={{ marginRight: 10, width: 20, textAlign: 'center' }}
        />
        <Text className="flex-1 text-xs font-medium text-[#676767]">
          {productCategory || 'Chọn hoặc thêm danh mục'}
        </Text>
        <FontAwesome name="chevron-down" size={14} color="#676767" />
      </TouchableOpacity>

      <View className="h-[55px] flex-row items-center rounded-[10px] border border-[#A8A8A9] bg-[#F3F3F3] px-3 mt-4">
        <FontAwesome
          name="dollar"
          size={18}
          color="#676767"
          style={{ marginRight: 10, width: 20, textAlign: 'center' }}
        />
        <TextInput
          className="flex-1 text-xs font-medium text-[#676767]"
          placeholder="Giá sản phẩm"
          keyboardType="numeric"
          placeholderTextColor="#676767"
          value={productPrice}
          onChangeText={onPriceChange}
        />
      </View>

      <TouchableOpacity className="rounded-[10px] bg-[#F3F3F3] p-4 items-center" onPress={onImagePick}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 10 }} />
        ) : (
          <View className="flex-row items-center">
            <FontAwesome name="image" size={18} color="#676767" />
            <Text className="ml-2 text-xs text-[#676767]">Chọn ảnh sản phẩm</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
