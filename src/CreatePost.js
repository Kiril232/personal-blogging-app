import Header from './Header.js'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";

export default function CreatePost(){
    const [value, setValue] = useState('');
    return(
        <div>
            <Header />
            <h1>Create post route</h1>
            <ReactQuill theme="snow" value={value} onChange={setValue}/>
            <hr />
            <div className="ql-editor" dangerouslySetInnerHTML={{__html: value}} />
        </div>
    );
}