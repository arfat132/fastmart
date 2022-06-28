import Link from 'next/link';
import React, { useContext } from 'react';
import { TrashIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { Store } from '../utils/store';
import Layout from '../components/Layout';
import dynamic from 'next/dynamic';

function CartScreen() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const {
        cart: { cartItems },
    } = state;

    const deleteItem = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    const updateCartQuantity = (item, qty) => {
        const quantity = Number(qty);
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    };

    return (
        <Layout title="Shopping Cart">
            <h1 className="mb-4 text-xl font-bold">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div>
                    Cart is empty. <Link href="/">Continue shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <table className="min-w-full ">
                            <thead className="border-b bg-teal-500 text-white">
                                <tr>
                                    <th className="p-3 text-left">Item</th>
                                    <th className="p-3 text-right">Quantity</th>
                                    <th className="p-3 text-right">Price</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td>
                                            <Link href={`/product/${item.slug}`}>
                                                <a className="flex items-center py-2 font-bold">
                                                    <img
                                                        src={item.img}
                                                        alt={item.name}
                                                        className="w-24 h-24 mr-3"
                                                    />
                                                    &nbsp;
                                                    {item.name}
                                                </a>
                                            </Link>
                                        </td>
                                        <td className="p-3 text-center font-bold">
                                            <select
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateCartQuantity(item, e.target.value)
                                                }
                                            >
                                                {[...Array(item.stock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-3 text-right font-bold">${item.price}</td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => deleteItem(item)}>
                                                <TrashIcon className="h-5 w-5"></TrashIcon>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card">
                        <ul>
                            <li>
                                <div className="flex justify-between py-3 px-8 mb-3 text-xl font-bold border border-gray-300 shadow">
                                    <p >Quantity</p>
                                    <p>{cartItems.reduce((a, c) => a + c.quantity, 0)}</p>
                                </div>
                            </li>
                            <li>
                                <div className="flex justify-between mb-6 py-3 px-8 text-xl font-bold border border-gray-300 shadow">
                                    <p>Subtotal</p>
                                    <p>$ {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}</p>
                                </div>
                            </li>
                            <li>
                                <button
                                    onClick={() => router.push('/shipping')}
                                    className="w-full bg-teal-500 text-white py-3 font-bold"
                                >
                                    Check Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });