import { auth, storage } from "./firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ReactComponent as LogoIpsum } from "./logoipsum.svg";

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
    objectFit: "cover",
  };

  function handleUpload() {
    if (profilePhoto) {
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
    } else {
      updateProfile(auth.currentUser, {
        displayName: username,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/personal-blog-2332.appspot.com/o/Default-Profile-Picture-Download-PNG-Image.png?alt=media&token=019a2bb7-87dd-478d-a43f-17d5d8d2e2a3",
      }).then(() => {
        navigate("/");
      });
    }
  }

  return (
    <div className="auth-content-container">
      <div className="reigster-container"></div>
      <LogoIpsum className="logo" />
      <h2>Welcome to Pragma!</h2>
      <p>One more step before we finish your registration...</p>
      <h3>Choose your username:</h3>
      <input
        className="login-input"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        placeholder="Username"
      />
      <h3>Upload your profile photo:</h3>
      <input type="file" onInput={handleProfileInput} />
      <h4>Preview:</h4>
      {profilePhotoURL && (
        <img
          src={profilePhotoURL}
          width="30px"
          height="30px"
          style={previewStyle}
        />
      )}
      <br />
      <button className="register-button" onClick={handleUpload}>
        Finish registration
      </button>
    </div>
  );
}
