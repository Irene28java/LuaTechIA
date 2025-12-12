export default function DownloadTemplate({ name }) {
  return (
    <button
      className="btn bg-green-600 text-white"
      onClick={() => window.open(`http://localhost:3000/downloads/${name}`, "_blank")}
    >
      Descargar {name}
    </button>
  );
}
