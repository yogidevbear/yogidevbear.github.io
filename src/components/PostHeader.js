import React from 'react'

export function PostHeader(props) {
  return (
    <div>
      <img src={"/img/" + props.headerImageUrl} alt={"Photo by " + props.attributionName} />
      {/* <div class="postHeader" style={{backgroundImage:"url(/img/" + props.headerImageUrl + ")"}}></div> */}
      <div class="attributionDetails">
        Photo by <a href={props.attributionUrl}>{props.attributionName}</a>
      </div>
    </div>
  )
}