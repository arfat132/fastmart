/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            state;
    }
}
function OrderScreen() {
    // order/:id
    const { query } = useRouter();
    const orderId = query.id;

    const [{ loading, error, order }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
    });
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        if (!order._id || (order._id && order._id !== orderId)) {
            fetchOrder();
        }
    }, [order, orderId]);
    const {
        shippingAddress,
        paymentMethod,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
    } = order;

    return (
        <Layout title={`Order ${orderId}`}>
            <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">{error}</div>
            ) : (
                <div className="grid md:grid-cols-2 md:gap-12">
                    <div className="overflow-x-auto">
                        <div className="p-5 shadow-md border mb-12">
                            <h2 className="mb-2 text-lg font-bold">Shipping Address</h2>
                            <div>
                                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                                {shippingAddress.country}
                            </div>
                            {isDelivered ? (
                                <div className="my-3 rounded-lg bg-green-100 p-3 text-green-700">Delivered at {deliveredAt}</div>
                            ) : (
                                <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">Not delivered</div>
                            )}
                        </div>

                        <div className="p-5 shadow-md border">
                            <h2 className="mb-2 text-lg font-bold">Payment Method</h2>
                            <div>{paymentMethod}</div>
                            {isPaid ? (
                                <div className="my-3 rounded-lg bg-green-100 p-3 text-green-700">Paid at {paidAt}</div>
                            ) : (
                                <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">Not paid</div>
                            )}
                        </div>
                    </div>
                    <div className='py-5 shadow-md border'>
                        <div className="overflow-x-auto p-5">
                            <h2 className="mb-2 text-lg font-bold">Order Items</h2>
                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">Item</th>
                                        <th className=" p-5 text-right">Quantity</th>
                                        <th className="p-5 text-right">Price</th>
                                        <th className="p-5 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.map((item) => (
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
                        <div className="card p-5">
                            <h2 className="mb-2 text-lg font-bold">Order Summary</h2>
                            <ul>
                                <li>
                                    <div className="mb-2 flex justify-between font-semibold">
                                        <div>Items</div>
                                        <div>${itemsPrice}</div>
                                    </div>
                                </li>{' '}
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
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

OrderScreen.auth = true;
export default OrderScreen;