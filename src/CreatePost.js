import Header from './Header.js'
import ReactQuill, {Quill} from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useMemo, useRef } from "react";
import { collection, addDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase.js"
import  ImageResize   from "quill-image-resize";
import { useNavigate } from "react-router-dom";
window.Quill = ReactQuill;
Quill.register('modules/imageResize', ImageResize);
export default function CreatePost(){
    const [coverImg, setCoverImg] = useState(null);
    const [post, setPost] = useState({
        title: "",
        content: "",
        category: "",
        date: new Date().toLocaleDateString(),
        coverImage: ""

    });
    const navigate = useNavigate();
    const docRef = collection(db, "posts");
    const handleSubmit = async (e) => {
        //TODO: UPLOAD POST TO FIRESTORE
        e.preventDefault();
        console.log(post);
        const newDoc = await addDoc(docRef, post);
        navigate("/");
    }

    const  uploadToStorage =  (image) => {
        const imageRef = ref(storage, image.name + new Date().getTime());
        // let imageURL = null;
        uploadBytesResumable(imageRef, image).then(
            () => {
                getDownloadURL(imageRef).then(
                    (url) => {
                    let selection = quillRef.current.getEditor().getSelection();
                    quillRef.current.getEditor().insertEmbed(selection.index, "image", url);
                })
            }
        )
    }

    const handleImage = () => {
        console.log("Slikata e fatena na delo");
        const imageInput = document.createElement("input");
        imageInput.setAttribute("type", "file");
        imageInput.setAttribute("accept", "image/png, image/gif, image/jpeg, image/bmp");
        imageInput.click();
        imageInput.oninput = () => {
            const image = imageInput.files[0];
            uploadToStorage(image);
        }
    }

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline','strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                ['clean'],
            ],

            // handlers: {
            //     image: handleImage
            // },

        },
            imageResize: {
                handleStyles: {
                    backgroundColor: 'black',
                    border: 'none',
                    color: 'white',
                },
                modules: ['Resize'],
            },
    }), [])

      const formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
        ]

    const quillRef = useRef(null);

    function handleCoverInput (e) {
        //TODO: UPLOAD IMAGE TO FIREBASE STORAGE AND PROVIDE PREVIEW, AS WELL AS PROGRESS BAR
        console.log("Slikata e fatena na delo");
        const image = e.target.files[0];
        const imageRef = ref(storage, image.name + new Date().getTime());
        // let imageURL = null;
        uploadBytesResumable(imageRef, image).then(
            () => {
                getDownloadURL(imageRef).then(
                    (url) => {
                        alert("image uploaded")
                        setPost({...post, coverImage: url});
                    })
            }
        )

    }


    return(
        <div>
            <Header />
            <h1>Create Post route</h1>
            <form onSubmit={handleSubmit}>
                <h2>Title:</h2>
                <input  onChange={(e)=>{setPost({...post, title: e.target.value})}} className="formInput" type="text" placeholder="Enter title..." />
                <h2>Category:</h2>
                <input  onChange={(e)=>{setPost({...post, category: e.target.value})}} className="formInput" type="text" placeholder="Enter category..." />
                <h2>Cover image:</h2>
                <input onInput={handleCoverInput} type="file" />
                <img src={post.coverImage} width="200" height="200" />
                <hr />
                <ReactQuill ref={quillRef} formats={formats} modules={modules} theme="snow" value={post.content}
                                           onChange={(HTMLcontent) => {
                                               setPost({...post, content: HTMLcontent});
                                           }} placeholder="Enter blog content here..."/>
                <button type="submit">Submit</button>
            </form>
            <hr />
            <div className="ql-editor ql-container" dangerouslySetInnerHTML={{__html: post.content}} />
        </div>
    );
}