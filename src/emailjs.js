import emailjs from "@emailjs/browser";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase";

emailjs.init({ publicKey: "1-NkKEtkVH_JZt1oP" });

export const sendEmail = async (postContent) => {
  const snapshot = await getDocs(collection(db, "subscribers"));
  const emailList = snapshot.docs.map((doc) => doc.data().email).join(",");

  const templateParams = {
    to_email: emailList,
    coverImage: postContent.coverImage,
    title: postContent.title,
    date:
      new Date(postContent.date).toLocaleString("default", {
        month: "short",
      }) +
      " " +
      new Date(postContent.date).getDate() +
      ", " +
      new Date(postContent.date).getFullYear(),
    content: postContent.content
      .replace(/<\/p>/g, " ") // Replace closing paragraph tags with space
      .replace(/<br\s*\/?>/g, " ") // Replace <br> tags with space
      .replace(/<\/?[^>]+(>|$)/g, "")
      .substring(0, 90),
    slug: postContent.slug,
  };

  try {
    const result = await emailjs.send(
      "service_2stmznn",
      "template_vv3dgxi",
      templateParams
    );
    console.log("Email sent: ", result.text);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
