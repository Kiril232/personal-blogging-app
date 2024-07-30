import './Input.css';
export default function Input( {handleChange} ){
    return (
        <input onChange={(e) => {
            handleChange(e.target.value);
        }} className="mainInput" type="text"/>
    );
}