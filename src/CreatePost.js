import Header from "./Header.js";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useMemo, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  getCountFromServer,
  where,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase.js";
import ImageResize from "quill-image-resize";
import VideoResize from "quill-video-resize-module";
import { useNavigate } from "react-router-dom";
import { sendEmail } from "./emailjs.js";
import ProgressBar from "./ProgressBar";
import "./CreatePost.css";

Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/videoResize", VideoResize);

export default function CreatePost({ user, isAdmin }) {
  const [post, setPost] = useState({
    title: "",
    content: "",
    category: "",
    date: new Date().toLocaleDateString(),
    slug: "",
    likes: 0,
    comments: 0,
  });
  const navigate = useNavigate();
  const docRef = collection(db, "posts");
  const [imageInProgress, setImageInProgress] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [coverURL, setCoverURL] = useState("");

  const coverImg = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverImg) {
      return;
    }
    const q = query(
      collection(db, "categories"),
      where("category", "==", post.category)
    );
    const categorySnapshot = await getCountFromServer(q);
    if (categorySnapshot.data().count === 0) {
      addDoc(collection(db, "categories"), {
        category: post.category,
      });
    }
    const imageRef = ref(storage, coverImg.current.name + new Date().getTime());
    const uploadTask = uploadBytesResumable(imageRef, coverImg.current);
    setSubmitInProgress(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      // Handle unsuccessful uploads
      (error) => {
        console.log(error);
      },
      //handle successful finish
      () => {
        getDownloadURL(imageRef).then((url) => {
          setSubmitInProgress(false);
          setProgress(0);
          addDoc(docRef, { ...post, coverImage: url }).then(() => {
            sendEmail({ ...post, coverImage: url });
            navigate("/post/" + post.slug);
          });
        });
      }
    );
  };

  const uploadToStorage = (image) => {
    setImageInProgress(true);
    const imageRef = ref(storage, image.name + new Date().getTime());
    // let imageURL = null;
    const uploadTask = uploadBytesResumable(imageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      // Handle unsuccessful uploads
      (error) => {
        console.log(error);
      },
      //handle successful finish
      () => {
        getDownloadURL(imageRef).then((url) => {
          let selection = quillRef.current.getEditor().getSelection();
          quillRef.current
            .getEditor()
            .insertEmbed(selection.index, "image", url);
          setImageInProgress(false);
          setProgress(0);
        });
      }
    );
  };

  const handleImage = () => {
    const imageInput = document.createElement("input");
    imageInput.setAttribute("type", "file");
    imageInput.setAttribute(
      "accept",
      "image/png, image/gif, image/jpeg, image/bmp"
    );
    imageInput.click();
    imageInput.oninput = () => {
      const image = imageInput.files[0];
      uploadToStorage(image);
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ align: [] }],
          ["code-block"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video"],
          ["clean"],
        ],

        handlers: {
          image: handleImage,
        },
      },
      imageResize: {},
      videoResize: {},
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "code-block",
  ];

  const quillRef = useRef(null);

  function handleCoverInput(e) {
    const image = e.target.files && e.target.files[0];
    if (image) {
      coverImg.current = image;
    }
    if (coverURL.length !== 0) {
      URL.revokeObjectURL(coverURL);
    }
    if (coverImg.current) {
      setCoverURL(URL.createObjectURL(image));
    }
  }

  function kebab(str) {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  }

  if (!isAdmin) {
    return <h2>This page is for admins only!</h2>;
  } else {
    return (
      <div>
        <Header user={user} isAdmin={isAdmin} currPage={"write"} />
        <div className="create-post-container">
          <h1>Create Post</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-container">
              <h2>Title:</h2>
              <input
                onChange={(e) => {
                  setPost({
                    ...post,
                    title: e.target.value,
                    slug: kebab(e.target.value),
                  });
                }}
                className="formInput"
                type="text"
                placeholder="Enter title..."
              />
              <p>{post.slug}</p>
              <h2>Category:</h2>
              <input
                onChange={(e) => {
                  setPost({ ...post, category: e.target.value });
                }}
                className="formInput"
                type="text"
                placeholder="Enter category..."
              />
              <h2>Cover image:</h2>
              <input required onInput={handleCoverInput} type="file" />
              <img src={coverURL} className="cover-preview" alt="cover" />
            </div>
            <hr />
            {imageInProgress && <ProgressBar progress={progress} />}
            <ReactQuill
              ref={quillRef}
              formats={formats}
              modules={modules}
              theme="snow"
              value={post.content}
              onChange={(HTMLcontent) => {
                setPost({ ...post, content: HTMLcontent });
              }}
              placeholder="Enter blog content here..."
              className="editor"
            />
            <button className="submit-button" type="submit">
              Submit
            </button>
            {submitInProgress && <ProgressBar progress={progress} />}
          </form>
          <hr />
          <div
            className="ql-editor ql-container editor-view"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    );
  }
}
