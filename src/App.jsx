import { useState, useEffect } from 'react';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [asignatura, setAsignatura] = useState('');
  const [promedio, setPromedio] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [indiceEdicion, setIndiceEdicion] = useState(null);

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('alumnos');
    if (datosGuardados) {
      setAlumnos(JSON.parse(datosGuardados));
    }
  }, []);

  // Guardar datos cada vez que se modifiquen
  useEffect(() => {
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
  }, [alumnos]);

  const limpiarCampos = () => {
    setNombre('');
    setAsignatura('');
    setPromedio('');
    setModoEdicion(false);
    setIndiceEdicion(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !asignatura || !promedio) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const nuevoAlumno = { nombre, asignatura, promedio };

    if (modoEdicion) {
      const nuevosAlumnos = [...alumnos];
      nuevosAlumnos[indiceEdicion] = nuevoAlumno;
      setAlumnos(nuevosAlumnos);
    } else {
      setAlumnos([...alumnos, nuevoAlumno]);
    }

    limpiarCampos();
  };

  const editarAlumno = (index) => {
    const alumno = alumnos[index];
    setNombre(alumno.nombre);
    setAsignatura(alumno.asignatura);
    setPromedio(alumno.promedio);
    setModoEdicion(true);
    setIndiceEdicion(index);
  };

  const eliminarAlumno = (index) => {
    if (confirm('¿Estás seguro de eliminar este alumno?')) {
      const nuevosAlumnos = alumnos.filter((_, i) => i !== index);
      setAlumnos(nuevosAlumnos);
    }
  };

  const obtenerApreciacion = (prom) => {
    const p = parseFloat(prom);
    if (p < 4.0) return 'Deficiente';
    else if (p < 5.6) return 'Con Mejora';
    else if (p < 6.5) return 'Buen Trabajo';
    else return 'Destacado';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="container mx-auto max-w-xl p-4 bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Evaluación de Alumnos</h1>

        <form onSubmit={handleSubmit} className="space-y-2 mb-4">
          <input
            type="text"
            placeholder="Nombre del Alumno"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border p-2 text-black"
          />
          <input
            type="text"
            placeholder="Asignatura"
            value={asignatura}
            onChange={(e) => setAsignatura(e.target.value)}
            className="w-full border p-2 text-black"
          />
          <input
            type="number"
            placeholder="Promedio"
            value={promedio}
            onChange={(e) => setPromedio(e.target.value)}
            className="w-full border p-2 text-black"
            step="0.1"
            min="1"
            max="7"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
            {modoEdicion ? 'Actualizar Alumno' : 'Agregar Alumno'}
          </button>
        </form>

        <table className="w-full border text-sm text-center bg-gray-700 rounded">
          <thead>
            <tr className="bg-gray-600 text-white">
              <th className="border p-1">Nombre</th>
              <th className="border p-1">Asignatura</th>
              <th className="border p-1">Promedio</th>
              <th className="border p-1">Apreciación</th>
              <th className="border p-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((a, i) => (
              <tr key={i}>
                <td className="border p-1">{a.nombre}</td>
                <td className="border p-1">{a.asignatura}</td>
                <td className="border p-1">{a.promedio}</td>
                <td className="border p-1">{obtenerApreciacion(a.promedio)}</td>
                <td className="border p-1 space-x-1">
                  <button
                    onClick={() => editarAlumno(i)}
                    className="bg-yellow-400 text-black px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarAlumno(i)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {alumnos.length === 0 && (
              <tr>
                <td colSpan="5" className="p-2">
                  No hay alumnos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
