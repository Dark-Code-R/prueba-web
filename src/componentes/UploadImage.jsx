import React, { useState } from "react";
import axios from "axios";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Selecciona una imagen antes de subir.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    try {
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const imageUrl = response.data.secure_url;

      await addDoc(collection(db, "imagenes"), { url: imageUrl, fecha: new Date() });

      alert("Imagen subida con éxito y guardada en Firestore!");
      setFile(null);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al subir la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Subir Imagen de Trabajo</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Subiendo..." : "Subir"}
      </button>
    </div>
  );
};

export default UploadImage;
