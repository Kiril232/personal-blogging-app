import { db } from "./firebase";
import { collection, query, where, getDocs} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function BlogPost(){
    const post = useRef(null);
    const [text, setText] = useState("");
    const [postContent, setPostContent] = useState({});
    let { slug } = useParams();
    useEffect(() => {
        const fetchData = async () => {
                const q = query(collection(db, "posts"), where("slug", "==", slug));
                post.current = await getDocs(q);
                console.log(post.current.docs[0].data());
                setPostContent(post.current.docs[0].data());
        };

        fetchData();
    },[])

    return (
        <div>
            <h1>{postContent.title}</h1>
            <div className="ql-editor ql-container" dangerouslySetInnerHTML={{__html: postContent.content}}/>
        </div>
    );

}