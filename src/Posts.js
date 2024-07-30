import './Posts.css';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from "./firebase.js";

export default function Posts( {sorted, search, category}){
    function kebab(str){
        return str.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s/g, "-");
    }


        const [posts, setPosts] = useState([]);
        // const [sortedPosts, setSortedPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts () {
            const postsSnapshot = await getDocs(collection(db, "posts"));
            setPosts(postsSnapshot.docs);
        }

        fetchPosts().then(() => {
            console.log("Successfully fetched posts.");
        });
    }, [])

    function stripHTML(str){
            let tmp = document.createElement("DIV");
            tmp.innerHTML = str;
            return tmp.innerText;
    }

    if(!sorted) {
        return (
            <div className="container">

                <h2>All posts</h2>
                {
                    posts.length > 0 ? (
                        posts.map((doc) => {
                            if(doc.data().title.toLowerCase().startsWith(search) && (category==="" || doc.data().category === category)){
                                return (
                                    <div key={doc.id} className="pic">
                                        <img src={doc.data().coverImage} alt={doc.data().title}/>
                                        <h2><Link to={"/post/" + doc.data().slug}>{doc.data().title}</Link></h2>
                                        {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
                                        <p>{doc.data().content.replace(/<\/p>/g, ' ')         // Replace closing paragraph tags with space
                                            .replace(/<br\s*\/?>/g, ' ')    // Replace <br> tags with space
                                            .replace(/<\/?[^>]+(>|$)/g, '').substring(0, 50)}...</p>
                                    </div>
                                );
                            }
                        })
                    ) : (<p>Posts loading...</p>)

                }
                <hr/>
                <h2>Most recent posts</h2>
                {
                    posts.toSorted((a, b) => {
                        return new Date(b.data().date).getTime() - new Date(a.data().date).getTime();
                    }).slice(0, 3).map((doc) => {
                        return (
                            <div key={doc.id} className="pic">
                                <img src={doc.data().coverImage} alt={doc.data().title}/>
                                <h2><Link to={"/post/" + doc.data().slug}>{doc.data().title}</Link></h2>
                                {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
                                <p>{doc.data().content.replace(/<\/p>/g, ' ')         // Replace closing paragraph tags with space
                                    .replace(/<br\s*\/?>/g, ' ')    // Replace <br> tags with space
                                    .replace(/<\/?[^>]+(>|$)/g, '').substring(0, 50)}...</p>
                            </div>
                        );
                    })
                }

                {/*<div className="pic"></div>*/}
                {/*<div className="pic"></div>*/}
                {/*<div className="pic"></div>*/}
            </div>
        );
    } else {
        return (


            <div className="container">

                <h2>All posts</h2>

                {
                    posts.length > 0 ? (
                        posts.toSorted((a, b) => {
                            return new Date(b.data().date).getTime() - new Date(a.data().date).getTime();
                        }).map((doc) => {
                            if((doc.data().title.toLowerCase().startsWith(search)) && (category==="" || doc.data().category === category)){
                                return (
                                    <div key={doc.id} className="pic">
                                        <img src={doc.data().coverImage} alt={doc.data().title}/>
                                        <h2><Link to={"/post/" + doc.data().slug}>{doc.data().title}</Link></h2>
                                        {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
                                        <p>{doc.data().content.replace(/<\/p>/g, ' ')         // Replace closing paragraph tags with space
                                            .replace(/<br\s*\/?>/g, ' ')    // Replace <br> tags with space
                                            .replace(/<\/?[^>]+(>|$)/g, '').substring(0, 50)}...</p>
                                    </div>
                                );
                            }
                        })
                    ) : (<p>Posts loading...</p>)

                }
                <hr/>
                <h2>Most recent posts</h2>
                {
                    posts.toSorted((a, b) => {
                        return new Date(b.data().date).getTime() - new Date(a.data().date).getTime();
                    }).slice(0, 3).map((doc) => {
                        return (
                            <div key={doc.id} className="pic">
                                <img src={doc.data().coverImage} alt={doc.data().title}/>
                                <h2><Link to={"/post/" + doc.data().slug}>{doc.data().title}</Link></h2>
                                {/*<p>{stripHTML(doc.data().content.replace("<br>", ' ').replace("</p>", ' ')).substring(0,50)}...</p>*/}
                                <p>{doc.data().content.replace(/<\/p>/g, ' ')         // Replace closing paragraph tags with space
                                    .replace(/<br\s*\/?>/g, ' ')    // Replace <br> tags with space
                                    .replace(/<\/?[^>]+(>|$)/g, '').substring(0, 50)}...</p>
                            </div>
                        );
                    })
                }

                {/*<div className="pic"></div>*/}
                {/*<div className="pic"></div>*/}
                {/*<div className="pic"></div>*/}
            </div>
        );
    }

}