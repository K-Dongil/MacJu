import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useStore } from 'react-redux';
// import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import "../../styles/CommentList.css"

function CommentList(props) {
  const [comments, setcomments] = useState([]);
  const [inputComment, inputCommentChange] = useState("");
  const [dispatchComment, setDispatchComment] = useState();
  const newCommentId = useRef("");
  
  const postId = props.postId;
  const nickname = "nickname";
  // http://13.125.157.39:8080/v1/post
  // const apiUrl = `http://i6c107.p.ssafy.io:8080/v1/post/${postId}/comment`
  const apiUrl = `http://13.125.157.39:8080/v1/post/${postId}/comment`

  // let state = useSelector((state)=>state)
  const store = useStore((state)=>state)
  let dispatch = useDispatch();

  const changeComment = (e) => {
    inputCommentChange(e.target.value);
  }

  const addComment = async (e) => {
    e.preventDefault()
    try{
      const postData = {
        "content": inputComment,
        "memberId": 1
      }
      const headers = {
        headers: {
          "Accept" : "application/json;charset=UTF-8",
          "Content-Type" : "application/json;charset=UTF-8"
        }
      }
      const addData = await axios.post(apiUrl, postData, headers)
      newCommentId.current = addData.data

      setDispatchComment({
        commentId: newCommentId,
        content: inputComment,
        member: {
          memberId: 1,
          // nickname: "nickname" (수정필요)
        }
      })

      dispatch({ type : "add", inputComment : dispatchComment })
      setcomments(store.getState().commentReducer)
    }
    catch{
      console.log("요류")
    }
  }

  const deleteComment = async (e) => {
    try{
      const commentId = e.target.attributes.commentid.value
      console.log(commentId)
      const arrayId = e.target.attributes.arrayKey.value
      const deleteApiUrl = `http://i6c107.p.ssafy.io:8080/v1/post/${postId}/comment/${commentId}`
      const deleteData = await axios.delete(deleteApiUrl)
      dispatch({ type : "delete", i : arrayId })
      setcomments(store.getState().commentReducer)
    }
    catch{
      alert("삭제 실패")
    }
    
  }
  

  useEffect(async ()=>{
    try{
      const responseData = await axios.get(apiUrl)
      dispatch({type:"dataLoading", responseData : responseData.data})
      setcomments(store.getState().commentReducer)
    }
    catch{
      alert("데이터 불러오기 실패")
    }
    }, []
  )

  return(
    
    <div className="CommentList">
      <section className="comment_section layout_padding_comment">
        <div className="container">

          <div className="row">
            <div className="col-md-12">
              <div className="comment-box">
                <div className="heading_container">
                  <h2>Comment</h2>
                </div>
                {/* 댓글 작성 폼 */}
                <form>
                  <input
                    type="text"
                    name="inputComment"
                    className="comment_input"
                    placeholder="댓글 입력..."
                    value={ inputComment }
                    onChange={ changeComment }
                    required
                  />
                  {/* 비어있을때 addComment 함수 작동 안되게해야함 */}
                  <button className="comment_button" onClick={ addComment }>Add</button>
                </form>

                {/* 댓글 목록 */}
                {
                  comments.map( (comment, i) => {
                    return(
                      <div className="commentList" key={i}>
                        <div> { comment.content } </div>
                        <button className="deletebtn" type="button" commentid={comment.commentId} arrayKey={i} onClick={ deleteComment }>삭제</button>
                      </div>
                    );
                  })
                }

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <form action="">
        <input
          type="text"
          name="inputComment"
          value={ inputComment }
          onChange={ changeComment }
        />
        <button type="button" onClick={ addComment }>Add</button>
      </form>

      {
        
        comments.map( (post, i) => {
          return(
            <div className="list" key={i}>
              <p> { post.comment } </p>
              <button type="button" commentId={i} onClick={ deleteComment }>삭제</button>
            </div>
          );
        })
      } */}

    </div>
  )
}

export default CommentList;
