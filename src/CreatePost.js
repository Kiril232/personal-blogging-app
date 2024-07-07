import Header from './Header.js'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useMemo, useRef } from "react";
import { collection, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase.js"

export default function CreatePost(){
    const [value, setValue] = useState('');
    const docRef = doc(db, "posts", "2");
    const documentData = {
        title: "fourth-post",
        date: new Date(),
        content: value,
        coverImage: "imageURL"
    }
    const handleClick = async () => {
        const newDoc = await setDoc(docRef, documentData);
    }

    const  uploadToStorage =  (image) => {
        //TODO: Upload selected image to firebase and get downloadURL
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

            handlers: {
                image: handleImage
            }
        }
    }), [])

      const formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
        ]

    const quillRef = useRef(null);

    return(
        <div>
            <Header />
            <h1>Create post route</h1>
            <ReactQuill ref={quillRef}  formats={formats} modules={modules} theme="snow" value={value} onChange={setValue}/>
            <button onClick={handleClick}>Get doc</button>
            <hr />
            <div className="ql-editor" dangerouslySetInnerHTML={{__html: value}} />
        </div>
    );
}