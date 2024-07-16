import Header from './Header.js'
import ReactQuill, {Quill} from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useMemo, useRef } from "react";
import { collection, addDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase.js"
import  ImageResize   from "quill-image-resize";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

window.Quill = ReactQuill;
Quill.register('modules/imageResize', ImageResize);


export default function CreatePost(){
    const [post, setPost] = useState({
        title: "",
        content: "",
        category: "",
        date: new Date().toLocaleDateString(),
        slug: ""
    });
    const navigate = useNavigate();
    const docRef = collection(db, "posts");
    const [coverImageInProgress, setCoverImageInProgress] = useState(false);
    const [imageInProgress, setImageInProgress] = useState(false);
    const [progress, setProgress] = useState(0);
    const [coverURL, setCoverURL] = useState("");

    const coverImg = useRef(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        if(!coverImg){
            return;
        }
        const imageRef = ref(storage, coverImg.current.name + new Date().getTime());
        const uploadTask =  uploadBytesResumable(imageRef, coverImg.current);
         uploadTask.on('state_changed',
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
                getDownloadURL(imageRef).then(
                     (url) => {
                        const newDoc = addDoc(docRef, {...post, coverImage: url});
                    })
            }
        );
        navigate("/");
    }

    const  uploadToStorage =  (image) => {
        setImageInProgress(true);
        const imageRef = ref(storage, image.name + new Date().getTime());
        // let imageURL = null;
        const uploadTask = uploadBytesResumable(imageRef, image);

        uploadTask.on('state_changed',
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
                getDownloadURL(imageRef).then(
                    (url) => {
                        let selection = quillRef.current.getEditor().getSelection();
                        quillRef.current.getEditor().insertEmbed(selection.index, "image", url);
                        setImageInProgress(false);
                        setProgress(0);
                    })
            }
        );
    }

    const handleImage = () => {
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

            handlers: {
                image: handleImage
            },

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
        console.log(coverURL);
        const image = e.target.files && e.target.files[0];
        if(image){
            coverImg.current = image;
        }
        if(coverURL.length !== 0){
            URL.revokeObjectURL(coverURL);
        }
        if(coverImg.current){
            setCoverURL(URL.createObjectURL(image));
        }
    }


    function kebab(str){
        return str.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s/g, "-");
    }

    return(
        <div>
            <Header/>
            <h1>Create Post route</h1>
            <form onSubmit={handleSubmit}>
                <h2>Title:</h2>
                <input onChange={(e) => {
                    setPost({...post, title: e.target.value, slug: kebab(e.target.value)})
                }} className="formInput" type="text" placeholder="Enter title..."/>
                <p>{post.slug}</p>
                <h2>Category:</h2>
                <input onChange={(e) => {
                    setPost({...post, category: e.target.value})
                }} className="formInput" type="text" placeholder="Enter category..."/>
                <h2>Cover image:</h2>
                <input onInput={handleCoverInput} type="file"/>
                <img src={coverURL} width="200" height="200" alt="cover image"/>
                <hr/>
                {imageInProgress && <ProgressBar progress={progress} />}
                <ReactQuill ref={quillRef} formats={formats} modules={modules} theme="snow" value={post.content}
                            onChange={(HTMLcontent) => {
                                setPost({...post, content: HTMLcontent});
                            }} placeholder="Enter blog content here..."/>
                <button type="submit">Submit</button>
            </form>
            <hr/>
            <div className="ql-editor ql-container" dangerouslySetInnerHTML={{__html: post.content}}/>
        </div>
    );
}