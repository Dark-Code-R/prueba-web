import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Spline from "@splinetool/react-spline";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import "./style/Login.css"; // Reutilizamos el mismo estilo

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.includes("@") || !email.includes(".")) {
      setError("Ingresa un correo válido.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      handleFirebaseError(error.code);
    }

    setLoading(false);
  };

  const handleFirebaseError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        setError("El correo ya está registrado. Usa otro o inicia sesión.");
        break;
      case "auth/invalid-email":
        setError("El correo ingresado no es válido.");
        break;
      case "auth/weak-password":
        setError("La contraseña es demasiado débil. Usa al menos 6 caracteres.");
        break;
      default:
        setError("Error al registrar. Intenta de nuevo.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1B3A57] to-[#123347] animate-fade-in">
      <div className="relative bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl w-full max-w-md m-4 transition-all duration-300 ease-in-out hover:shadow-[0_20px_50px_rgba(27,58,87,0.3)] z-10">
        <h2 className="text-3xl font-bold mb-4 text-center text-[#1B3A57]">Regístrate</h2>
        <div className="w-full h-48 mb-6 overflow-hidden flex justify-center animate-fade-in-up">
          <Spline
            scene="https://prod.spline.design/i7cx4-oqO1ig1-MC/scene.splinecode"
            style={{
              width: "100%",
              height: "350px",
              transform: "scale(1) translateY(-28%)",
            }}
          />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-[#333333] text-sm font-medium">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0BEC5]" size={20} />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                required
                className="pl-10 pr-4 w-full border-b-2 border-[#B0BEC5] text-[#333333] placeholder-[#B0BEC5] focus:border-[#FFD166] transition-all duration-300 rounded-none focus:ring-0 animate-fade-in-up"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-[#333333] text-sm font-medium">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0BEC5]" size={20} />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pl-10 pr-10 w-full border-b-2 border-[#B0BEC5] text-[#333333] placeholder-[#B0BEC5] focus:border-[#FFD166] transition-all duration-300 rounded-none focus:ring-0 animate-fade-in-up"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#B0BEC5] hover:text-[#FFD166] transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#FFD166] hover:brightness-110 text-[#1B3A57] font-semibold py-3 rounded-full transition duration-300 transform hover:scale-105 focus:outline-none">
            {loading ? "Registrando..." : "Crear Cuenta"}
          </Button>
        </form>

        {/* 🔹 Botón para ir al login */}
        <div className="mt-6 flex flex-col items-center space-y-4">
          <button 
            onClick={() => navigate("/")} 
            className="text-[#1B3A57] hover:text-[#FFD166] transition-colors duration-300"
          >
            ¿Ya tienes cuenta? <span className="font-bold">Inicia sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
