import data  from '../utils/data'
import Layout from '../components/Layout'
import ProductItem from '../components/ProductItem'

export default function Home() {
  const product = data
  console.log(product)
  return (
    <Layout title="Home Page">
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4'>
      {data.products.map((product) => (
          <ProductItem product={product} key={product.id}></ProductItem>
        ))}
      </div>
    </Layout>
  )
}
