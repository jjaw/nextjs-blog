import utilStyles from '../../styles/utils.module.css';
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import Date from '../../components/date';

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  // getStaticProps is given 'params', which contains 'id' (because the file name is '[id].js')
  // Add the 'await' keyword because getPostData() is 'async'
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  // Returns a list of possible value for id
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  return ( 
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        {/* 
          dangerouslySetInnerHTML is React's replacement for using innerHTML to set HTML 
          To USE: type out dangerouslySetInnerHTML and pass an object with a __html key.
          example below
        */}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}