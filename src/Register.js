import { auth, storage } from "./firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Register() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  function handleProfileInput(e) {
    console.log(profilePhotoURL);
    const photo = e.target.files && e.target.files[0];
    if (profilePhotoURL.length !== 0) {
      URL.revokeObjectURL(profilePhotoURL);
    }
    if (photo) {
      setProfilePhotoURL(URL.createObjectURL(photo));
      setProfilePhoto(photo);
    }
  }

  const previewStyle = {
    borderRadius: "50%",
    height: "70px",
    width: "70px",
  };

  function handleUpload() {
    const photoRef = ref(storage, profilePhoto.name + new Date().getTime());
    const uploadTask = uploadBytesResumable(photoRef, profilePhoto);
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
        getDownloadURL(photoRef).then((url) => {
          updateProfile(auth.currentUser, {
            displayName: username,
            photoURL: url,
          }).then(() => {
            navigate("/");
          });
        });
      }
    );
  }

  return (
    <div>
      <h3>Enter your username:</h3>
      <input
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        placeholder="username"
      />
      <h3>Upload profile photo:</h3>
      <input type="file" onInput={handleProfileInput} />
      <p>Preview:</p>
      <img
        src={profilePhotoURL}
        width="30px"
        height="30px"
        style={previewStyle}
      />
      <br />
      <button onClick={handleUpload}>Upload changes</button>
    </div>
  );
}
