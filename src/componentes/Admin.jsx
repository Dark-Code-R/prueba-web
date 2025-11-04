import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export default function Admin() {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newService, setNewService] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      auth.onAuthStateChanged((user) => {
        if (!user) {
          alert("Debes iniciar sesión como administrador.");
          navigate("/home");
          return;
        }

        if (user.email !== "rodrigo.darkcode@gmail.com") {
          alert("Acceso denegado. Solo el administrador puede modificar.");
          navigate("/home");
        }
      });
    };

    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "content", "home");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroTitle(data.heroTitle || "");
          setHeroDescription(data.heroDescription || "");
          setServices(data.services || []);
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "content", "home");
      await updateDoc(docRef, {
        heroTitle,
        heroDescription,
        services,
        projects,
      });
      alert("Cambios guardados correctamente.");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar cambios.");
    }
  };

  if (loading) return <p className="text-center">Cargando datos...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Panel de Administración</h2>

      <label className="block mb-2 font-semibold">Título Principal</label>
      <Input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full mb-4" />

      <label className="block mb-2 font-semibold">Descripción</label>
      <textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} className="w-full h-24 p-2 border rounded mb-4"></textarea>

      <h3 className="text-xl font-bold mt-6 mb-2">Servicios</h3>
      <ul>
        {services.map((service, index) => (
          <li key={index} className="flex justify-between items-center border p-2 rounded mb-2">
            <Input type="text" value={service} onChange={(e) => {
              const updatedServices = [...services];
              updatedServices[index] = e.target.value;
              setServices(updatedServices);
            }} />
          </li>
        ))}
      </ul>

      <Button onClick={handleSave} className="mt-6 w-full bg-green-500 hover:bg-green-600">Guardar Cambios</Button>
    </div>
  );
}
