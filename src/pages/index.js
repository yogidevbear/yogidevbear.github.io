import React from 'react'
// import { Highlight } from 'react-highlight.js'
import Highlight from 'react-highlight'

export default () => (
  <div>
    <div id="welcome">
      <img src="https://en.gravatar.com/userimage/28779972/3e6a7d7b8c93e174be131d8c31d40cb0.jpg?size=150" alt="yogidevbear gravatar image" class="gravatar" />
      <h1>Welcome to my website</h1>
      <span>I'm a software engineer with more than a decade of experience in various industries and technologies. I enjoy working across the stack, but my primary focus area is probably server side coding and working with databases. I am very greatful to be working as a software engineer as there is always something new to learn each day. Check me out on various other platforms listed in my footer below.</span>
    </div>
    <div class="unsplash">
      Photo credit<br/>
      <a style={{backgroundColor:'black',color:'white',textDecoration:'none',padding:'4px 6px',fontFamily:'-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif',fontSize:'12px',fontWeight:'bold',lineHeight:'1.2',display:'inline-block',borderRadius:'3px'}} href="https://unsplash.com/@ryan_hutton_?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Ryan Hutton">
        <span style={{display: 'inline-block', padding: '2px 3px'}}><svg xmlns="http://www.w3.org/2000/svg" style={{height:'12px',width:'auto',position:'relative',verticalAlign:'middle',top:'-2px',fill:'white'}} viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span>
        <span style={{ display: 'inline-block', padding: '2px 3px' }}>Ryan Hutton</span>
      </a>
    </div>
  </div>
)