import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length < 64 && emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor rellena todos los campos");
      return;
    }

    if (!validateEmail(email)) {
      setError("El correo electrónico no es válido");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        if (result.user?.role === "Administrador") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError("Correo o contraseña incorrectos");
        setPassword("");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with blue background */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12"
        style={{
          backgroundImage: 'linear-gradient(rgba(10,24,60,0.75), rgba(10,24,60,0.75)),url("/src/assets/f1.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">San Jorge</h2>
          <p className="text-blue-200">Autoservicio</p>
        </div>
        <div className="text-white">
          <p className="text-lg italic mb-6">
            "El portal de clientes nos permite ofrecer transparencia total en nuestras cotizaciones y mantenimientos. Todo el historial de tu vehículo en un solo lugar."
          </p>
          <div>
            <h3 className="font-bold text-lg">Garantía San Jorge</h3>
            <p className="text-blue-200">Más de 30 años de experiencia</p>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-600 mb-8">
            Inicia sesión con tu correo y contraseña para acceder a la plataforma.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-gray-400"
            >
              {loading ? "Verificando..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Registrate aquí
              </Link>
            </p>
          </div>

          {/* Quick test info */}
          <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-yellow-800 text-sm font-semibold">💡 Usuario Administrador:</p>
            <p className="text-yellow-700 text-xs mt-1">• Correo: "admin@admin.com"</p>
            <p className="text-yellow-700 text-xs">• Contraseña: "admin123"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
