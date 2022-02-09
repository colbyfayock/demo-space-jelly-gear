import Head from 'next/head'
import Link from 'next/link'
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

import { buildUrlByPublicId } from '@lib/cloudinary';

import Layout from '@components/Layout';
import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Page.module.scss'

export default function Category({ category }) {
  const { products } = category;
  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Container>
        <h1>{ category.name }</h1>

        <h2>Products</h2>

        <ul className={styles.products}>
          {products.map(product => {
            const { image } = product;
            return (
              <li key={product.id}>
                <Link href={`/products/${product.slug}`}>
                  <a>
                    <div className={styles.productImage}>
                      <img width={image.width} height={image.height} src={buildUrlByPublicId(image.public_id, {
                          transformations: {
                            width: 500, height: 500
                          }
                        })} alt="" />
                    </div>
                    <h3 className={styles.productTitle}>
                      { product.name }
                    </h3>
                    <p className={styles.productPrice}>
                      ${ product.price }
                    </p>
                  </a>
                </Link>
                <p>
                  <Button
                    className="snipcart-add-item"
                    data-item-id={product.slug}
                    data-item-price={product.price}
                    data-item-url={`/products/${product.slug}`}
                    data-item-image={buildUrlByPublicId(image.public_id)}
                    data-item-name={product.name}
                  >
                    Add to Cart
                  </Button>
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const { categorySlug } = params;

  const client = new ApolloClient({
    uri: process.env.GRAPHCMS_ENDPOINT,
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query MyQuery($slug: String!) {
        category(where: {slug: $slug}) {
          id
          name
          localizations {
            name
            locale
          }
          locale
          products {
            name
            id
            image
            price
            slug
          }
        }
      }
    `,
    variables: {
      slug: categorySlug
    }
  });

  const { category } = data;

  return {
    props: {
      category
    }
  }
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: process.env.GRAPHCMS_ENDPOINT,
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query Categories {
        categories {
          id
          slug
        }
      }
    `
  });

  const { categories } = data;

  const paths = categories.map(({ slug }) => {
    return {
      params: {
        categorySlug: slug
      }
    };
  });

  return {
    paths: [
      ...paths,
      ...paths.map(path => ({
        ...path,
        locale: 'es'
      }))
    ],
    fallback: false
  }
}