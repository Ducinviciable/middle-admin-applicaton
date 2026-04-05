export interface Product {
    idsanpham: string;
    tensanpham: string;
    loaisanpham: string;
    gia: number;
    hinhanh?: string;
}

export type ProductID = Omit <Product,"idsanpham">