import axios from 'axios';
import Link from 'next/link';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/store';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store)


  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCart = async() => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.stock < quantity) {
      alert("Product is out of stock")
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  }

  return (
    <Layout title={product.name}>
      <div className="pb-12">
        <Link href="/">back to products</Link>
      </div>
      <div className="grid md:grid-cols-2 px-12">
        <div className="">
          <img
            src={product.img}
            alt={product.name}
            className="rounded shadow w-[600px] h-[500px]"
          />
        </div>
        <div className='relative mr-12'>
          <ul>
            <li>
              <h1 className="text-xl font-bold mb-2">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.seller}</li>
            <li className="mb-2 flex justify-between">
              <div className='text-2xl font-bold mt-2'>{product.ratings}</div>
              <div>{product.ratingsCount} reviews</div>
            </li>
            <li className="mb-6 flex justify-between">
              <div>Status</div>
              <div>{product.stock > 0 ? 'In stock' : 'Unavailable'}</div>
            </li>
            <li className='text-2xl font-bold mb-6'>${product.price}</li>
            <li>Description: {product.description}</li>
            <button onClick={addToCart} className="w-full bottom-0 absolute bg-teal-600 py-2 text-white">Add to cart</button>
          </ul>
        </div>
        <div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}