# Fulbo - Simulador de Futbol Argentino

Plataforma web interactiva de gestion de planteles, mecanicas de draft tactico y simulacion de partidos inspirada en los formatos y la idiosincrasia del futbol argentino. El proyecto permite a los usuarios confeccionar un equipo titular mediante un sistema de cartas coleccionables y competir en dos modalidades de torneo: formato copa por eliminacion directa (ChiquiCup) o campeonato de liga regular con fase final de playoffs (ChiquiLeague).

---

## Tabla de Contenidos

1. [Descripcion General](#descripcion-general)
2. [Modos de Juego](#modos-de-juego)
3. [Sistema de Draft y Armado de Plantel](#sistema-de-draft-y-armado-de-plantel)
4. [Motor de Simulacion](#motor-de-simulacion)
5. [Estructura del Repositorio](#estructura-del-repositorio)
6. [Pila Tecnologica](#pila-tecnologica)
7. [Instalacion y Uso Local](#instalacion-y-uso-local)
8. [Despliegue](#despliegue)
9. [Licencia](#licencia)

---

## Descripcion General

Fulbo es una aplicacion web cliente pura (JAMstack) construida sin sobrecarga de empaquetadores ni dependencias de backend obligatorias. Integra una base de datos con mas de 30 clubes y cientos de futbolistas del futbol argentino moderno e historico, evaluados con medias tecnicas individuales por posicion y atributos.

El nucleo del juego combina la estrategia en la seleccion de futbolistas con un motor probabilistico en tiempo real que simula el desarrollo minuto a minuto de cada encuentro deportivo, reflejando incidencias reglamentarias y relatos contextuales.

---

## Modos de Juego

### 1. ChiquiCup
Torneo de copa por eliminacion directa mano a mano a partido unico:
- Estructura: 5 fases eliminatorias consecutivas (dieciseisavos de final, octavos de final, cuartos de final, semifinal y final).
- Reglas de desempate: En caso de igualdad en los 90 minutos reglamentarios, se disputa tiempo extra (dos tiempos suplementarios hasta los 120') y tanda de penales reglamentaria.
- Objetivo: Coronarse campeon de copa superando las cinco llaves consecutivas.

### 2. ChiquiLeague
Torneo de division de liga basado en el formato de 30 equipos de la Primera Division:
- Fase Regular: 15 fechas de competencia con calendario equilibrado, incluyendo una fecha designada para clasicos interzonales.
- Tabla de Posiciones: Sistema en tiempo real con computo de puntos (3 por victoria, 1 por empate, 0 por derrota), diferencia de gol, goles a favor y goles en contra.
- Fase Final de Playoffs: Los mejores equipos clasificados de la fase regular avanzan al cuadro eliminatorio (cuartos de final, semifinales y final) para dirimir al campeon del torneo.

---

## Sistema de Draft y Armado de Plantel

Previo a la competencia en cualquiera de los dos modos, el usuario pasa por una instancia de draft tactico estructurada de la siguiente manera:

- Esquema Tactico: Sistema base 4-3-3 compuesto por 11 posiciones especializadas:
  - 1 Arquero (ARQ)
  - 1 Lateral Izquierdo (LI)
  - 2 Defensores Centrales (DFC)
  - 1 Lateral Derecho (LD)
  - 2 Mediocampistas Centrales (MC)
  - 1 Mediocampista Ofensivo / Enganche (MCO)
  - 1 Extremo Derecho (ED)
  - 1 Extremo Izquierdo (EL)
  - 1 Delantero Centro (DC)

- Rarezas y Variantes de Cartas:
  - Cartas Estandar: Jugadores activos pertenecientes a los 30 clubes de Primera Division con su media estadistica nominal.
  - Cartas Oro: Bonificacion de +3 puntos sobre la media base del futbolista.
  - Cartas Diamante: Bonificacion de +5 puntos sobre la media base del futbolista.
  - Cartas de Idolos: Leyendas y figuras historicas consagradas del futbol nacional con atributos elevados.

- Re-sorteos Estrategicos: Durante las 11 rondas de seleccion, el usuario dispone de 3 re-rolls tacticos que le permiten descartar las opciones presentadas y generar un nuevo lote de futbolistas para la posicion disputada.

---

## Motor de Simulacion

El archivo `fulbo-engine.js` centraliza la logica matematica, los datos de los futbolistas y la resolucion de los partidos:

- Evaluacion Ponderada de Medias: El rendimiento global del equipo se calcula a partir de las calificaciones individuales de sus lineas (defensa, mediocampo y ataque), ajustadas por penalizaciones en caso de futbolistas alineados fuera de su rol natural.
- Calculo Estocastico Minuto a Minuto: Distribucion de probabilidades para la generacion de ataques, disparos efectivos, atajadas, faltas y tiempo agregado.
- Matriz de Incidencias: Registro de goles, amonestaciones con tarjeta amarilla, expulsiones por tarjeta roja y lesiones.
- Relato en Vivo: Generador de texto dinamico que describe las jugadas clave y los momentos algidos del cotejo con el tono y folklore del relato deportivo argentino.

---

## Estructura del Repositorio

```text
.
├── index.html           # Portal de bienvenida y seleccion de modalidades de juego
├── chiquicup.html       # Interfaz de usuario para la modalidad ChiquiCup (draft y llaves)
├── chiquileague.html    # Interfaz de usuario para la modalidad ChiquiLeague (draft, fixture y tabla)
├── app.js               # Controlador de flujo y eventos para la ChiquiCup
├── chiquileague.js      # Controlador de estado de liga, fixture, simulacion y playoffs
├── fulbo-engine.js      # Base de datos de jugadores/clubes y motor de simulacion de partidos
├── style.css            # Estilos globales, componentes de cartas y adaptabilidad responsiva
├── privacy.html         # Declaracion de politica de privacidad
├── terms.html           # Terminos y condiciones de uso del servicio
├── ads.txt              # Archivo de declaracion publicitaria
├── robots.txt           # Directivas de indexacion para motores de busqueda
└── README.md            # Documentacion tecnica del proyecto
```

---

## Pila Tecnologica

- Lenguajes: HTML5, CSS3, JavaScript (ES6+).
- Interfaz y Componentes: Bootstrap 5.3 (modo oscuro integrado), Bootstrap Icons.
- Tipografias: Google Fonts (Bebas Neue, Barlow Condensed, Rubik).
- Almacenamiento Local: Web Storage API (`localStorage`) para la persistencia del nombre de equipo, configuraciones y estados de partida.
- Arquitectura: Aplicacion estatica orientada al cliente, sin requerimiento de servidores de aplicacion dedicados.

---

## Instalacion y Uso Local

Para ejecutar el proyecto en un entorno local no se requiere la instalacion de paquetes de terceros ni gestores de dependencias como npm o yarn.

1. Clonar el repositorio localmente:
   ```bash
   git clone https://github.com/santifaccio/fulbo.git
   cd fulbo
   ```

2. Iniciar un servidor HTTP local para servir los archivos estaticos:

   - Con Python 3:
     ```bash
     python3 -m http.server 8000
     ```

   - Con Node.js (usando npx):
     ```bash
     npx serve .
     ```

   - Con extensiones de editor: Por ejemplo, "Live Server" en Visual Studio Code.

3. Abrir en el navegador:
   ```text
   http://localhost:8000
   ```

---

## Despliegue

El proyecto esta optimizado para plataformas de alojamiento estatico y CDNs modernas:

- Vercel: Compatible con cero configuracion inicial. El archivo `index.html` es detectado automaticamente como punto de entrada.
- Netlify / GitHub Pages: Se despliega directamente vinculando la rama principal (`main`) del repositorio.

---

## Licencia

Este proyecto ha sido desarrollado con fines recreativos y educativos. Todos los derechos reservados por su autor.
