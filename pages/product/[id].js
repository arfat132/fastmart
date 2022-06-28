import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import data from '../../utils/data';

export default function ProductScreen() {
  const { query } = useRouter();
  const { id } = query;
  const product = data.products.find((x) => x.id === id);
  if (!product) {
    return <div>Produt Not Found</div>;
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
            <button className="w-full bottom-0 absolute bg-teal-600 py-2 text-white">Add to cart</button>
          </ul>
        </div>
        <div>
        </div>
      </div>
    </Layout>
  );
}