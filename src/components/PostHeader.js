import React from 'react'

export function PostHeader(props) {
  return (
    <div>
      <div class="postHeader" style={{backgroundImage:"url(/img/" + props.headerImageUrl + ")"}}>
        <h1>{props.title}</h1>
      </div>
      <div class="photoAttribution">Header photo by <a href={props.attributionUrl}>{props.attributionName}</a></div>
    </div>
  )
}