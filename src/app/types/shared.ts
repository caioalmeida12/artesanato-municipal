import { Product, ProductImage, Order, OrderItem, Address, User } from "@prisma/client"

export type ProductWithImages = Product & { images: ProductImage[], stock: number }
export type OrderWithItems = Order & { items: (OrderItem & { product: Product })[], address: Address, user: User }