# Comentarios de configuración (package.json / package-lock.json)

## `package.json`
- `dependencies` define las dependencias runtime del backend:
  - `express`: servidor HTTP
  - `cors`: habilita CORS para que el frontend pueda consumir la API
  - `dotenv`: carga variables de entorno desde `.env`
  - `pg`: cliente para conectar con PostgreSQL

- `type: "commonjs"` indica que el proyecto usa `require()`.

- `scripts.test` está definido pero no hay tests.

## `package-lock.json`
- Es el lockfile que fija versiones exactas descargadas (determinismo) para:
  - `express`, `pg`, `cors`, `dotenv` y dependencias transitorias.

- No se debe editar manualmente.

---

Si quieres que los comentarios línea por línea sean en un archivo y no en consola, puedo generarte también un `package.json` y `package-lock.json` “comentados” en copia (sin modificar los originales).
