#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

echo "Docker entrypoint script started..."

# Verifica si la variable de entorno API_KEY está configurada
if [ -z "${API_KEY}" ]; then
  echo "ERROR: La variable de entorno API_KEY no está configurada."
  echo "Por favor, configura API_KEY cuando ejecutes el contenedor Docker."
  echo "Ejemplo: docker run -e API_KEY=\"tu_clave_api\" ..."
  exit 1
else
  echo "API_KEY environment variable is set."
fi

# Define la ruta completa al archivo env-config.js
ENV_CONFIG_PATH="/usr/share/nginx/html/env-config.js"

echo "Creando ${ENV_CONFIG_PATH}..."

# Crea el archivo env-config.js con la API_KEY
# Usamos printf para evitar problemas con caracteres especiales en la API_KEY
printf "window.APP_CONFIG = {\n" > "${ENV_CONFIG_PATH}"
printf "  API_KEY: \"%s\",\n" "${API_KEY}" >> "${ENV_CONFIG_PATH}"
printf "  GENERATED_AT: \"%s\"\n" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "${ENV_CONFIG_PATH}"
printf "};\n" >> "${ENV_CONFIG_PATH}"
#printf "console.log('Runtime APP_CONFIG loaded:', window.APP_CONFIG);\n" >> "${ENV_CONFIG_PATH}"


echo "${ENV_CONFIG_PATH} creado. Contenido:"
cat "${ENV_CONFIG_PATH}"
echo "" # Nueva línea para mejor formato

echo "Estableciendo permisos para ${ENV_CONFIG_PATH}..."
chmod 644 "${ENV_CONFIG_PATH}"
echo "Permisos establecidos."

echo "Listando contenido de /usr/share/nginx/html/ para verificación:"
ls -la /usr/share/nginx/html/
echo "" # Nueva línea

echo "Iniciando Nginx..."
# Ejecuta el comando pasado como argumentos a este script (será CMD del Dockerfile)
exec "$@"