#!/bin/sh
# Arranque del contenedor de producción.
set -e

DB_FILE=/app/data/nodepop.sqlite

# La base de datos de la demo viene creada en la imagen (migraciones + initDB).
# Si el volumen está vacío se copia; con RESET_DB_ON_START=true se restaura en cada arranque.
if [ "$RESET_DB_ON_START" = "true" ] || [ ! -f "$DB_FILE" ]; then
  cp /app/seed/nodepop.sqlite "$DB_FILE"
  echo "Base de datos de la demo restaurada"
fi

# exec: Node pasa a ser el proceso principal y recibe las señales de docker stop
exec node dist/src/index.js
