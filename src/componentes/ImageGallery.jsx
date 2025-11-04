import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const ProjectGallery = () => {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "imagenes"), (snapshot) => {
      setProyectos(snapshot.docs.map((doc) => doc.data().url));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Proyectos Destacados</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {proyectos.map((url, index) => (
          <img key={index} src={url} alt="Proyecto" width="200" />
        ))}
      </div>
    </div>
  );
};

export default ProjectGallery;
