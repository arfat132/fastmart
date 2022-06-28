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
      <div className="pb-2">
        <Link href="/">back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <img
            src={product.img}
            alt={product.name}
            className="rounded shadow w-80"
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.seller}</li>
            <li>
              {product.ratings} of {product.ratingsCount} reviews
            </li>
            <li>${product.price}</li>
            <li className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.stock > 0 ? 'In stock' : 'Unavailable'}</div>
            </li>
            <li>Description: {product.description}</li>
            <button className="primary-button w-full">Add to cart</button>
          </ul>
        </div>
        <div>
        </div>
      </div>
    </Layout>
  );
}