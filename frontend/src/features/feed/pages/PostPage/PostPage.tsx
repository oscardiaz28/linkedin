import { useParams } from 'react-router-dom'
import styles from './PostPage.module.scss'
import { useEffect, useState } from 'react';
import { Post } from '../../components/Post/Post';
import { request } from '../../../../utils/api';
import { LeftSidebar } from '../../components/LeftSidebar/LeftSidebar';
import { RightSidebar } from '../../components/RightSidebar/RightSidebar';

export const PostPage = () => {

  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState<string | null>(null)
  const {id} = useParams();

  useEffect(() => {
    request<Post>({
      endpoint: `/api/v1/feed/posts/${id}`,
      onSuccess: (data) => setPost(data),
      onFailure: (err) => {
        setError(err)
      }
    })
  }, [id])

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <LeftSidebar />
      </div>
      <div className={styles.center}>
        {post && <Post post={post} /> }
        {error && (
          <p>{error}</p>
        )}
      </div>
      <div className={styles.right}>
        <RightSidebar />
      </div>
    </div>
  )
}
