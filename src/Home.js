import Header from "./Header";
import Input from "./Input";
import Posts from "./Posts";


export default function Home(){
    return (
        <div>
            <Header />
            <h1>Blog</h1>
            <Input />
            <Posts />
        </div>
    );
}