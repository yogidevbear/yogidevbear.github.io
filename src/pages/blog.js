import React from 'react'
import { useRouteData } from 'react-static'
//
import { Link } from 'components/Router'

export default function Blog() {
  const { posts } = useRouteData()
  return (
    <div>
      <h1>Blog</h1>
      All Posts:
      <div class="cardsList">
        <div class="card" key="post_clojure-coding-dojo">
          <Link to={`/blog/post/clojure-coding-dojo/`}>
            <img src="/img/andrew-neel-explore-flag-unsplash-420x280.jpg" alt="Exlore flag" />
          </Link>
          <div class="cardDetails">
            <Link to={`/blog/post/clojure-coding-dojo/`} >Clojure Coding Dojo</Link>
            <p>Foo bar something bing bish bash bosh...</p>
          </div>
        </div>
        {/* {posts.map(post => (
          <li key={post.id}>
            <Link to={`/blog/post/${post.id}/`}>{post.title}</Link>
          </li>
        ))} */}
      </div>
      <a href="#top" id="bottom">Scroll to top</a>
    </div>
  )
}
