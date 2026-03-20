// Datos bancarios mock del consorcio — reemplazar por fetch al conectar backend
export const DATOS_BANCARIOS = {
  titular: "Consorcio Edificio Las Acacias",
  banco:   "Banco Galicia",
  alias:   "CONSORCIA.ACACIAS",
  cbu:     "0070999130004018585994",
};

export const STEPS = {
  INSTRUCCIONES:        "instrucciones",
  UPLOAD:               "upload",
  PENDIENTE_VALIDACION: "pendiente_validacion",
  RECHAZADO:            "rechazado",
};

export const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
export const MAX_SIZE_MB = 10;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Formato no válido. Aceptamos PDF, JPG o PNG.`;
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `El archivo supera los ${MAX_SIZE_MB} MB permitidos.`;
  }
  return null;
}

export function formatFileSize(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}