import './Posts.css';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from "./firebase.js";

export default function Posts(){
    function kebab(str){
        return str.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s/g, "-");
    }


        const [posts, setPosts] = useState([]);

    useEffect(() => {

        async function fetchPosts () {
            const docsSnapshot = await getDocs(collection(db, "posts"));
            setPosts(docsSnapshot.docs);
        }

        fetchPosts();
    }, [])

    return (
        <div className="container">

            {
                posts.length > 0 ? (posts.map((doc) => {
                    return (
                        <div key={doc.id} className="pic">
                            <img src={doc.data().coverImage} alt={doc.data().title}/>
                                <h2><Link to={"/post/" + doc.data().slug}>{doc.data().title}</Link></h2>
                        </div>
                    );
                })) : (<p>Posts loading...</p>)

            }


            {/*<div className="pic"></div>*/}
            {/*<div className="pic"></div>*/}
            {/*<div className="pic"></div>*/}
        </div>
    );
}