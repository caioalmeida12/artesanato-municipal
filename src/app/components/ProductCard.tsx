import { useCart } from '../(pages)/(usuario)/CartContext';
import { ProductWithImages } from '../types/shared';
import React, { useState } from 'react';

type ProductWithUser = ProductWithImages & { user: { username: string } };

const ProductCard = ({ product }: { product: ProductWithUser }) => {
    const [count, setCount] = useState(1);
    const { addToCart } = useCart();

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count > 1 ? count - 1 : 1);

    const handleAddToCart = () => {
        for (let i = 0; i < count; i++) {
            addToCart(product);
        }
    };

    return (
        <div className="product-card border rounded-lg p-4 flex flex-col items-center">
            <div className="product-image mb-4">
                {product.images?.length ? (
                    <img src={product.images[0].imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                ) : (
                    <p>Sem imagens disponíveis</p>
                )}
            </div>
            <div className="product-info text-center mb-4">
                <h2 className="font-bold text-lg">{product.name}</h2>
                <p>{product.description}</p>
                <p>Preço: R${product.price.toFixed(2)}</p>
                <p>Estoque: {product.quantity}</p>
                <p>Vendedor: {product.user.username}</p>
            </div>
            <div className="counter flex items-center mb-4">
                <button onClick={decrement} className="px-2 py-1 border rounded-l-lg">-</button>
                <span className="px-4">{count}</span>
                <button onClick={increment} className="px-2 py-1 border rounded-r-lg">+</button>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleAddToCart}>Adicionar ao Carrinho</button>
        </div>
    );
};

export default ProductCard;