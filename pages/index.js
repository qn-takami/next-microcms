import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { client } from '@/libs/client'
import { useRouter } from "next/router";

export default function Home({ blog }) {
  const router = useRouter();
  async function deleteItem(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = formData.get('id');
    client.delete({
      endpoint: 'blogs',
      contentId: id,
    })
      .then((res) => {
        alert("正常に削除されました。")
        router.push(`/`)
      })
      .catch((err) => {
        alert("削除できませんでした。"+err)
      })
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div id="new-blog">
          <Link href="/blog/create" className="">
            <button className="">ブログを作成</button>
          </Link>
        </div>
        <div id="blog-list">
          {blog.map((blog) => (
            <div className={styles.div}>
              <ul className={styles.ul}>
                <li className={styles.li} key={blog.id}>
                  <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
                  <Link href={`/blog/${blog.id}/update`} className="">
                    <button className="">編集</button>
                  </Link>
                  <form onSubmit={ deleteItem }>
                    <input type="hidden" name="id" value={blog.id} />
                    <input type="submit" value="削除" />
                  </form>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps = async () => {

  const data = await client.get({
    endpoint: 'blogs',
  })

  return {
    props: {
      blog: data.contents,
    },
    revalidate: 1,
  }
}
