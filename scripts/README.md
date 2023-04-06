# Scripts

## Inyectar genéticas

En esta carpeta "scripts", encontramos un archivo llamado addGenetics.js que nos permitirá inyectar genéticas en nuestro contrato TJoyGenetics.

El programa está diseñado para leer un archivo de texto que se encuentre en la carpeta "resources" de este mismo directorio por lo que debemos nutrir este archivo con las genéticas a inyectar. Este archivo se llama "genetics.txt".
Se recomienda que el archivo genetics.txt no contenga líneas adicionales ni espacios después de cada texto, únicamente el salto de línea entre genética y genética.

### Cómo utilizarlo

Antes de nada, comentar que, en el mismo script se instancia el contrato de TJoyGenetics y debe hacerse con la address del Owner.
Por este motivo, debemos de tener la precaución de haber preparado con anterioridad las variables de entorno que figuran en el siguiente código para que el proceso se lleve a cabo correctamente:

```js
const ownerTronWeb = new TronWeb({
  fullHost: process.env.HOST,
  privateKey: process.env.OWNER_ACCOUNT,
});

const mintAddress = ownerTronWeb.address.fromHex(process.env.GENETICS_ADDRESS);
```

El siguiente paso será lanzarlo mediante el comando:

```sh
node scripts/addGenetics.js
```

Este comando lo he lanzado desde la raíz del proyecto.

### Resultado obtenido

En caso de que todo el proceso se realize correctamente se nos mostrará el mensaje: All genetics have been successfully added.
Si por el contrario, hubiera algún error o incoherencia entre la información contenida en la blockchain y lo introducido por el script, este lo mostraría de igual manera por consola.

## Agregar direcciones a la whitelist

En este caso vamos a agregar direcciones públicas al mapeo de "owners" del contrato TJoyMint.

### Cómo utilizarlo

Se trata del mismo proceso que el script de añadir genéticas de manera que debemos tener en cuenta los mismos detalles.

### Resultado obtenido

Al final del proceso revisaremos el mapeo de "owners" pasándole en cada llamada una de las wallets que hemos intentado whitelistear.

Comentar que esta llamada deberá devolver un big number que, al ser transformado a número se convertirá en un uno. Esto quiere decir que el proceso se ha realizado correctamente. De lo contrario, se lanzará un error.
