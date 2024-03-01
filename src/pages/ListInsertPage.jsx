import React, { useEffect, useRef, useState } from 'react'
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from '../firebase';
import uuid from 'react-uuid';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

const ListInsertPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const itemId = useLocation();
  const fileInput = useRef(null);
  let imageUrl = null;

  const getItem = async () => {
    const docRef = doc(db, 'items', itemId.state.id);
    const item = (await getDoc(docRef)).data();
    console.log(item);

    if (params.itemId === '2') {
      console.log('여기로오면 수정하기임')
      setTitle(item.title);
      setContent(item.content);
      setFile(item.imageUrl);
    } else {
      console.log('여기로오면 글쓰기임')
      return null;
    }
  }

  const handleClick = (e) => {
    fileInput.current.click();
  }

  const fileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    // Blob 객체인지 확인
    if (!(file instanceof Blob)) {
      console.error("파일이 유효하지 않습니다.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
      reader.onload = () => {
        setFile(reader.result);
        resolve();
      }
    })
  }

  const onClearAttachment = (e) => {
    setFile(null);
  };

  useEffect(() => {
    if (params.itemId === '2') {
      getItem();
    }
  }, [])


  const itemInsert = async () => {
    const id = uuid().replace(/-/g, '').substring(0, 8);

    if (title === '' || content === '') {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    if (file) {
      const storageRef = ref(storage, `images/${id}`);
      await uploadString(storageRef, file, 'data_url')
      imageUrl = await getDownloadURL(ref(storage, `images/${id}`));

    }
    await setDoc(doc(collection(db, "items"), id), {
      id: id,
      title: title,
      content: content,
      imageUrl: imageUrl,
      date: new Date(),
    })
    navigate('/');
    console.log('보내짐');
  }

  const itemUpdate = async () => {
    try {
      if (title === '' || content === '') {
        alert('제목과 내용을 입력해주세요.')
        return
      }
      console.log('이건 아이디임', itemId.state.id)
      if (!itemId.state.id) return;

      if (file) {
        const storageRef = ref(storage, `images/${itemId.state.id}`);
        await uploadString(storageRef, file, 'data_url')
        imageUrl = await getDownloadURL(ref(storage, `images/${itemId.state.id}`));
      }

      await updateDoc(doc(db, 'items', itemId.state.id), {
        title: title,
        content: content,
        imageUrl: imageUrl,

      });
      navigate('/');
      console.log('보내짐');
    } catch (error) {
      console.log('error', error);
    }

  }
  console.log('이건 이미지 파일 입니다.', file);
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ display: 'inline-block', marginTop: '10px' }}>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: 'block', paddingLeft: '10px', borderRadius: '10px', height: '30px' }}
          placeholder='제목을 입력해주세요.'
        />
        <textarea
          type='text'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: 'block', paddingLeft: '10px', marginTop: '10px', height: '100px', borderRadius: '10px' }}
          placeholder='내용을 입력해주세요.'
        />
      </div>
      <br />
      {file && <img onClick={onClearAttachment} style={{ width: '100px', cursor: 'pointer' }} src={file} alt='이미지' />}
      <button onClick={handleClick}>업로드</button>
      <input ref={fileInput} style={{ display: 'none' }} type='file' onChange={fileUpload} />
      <button onClick={params.itemId === '2' ? itemUpdate : itemInsert} style={{ borderRadius: '10px', width: '70px', height: '30px' }}>글쓰기</button>

    </div>
  )
}

export default ListInsertPage