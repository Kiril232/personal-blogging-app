import { db, storage } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header.js";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMemo } from "react";
import { addDoc, updateDoc, doc, getCountFromServer } from "firebase/firestore";
import {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import ImageResize from "quill-image-resize";
import VideoResize from "quill-video-resize-module";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/videoResize", VideoResize);

export default function EditPost({ user, isAdmin }) {
  const [post, setPost] = useState({});
  let { slug } = useParams();
  const navigate = useNavigate();
  const [imageInProgress, setImageInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [coverURL, setCoverURL] = useState("");
  const [postId, setPostId] = useState("");
  const coverImg = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "posts"), where("slug", "==", slug));
      const doc = await getDocs(q);
      setPost(doc.docs[0].data());
      setPostId(doc.docs[0].id);
      setCoverURL(doc.docs[0].data().coverImage);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverImg.current) {
      updateDoc(doc(db, "posts", postId), {
        category: post.category,
        content: post.content,
        slug: post.slug,
        title: post.title,
      }).then(() => {
        navigate("/post/" + post.slug);
      });
      return;
    }

    const oldCoverURL = post.coverImage
      .substring(77, post.coverImage.indexOf("?", 77))
      .replace(/%20/g, " ");
    const oldCoverRef = ref(storage, oldCoverURL);
    deleteObject(oldCoverRef).catch((err) => {
      console.error(err);
    });

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
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        // setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      // Handle unsuccessful uploads
      (error) => {
        console.log(error);
      },
      //handle successful finish
      () => {
        getDownloadURL(imageRef).then((url) => {
          updateDoc(doc(db, "posts", postId), {
            category: post.category,
            coverImage: url,
            content: post.content,
            slug: post.slug,
            title: post.title,
          }).then(() => {
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
    "width",
    "video",
    "align",
    "code-block",
  ];

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
      .replace(/\s/g, "-");
  }

  if (!isAdmin) {
    return <h2>This page is for admins only!</h2>;
  } else {
    return (
      <div>
        <Header user={user} isAdmin={isAdmin} />
        <div className="create-post-container">
          <h1>Edit Post </h1>
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
                value={post.title}
              />
              <p>{post.slug}</p>
              <h2>Category:</h2>
              <input
                value={post.category}
                onChange={(e) => {
                  setPost({ ...post, category: e.target.value });
                }}
                className="formInput"
                type="text"
                placeholder="Enter category..."
              />
              <h2>Cover image:</h2>
              <input onInput={handleCoverInput} type="file" />
              <img src={coverURL} width="200" height="200" alt="cover" />
            </div>
            <hr />
            {imageInProgress && <ProgressBar progress={progress} />}
            <ReactQuill
              ref={quillRef}
              value={post.content}
              formats={formats}
              modules={modules}
              theme="snow"
              onChange={(HTMLcontent) => {
                if (post.content) {
                  setPost({ ...post, content: HTMLcontent });
                }
              }}
              placeholder="Enter blog content here..."
            />
            <button className="submit-button" type="submit">
              Submit
            </button>
          </form>
          <hr />
          <div
            className="ql-editor ql-container"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    );
  }
}
