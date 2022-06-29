import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/store';


export default function PlaceOrderScreen() {
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { cartItems, shippingAddress, paymentMethod } = cart;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

    const itemsPrice = round2(
        cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    ); // 123.4567 => 123.46

    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    const router = useRouter();
    useEffect(() => {
        if (!paymentMethod) {
            router.push('/payment');
        }
    }, [paymentMethod, router]);

    const [loading, setLoading] = useState(false);

    const placeOrderHandler = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            });
            setLoading(false);
            dispatch({ type: 'CART_CLEAR_ITEMS' });
            Cookies.set(
                'cart',
                JSON.stringify({
                    ...cart,
                    cartItems: [],
                })
            );
            router.push(`/order/${data._id}`);
        } catch (err) {
            setLoading(false);
            toast.error(getError(err));
        }
    };

    return (
        <Layout title="Place Order">
            <CheckoutWizard activeStep={2} />
            {cartItems.length === 0 ? (
                <div>
                    Cart is empty. <Link href="/">Go shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-5">
                    <div className="overflow-x-auto">
                        <div className="p-5 shadow-md border">
                            <h2 className="mb-2 text-lg font-bold">Shipping Address</h2>
                            <div>
                                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                                {shippingAddress.country}
                            </div>
                            <div className="mt-2 font-bold">
                                <Link href="/shipping">Edit</Link>
                            </div>
                        </div>
                        <div className="p-5 shadow-md border mt-12">
                            <h2 className="mb-2 text-lg font-bold">Payment Method</h2>
                            <div>{paymentMethod}</div>
                            <div className="mt-2 font-bold">
                                <Link href="/payment">Edit</Link>
                            </div>
                        </div>
                    </div>
                    <div className="px-12 py-5 shadow-md border">
                        <div className="overflow-x-auto">
                            <div className='flex justify-between'>
                                <h2 className="mb-2 text-lg font-bold">Order Items</h2>
                                <div className='font-bold mt-2 text-lg'>
                                    <Link href="/cart">Edit</Link>
                                </div>
                            </div>
                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="py-5 text-left">Item</th>
                                        <th className="py-5 text-right">Quantity</th>
                                        <th className="py-5 text-right">Price</th>
                                        <th className="py-5 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item._id} className="border-b">
                                            <td>
                                                <Link href={`/product/${item.slug}`}>
                                                    <a className="flex items-center">
                                                        <img
                                                            src={item.img}
                                                            alt={item.name}
                                                            className='h-16 w-16 my-2 mr-2'
                                                        />
                                                        &nbsp;
                                                        {item.name}
                                                    </a>
                                                </Link>
                                            </td>
                                            <td className=" p-5 text-right">{item.quantity}</td>
                                            <td className="p-5 text-right">${item.price}</td>
                                            <td className="p-5 text-right">
                                                ${item.quantity * item.price}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-5">
                            <h2 className="mb-2 text-lg font-bold">Order Summary</h2>
                            <ul>
                                <li>
                                    <div className="mb-2 flex justify-between font-semibold">
                                        <div>Items</div>
                                        <div>${itemsPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between font-semibold">
                                        <div>Tax</div>
                                        <div>${taxPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between font-semibold">
                                        <div>Shipping</div>
                                        <div>${shippingPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between font-semibold">
                                        <div>Total</div>
                                        <div>${totalPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <button
                                        disabled={loading}
                                        onClick={placeOrderHandler}
                                        className="bg-teal-500 py-2.5 my-4 text-white font-bold w-full"
                                    >
                                        {loading ? 'Loading...' : 'Place Order'}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

PlaceOrderScreen.auth = true;