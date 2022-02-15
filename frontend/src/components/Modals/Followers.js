import { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import "../../styles/Modal.css"
import {useStore} from 'react-redux'
import axiosInstance from "CustomAxios";
const Followers = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header } = props;

  const memberNum = useParams();
  const memberId = memberNum.userid
  const FOLLOWERS_URL = process.env.REACT_APP_SERVER + `:8888/v1/member/${memberId}/followers`
  
  const store = useStore((state) => state)
  const [followers, setFollowers] = useState();
  const fetchData = async () =>{
    const res = await axiosInstance.get(FOLLOWERS_URL)
    setFollowers(res.data.data)
  }

  useEffect(()=>{
    if (store.getState().followersReducer.length === 0) {
      fetchData()
    } else {
      setFollowers(store.getState().followersReducer)
    }
    
  }, [])
  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              {' '}
              &times;{' '}
            </button>
          </header>
          <main>
          {followers.length === 0 ? <p>아직 팔로워가 없습니다.</p>: followers.map((person, idx)=>
          //{memberId, nickName, name, comment, age, grade}
          <div key={idx}>{person.nickName}
          <Link to={`/profile/${person.memberId}/post`}><Button> 프로필 페이지로 이동</Button></Link>
          
          </div>
          )}
          </main>
          
          
          <footer>
            <button className="close" onClick={close}>
              {' '}
              close{' '}
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};
export default Followers;
