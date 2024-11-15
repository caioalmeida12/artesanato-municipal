"use client"

import { useState, useEffect } from "react";
import { createOneCategory, findAllCategories, deleteCategory, updateCategory } from "@/app/server/actions/category";
import { createOneProduct, findAllProductsByUser, addProductImage, deleteProduct, deleteProductImage, updateProduct, updateProductImage } from "@/app/server/actions/products";
import { findAllOrdersByUser, updateOrderStatus } from "@/app/server/actions/orders";
import { findOneUserById } from "@/app/server/actions/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCookies } from 'next-client-cookies';
import { Product, ProductImage } from "@prisma/client";
import { useCart } from "../(usuario)/CartContext";

export default function Page() {
    const queryClient = useQueryClient()
    const user_id = Number(useCookies().get("id"))
    const [activeTab, setActiveTab] = useState("products");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [error]);

    const { data: usuario } = useQuery({
        queryKey: ["usuario"],
        queryFn: async () => {
            const res = await findOneUserById(user_id)
            return res.success ? res.response[0] : undefined
        }
    })

    const { data: produtos } = useQuery({
        queryKey: ["produtosDoUsuario", user_id],
        queryFn: async () => {
            const res = await findAllProductsByUser(user_id)
            return res.success ? res.response : []
        }
    }) as { data: (Product & { images: ProductImage[], quantity: number })[] | undefined }

    const { data: categorias } = useQuery({
        queryKey: ["categorias"],
        queryFn: async () => {
            const res = await findAllCategories()
            return res.success ? res.response : []
        }
    })

    const { data: orders } = useQuery({
        queryKey: ["orders", user_id],
        queryFn: async () => {
            const res = await findAllOrdersByUser(user_id)
            return res.success ? res.response : []
        }
    })

    const { mutate: criarProduto } = useMutation({
        mutationFn: async (formData: FormData) => {
            return createOneProduct(formData)
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["produtosDoUsuario"]
            })
        }
    })

    const { mutate: criarCategoria } = useMutation({
        mutationFn: async (formData: FormData) => {
            return createOneCategory(formData)
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["categorias"]
            })
        }
    })

    const { mutate: adicionarImagemProduto } = useMutation({
        mutationFn: async (formData: FormData) => {
            const productId = parseInt(formData.get("productId") as string);
            const imageUrl = formData.get("imageUrl") as string;
            return addProductImage(productId, imageUrl);
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["produtosDoUsuario"]
            });
        }
    });

    const { mutate: deletarProduto } = useMutation({
        mutationFn: async (productId: number) => {
            return deleteProduct(productId)
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["produtosDoUsuario"]
            })
        }
    })

    const { mutate: deletarImagemProduto } = useMutation({
        mutationFn: async (imageId: number) => {
            return deleteProductImage(imageId)
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["produtosDoUsuario"]
            })
        }
    })

    const { mutate: deletarCategoria } = useMutation({
        mutationFn: async (categoryId: number) => {
            return deleteCategory(categoryId)
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["categorias"]
            })
        }
    })

    const { mutate: atualizarProduto } = useMutation({
        mutationFn: async ({ productId, formData }: { productId: number, formData: FormData }) => {
            return updateProduct(productId, formData)
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["produtosDoUsuario"]
            })
        }
    })

    const { mutate: atualizarImagemProduto } = useMutation({
        mutationFn: async ({ imageId, imageUrl }: { imageId: number, imageUrl: string }) => {
            return updateProductImage(imageId, imageUrl)
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["produtosDoUsuario"]
            })
        }
    })

    const { mutate: atualizarCategoria } = useMutation({
        mutationFn: async ({ categoryId, formData }: { categoryId: number, formData: FormData }) => {
            return updateCategory(categoryId, formData)
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["categorias"]
            })
        }
    })

    const { mutate: confirmarCompra } = useMutation({
        mutationFn: async (orderId: number) => {
            return updateOrderStatus(orderId, "CONFIRMED")
        },
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["orders", user_id]
            })
        }
    })

    const handleSubmit = (mutateFn: (formData: FormData) => void) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setLoading(true);
        try {
            await mutateFn(formData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="tabs flex gap-4 mb-4">
                    <button onClick={() => setActiveTab("products")} className={`px-4 py-2 ${activeTab === "products" ? "bg-gray-700 text-white" : "bg-gray-300"}`}>Produtos</button>
                    <button onClick={() => setActiveTab("categories")} className={`px-4 py-2 ${activeTab === "categories" ? "bg-gray-700 text-white" : "bg-gray-300"}`}>Categorias</button>
                    <button onClick={() => setActiveTab("images")} className={`px-4 py-2 ${activeTab === "images" ? "bg-gray-700 text-white" : "bg-gray-300"}`}>Imagens de Produtos</button>
                    <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 ${activeTab === "orders" ? "bg-gray-700 text-white" : "bg-gray-300"}`}>Pedidos</button>
                </div>
                {loading && <div className="loading-spinner">Carregando...</div>}
                {activeTab === "products" && (
                    <div className="products-section">
                        <div className="form-section border p-4 mb-4">
                            <h2 className="text-xl font-semibold mb-4">Criar Produto</h2>
                            <form onSubmit={handleSubmit(criarProduto)} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="name" className="font-bold">Nome:</label>
                                    <input type="text" id="name" name="name" required className="border p-1 w-full" />
                                </div>
                                <div>
                                    <label htmlFor="description" className="font-bold">Descrição:</label>
                                    <input type="text" id="description" name="description" className="border p-1 w-full" />
                                </div>
                                <div>
                                    <label htmlFor="productImg" className="font-bold">URL da Imagem do Produto:</label>
                                    <input type="text" id="productImg" name="productImg" required className="border p-1 w-full" />
                                </div>
                                <div>
                                    <label htmlFor="price" className="font-bold">Preço:</label>
                                    <input type="number" id="price" name="price" step="0.01" required className="border p-1 w-full" />
                                </div>
                                <div>
                                    <label htmlFor="quantity" className="font-bold">Quantidade:</label>
                                    <input type="number" id="quantity" name="quantity" required className="border p-1 w-full" />
                                </div>
                                <div>
                                    <label htmlFor="categoryId" className="font-bold">Categoria:</label>
                                    <select id="categoryId" name="categoryId" required className="border p-1 w-full">
                                        {categorias?.length ? categorias.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        )) : <option disabled>Sem categorias disponíveis</option>}
                                    </select>
                                </div>
                                <input type="hidden" id="userId" name="userId" value={user_id} />
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 whitespace-nowrap">Criar Produto</button>
                            </form>
                        </div>
                        <h2 className="text-xl font-semibold mb-4">Produtos do usuário</h2>
                        {produtos?.length ? produtos.map(prod => (
                            <div key={prod.id} className="product-card border p-4 mb-4 grid grid-cols-2 gap-4">
                                <div className="product-info flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold">{prod.name}</h3>
                                        <p>{prod.description}</p>
                                        <p>Preço: R${prod.price.toFixed(2)}</p>
                                        <p>Quantidade: {prod.quantity}</p>
                                    </div>
                                    <div className="buttons flex gap-2">
                                        <button className="bg-blue-500 text-white px-4 py-2 whitespace-nowrap" onClick={() => {/* handle edit */ }}>Editar</button>
                                        <button className="bg-red-500 text-white px-4 py-2 whitespace-nowrap" onClick={() => deletarProduto(prod.id)}>Excluir</button>
                                    </div>
                                </div>
                                <div className="product-images flex flex-wrap gap-2">
                                    {prod.images?.length ? prod.images.map(img => (
                                        <div key={img.id} className="product-image flex flex-col items-center">
                                            <img src={img.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                                            <button className="mt-2 bg-red-500 text-white px-4 py-2 whitespace-nowrap" onClick={() => deletarImagemProduto(img.id)}>Excluir Imagem</button>
                                            <form className="mt-2 w-full flex items-center gap-2" onSubmit={(e) => {
                                                e.preventDefault()
                                                const formData = new FormData(e.target as HTMLFormElement)
                                                atualizarImagemProduto({ imageId: img.id, imageUrl: formData.get("imageUrl") as string })
                                            }}>
                                                <input type="text" name="imageUrl" defaultValue={img.imageUrl} required className="border p-1 w-full" />
                                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 whitespace-nowrap">Atualizar Imagem</button>
                                            </form>
                                        </div>
                                    )) : <p>Sem imagens disponíveis</p>}
                                </div>
                            </div>
                        )) : <p>Nenhum produto cadastrado</p>}
                    </div>
                )}
                {activeTab === "categories" && (
                    <div className="categories-section">
                        <div className="form-section border p-4 mb-4">
                            <h2 className="text-xl font-semibold mb-4">Criar Categoria</h2>
                            <form onSubmit={handleSubmit(criarCategoria)} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="categoryName" className="font-bold">Nome da Categoria:</label>
                                    <input type="text" id="categoryName" name="name" required className="border p-1 w-full" />
                                </div>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 whitespace-nowrap">Criar Categoria</button>
                            </form>
                        </div>
                        <h2 className="text-xl font-semibold mb-4">Categorias</h2>
                        {categorias?.length ? categorias.map(cat => (
                            <div key={cat.id} className="category-card border p-4 mb-4">
                                <p>{cat.id} - {cat.name}</p>
                                <button className="bg-red-500 text-white px-4 py-2 mt-2 whitespace-nowrap" onClick={() => deletarCategoria(cat.id)}>Excluir Categoria</button>
                                <form className="mt-2 w-full flex items-center gap-2" onSubmit={(e) => {
                                    e.preventDefault()
                                    const formData = new FormData(e.target as HTMLFormElement)
                                    atualizarCategoria({ categoryId: cat.id, formData })
                                }}>
                                    <input type="text" name="name" defaultValue={cat.name} required className="border p-1 w-full" />
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 whitespace-nowrap">Atualizar Categoria</button>
                                </form>
                            </div>
                        )) : <p>Nenhuma categoria cadastrada</p>}
                    </div>
                )}
                {activeTab === "images" && (
                    <div className="form-section border p-4 mb-4">
                        <h2 className="text-xl font-semibold mb-4">Adicionar Imagem do Produto</h2>
                        <form onSubmit={handleSubmit(adicionarImagemProduto)} className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="productId" className="font-bold">Produto:</label>
                                <select id="productId" name="productId" required className="border p-1 w-full">
                                    {produtos?.length ? produtos.map(prod => (
                                        <option key={prod.id} value={prod.id}>{prod.name}</option>
                                    )) : <option disabled>Sem produtos disponíveis</option>}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="imageUrl" className="font-bold">URL da Imagem:</label>
                                <input type="text" id="imageUrl" name="imageUrl" required className="border p-1 w-full" />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 whitespace-nowrap">Adicionar Imagem do Produto</button>
                        </form>
                    </div>
                )}
                {activeTab === "orders" && (
                    <div className="orders-section">
                        <h2 className="text-xl font-semibold mb-4">Pedidos</h2>
                        {orders?.length ? orders.map(order => (
                            <div key={order.id} className="order-card border p-4 mb-4">
                                <p><strong>Comprador:</strong> {order.user.username}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Total:</strong> R${order.total.toFixed(2)}</p>
                                <p><strong>Custo de Frete:</strong> R${order.shippingCost.toFixed(2)}</p>
                                <p><strong>Endereço de Entrega:</strong> {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}</p>
                                <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                <div className="order-items mt-2">
                                    <h3 className="font-semibold">Itens:</h3>
                                    {order.items.map(item => (
                                        <div key={item.id} className="order-item flex justify-between">
                                            <span>{item.product.name} (x{item.quantity})</span>
                                            <span>R${item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                {order.status === "PENDING" && (
                                    <button className="bg-green-500 text-white px-4 py-2 mt-2" onClick={() => confirmarCompra(order.id)}>Confirmar Compra</button>
                                )}
                            </div>
                        )) : <p>Nenhum pedido encontrado</p>}
                    </div>
                )}
            </div>
        </>
    )
}