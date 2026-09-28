(function(window) {
    const CLUBS = [{"name": "River Plate", "weight": 10.0, "baseMedia": 77.0, "tier": "BUENO"}, {"name": "Boca Juniors", "weight": 10.0, "baseMedia": 77.0, "tier": "BUENO"}, {"name": "Racing Club", "weight": 8.0, "baseMedia": 76.0, "tier": "BUENO"}, {"name": "Independiente", "weight": 7.0, "baseMedia": 75.0, "tier": "BUENO"}, {"name": "Rosario Central", "weight": 7.5, "baseMedia": 75.0, "tier": "BUENO"}, {"name": "Estudiantes LP", "weight": 7.0, "baseMedia": 75.0, "tier": "BUENO"}, {"name": "Vélez Sarsfield", "weight": 7.0, "baseMedia": 74.0, "tier": "BUENO"}, {"name": "Talleres de Córdoba", "weight": 7.0, "baseMedia": 74.0, "tier": "BUENO"}, {"name": "Belgrano de Córdoba", "weight": 6.0, "baseMedia": 74.0, "tier": "INTERMEDIO"}, {"name": "Lanús", "weight": 6.0, "baseMedia": 74.0, "tier": "INTERMEDIO"}, {"name": "San Lorenzo", "weight": 6.0, "baseMedia": 72.0, "tier": "INTERMEDIO"}, {"name": "Huracán", "weight": 6.0, "baseMedia": 72.0, "tier": "INTERMEDIO"}, {"name": "Argentinos Juniors", "weight": 5.5, "baseMedia": 72.0, "tier": "INTERMEDIO"}, {"name": "Platense", "weight": 5.0, "baseMedia": 71.0, "tier": "INTERMEDIO"}, {"name": "Defensa y Justicia", "weight": 5.0, "baseMedia": 71.0, "tier": "INTERMEDIO"}, {"name": "Atlético Tucumán", "weight": 4.5, "baseMedia": 71.0, "tier": "INTERMEDIO"}, {"name": "Unión de Santa Fe", "weight": 4.5, "baseMedia": 71.0, "tier": "INTERMEDIO"}, {"name": "Independiente Rivadavia", "weight": 4.5, "baseMedia": 71.0, "tier": "INTERMEDIO"}, {"name": "Tigre", "weight": 4.5, "baseMedia": 70.0, "tier": "INTERMEDIO"}, {"name": "Instituto de Córdoba", "weight": 4.5, "baseMedia": 70.0, "tier": "INTERMEDIO"}, {"name": "Newell's Old Boys", "weight": 4.5, "baseMedia": 70.0, "tier": "INTERMEDIO"}, {"name": "Central Córdoba (SdE)", "weight": 4.0, "baseMedia": 69.0, "tier": "INTERMEDIO"}, {"name": "Barracas Central", "weight": 3.5, "baseMedia": 69.0, "tier": "MALO"}, {"name": "Gimnasia LP", "weight": 4.0, "baseMedia": 69.0, "tier": "MALO"}, {"name": "Gimnasia y Esgrima (M)", "weight": 3.5, "baseMedia": 69.0, "tier": "MALO"}, {"name": "Banfield", "weight": 4.0, "baseMedia": 68.0, "tier": "MALO"}, {"name": "Sarmiento de Junín", "weight": 3.5, "baseMedia": 68.0, "tier": "MALO"}, {"name": "Deportivo Riestra", "weight": 3.5, "baseMedia": 68.0, "tier": "MALO"}, {"name": "Aldosivi", "weight": 3.0, "baseMedia": 67.0, "tier": "MALO"}, {"name": "Colón de Santa Fe", "weight": 3.5, "baseMedia": 66.0, "tier": "MALO"}, {"name": "Estudiantes (RC)", "weight": 3.0, "baseMedia": 65.0, "tier": "MALO"}, {"name": "Ferro Carril Oeste", "weight": 3.5, "baseMedia": 65.0, "tier": "MALO"}];
    const PLAYERS = [{"name": "Santiago Beltrán", "club": "River Plate", "position": "ARQ", "baseMedia": 72.0}, {"name": "Marcos Acuña", "club": "River Plate", "position": "LI", "baseMedia": 77.0}, {"name": "Nicolás Otamendi", "club": "River Plate", "position": "DFC", "baseMedia": 78.0}, {"name": "Lucas Martinez Quarta", "club": "River Plate", "position": "DFC", "baseMedia": 76.0}, {"name": "Gonzalo Montiel", "club": "River Plate", "position": "LD", "baseMedia": 77.0}, {"name": "Mauro Arambarri", "club": "River Plate", "position": "MC", "baseMedia": 80.0}, {"name": "Aníbal Moreno", "club": "River Plate", "position": "MC", "baseMedia": 78.0}, {"name": "Thiago Almada", "club": "River Plate", "position": "MCO", "baseMedia": 78.0}, {"name": "Franco Mastantuono", "club": "River Plate", "position": "ED", "baseMedia": 78.0}, {"name": "Angel Correa", "club": "River Plate", "position": "EL", "baseMedia": 78.0}, {"name": "Sebastián Driussi", "club": "River Plate", "position": "DC", "baseMedia": 77.0}, {"name": "Álvaro Montero", "club": "Boca Juniors", "position": "ARQ", "baseMedia": 76.0}, {"name": "Lautaro Blanco", "club": "Boca Juniors", "position": "LI", "baseMedia": 76.0}, {"name": "Marcos Rojo", "club": "Boca Juniors", "position": "DFC", "baseMedia": 75.0}, {"name": "Lautaro Di Lollo", "club": "Boca Juniors", "position": "DFC", "baseMedia": 76.0}, {"name": "Leandro Lozano", "club": "Boca Juniors", "position": "LD", "baseMedia": 76.0}, {"name": "Leandro Paredes", "club": "Boca Juniors", "position": "MC", "baseMedia": 81.0}, {"name": "Santiago Ascacíbar", "club": "Boca Juniors", "position": "MC", "baseMedia": 77.0}, {"name": "Kevin Zenón", "club": "Boca Juniors", "position": "MCO", "baseMedia": 78.0}, {"name": "Exequiel Zeballos", "club": "Boca Juniors", "position": "ED", "baseMedia": 76.0}, {"name": "Sebastián Villa", "club": "Boca Juniors", "position": "EL", "baseMedia": 77.0}, {"name": "Miguel Merentiel", "club": "Boca Juniors", "position": "DC", "baseMedia": 77.0}, {"name": "Facundo Cambeses", "club": "Racing Club", "position": "ARQ", "baseMedia": 76.0}, {"name": "Gabriel Rojas", "club": "Racing Club", "position": "LI", "baseMedia": 75.0}, {"name": "Marco Di Cesare", "club": "Racing Club", "position": "DFC", "baseMedia": 76.0}, {"name": "Agustín García Basso", "club": "Racing Club", "position": "DFC", "baseMedia": 75.0}, {"name": "Gastón Martirena", "club": "Racing Club", "position": "LD", "baseMedia": 76.0}, {"name": "Santiago Sosa", "club": "Racing Club", "position": "MC", "baseMedia": 77.0}, {"name": "Gastón Lódico", "club": "Racing Club", "position": "MC", "baseMedia": 75.0}, {"name": "Juan Fernando Quintero", "club": "Racing Club", "position": "MCO", "baseMedia": 78.0}, {"name": "Santiago Solari", "club": "Racing Club", "position": "ED", "baseMedia": 74.0}, {"name": "Johan Carbonero", "club": "Racing Club", "position": "EL", "baseMedia": 75.0}, {"name": "Adrián 'Maravilla' Martínez", "club": "Racing Club", "position": "DC", "baseMedia": 77.0}, {"name": "Rodrigo Rey", "club": "Independiente", "position": "ARQ", "baseMedia": 75.0}, {"name": "Facundo Zabala", "club": "Independiente", "position": "LI", "baseMedia": 76.0}, {"name": "Kevin Lomónaco", "club": "Independiente", "position": "DFC", "baseMedia": 74.0}, {"name": "Juan Fedorco", "club": "Independiente", "position": "DFC", "baseMedia": 73.0}, {"name": "Leonardo Godoy", "club": "Independiente", "position": "LD", "baseMedia": 73.0}, {"name": "Iván Marcone", "club": "Independiente", "position": "MC", "baseMedia": 76.0}, {"name": "Maximiliano Meza", "club": "Independiente", "position": "MC", "baseMedia": 73.0}, {"name": "Luciano Cabral", "club": "Independiente", "position": "MCO", "baseMedia": 69.0}, {"name": "Santiago Montiel", "club": "Independiente", "position": "ED", "baseMedia": 78.0}, {"name": "Matías Abaldo", "club": "Independiente", "position": "EL", "baseMedia": 75.0}, {"name": "Gabriel Ávalos", "club": "Independiente", "position": "DC", "baseMedia": 76.0}, {"name": "Conan Ledesma", "club": "Rosario Central", "position": "ARQ", "baseMedia": 76.0}, {"name": "Agustín Sández", "club": "Rosario Central", "position": "LI", "baseMedia": 73.0}, {"name": "Carlos Quintana", "club": "Rosario Central", "position": "DFC", "baseMedia": 74.0}, {"name": "Facundo Mallo", "club": "Rosario Central", "position": "DFC", "baseMedia": 74.0}, {"name": "Emanuel Coronel", "club": "Rosario Central", "position": "LD", "baseMedia": 73.0}, {"name": "Kevin Ortiz", "club": "Rosario Central", "position": "MC", "baseMedia": 73.0}, {"name": "Franco Ibarra", "club": "Rosario Central", "position": "MC", "baseMedia": 73.0}, {"name": "Ignacio Malcorra", "club": "Rosario Central", "position": "MCO", "baseMedia": 75.0}, {"name": "Ángel Di María", "club": "Rosario Central", "position": "ED", "baseMedia": 82.0}, {"name": "Jaminton Campaz", "club": "Rosario Central", "position": "EL", "baseMedia": 76.0}, {"name": "Marco Ruben", "club": "Rosario Central", "position": "DC", "baseMedia": 74.0}, {"name": "Fernando Muslera", "club": "Estudiantes LP", "position": "ARQ", "baseMedia": 78.0}, {"name": "Gastón Benedetti", "club": "Estudiantes LP", "position": "LI", "baseMedia": 73.0}, {"name": "Facundo Rodríguez", "club": "Estudiantes LP", "position": "DFC", "baseMedia": 74.0}, {"name": "Santiago Flores", "club": "Estudiantes LP", "position": "DFC", "baseMedia": 72.0}, {"name": "Eric Meza", "club": "Estudiantes LP", "position": "LD", "baseMedia": 74.0}, {"name": "Enzo Pérez", "club": "Estudiantes LP", "position": "MC", "baseMedia": 75.0}, {"name": "Alexis Castro", "club": "Estudiantes LP", "position": "MC", "baseMedia": 73.0}, {"name": "José Sosa", "club": "Estudiantes LP", "position": "MCO", "baseMedia": 74.0}, {"name": "Tiago Palacios", "club": "Estudiantes LP", "position": "ED", "baseMedia": 75.0}, {"name": "Edwuin Cetré", "club": "Estudiantes LP", "position": "EL", "baseMedia": 76.0}, {"name": "Guido Carrillo", "club": "Estudiantes LP", "position": "DC", "baseMedia": 76.0}, {"name": "Tomás Marchiori", "club": "Vélez Sarsfield", "position": "ARQ", "baseMedia": 75.0}, {"name": "Elías Gómez", "club": "Vélez Sarsfield", "position": "LI", "baseMedia": 75.0}, {"name": "Emanuel Mammana", "club": "Vélez Sarsfield", "position": "DFC", "baseMedia": 75.0}, {"name": "Patricio Pernicone", "club": "Vélez Sarsfield", "position": "DFC", "baseMedia": 68.0}, {"name": "Joaquín García", "club": "Vélez Sarsfield", "position": "LD", "baseMedia": 73.0}, {"name": "Claudio Baeza", "club": "Vélez Sarsfield", "position": "MC", "baseMedia": 74.0}, {"name": "Lucas Robertone", "club": "Vélez Sarsfield", "position": "MC", "baseMedia": 74.0}, {"name": "Manuel Lanzini", "club": "Vélez Sarsfield", "position": "MCO", "baseMedia": 76.0}, {"name": "Matías Pellegrini", "club": "Vélez Sarsfield", "position": "ED", "baseMedia": 73.0}, {"name": "Diego Valdés", "club": "Vélez Sarsfield", "position": "EL", "baseMedia": 74.0}, {"name": "Braian Romero", "club": "Vélez Sarsfield", "position": "DC", "baseMedia": 73.0}, {"name": "Ezequiel Unsain", "club": "Talleres de Córdoba", "position": "ARQ", "baseMedia": 75.0}, {"name": "Blas Riveros", "club": "Talleres de Córdoba", "position": "LI", "baseMedia": 73.0}, {"name": "Matías Catalán", "club": "Talleres de Córdoba", "position": "DFC", "baseMedia": 73.0}, {"name": "Lucas Suárez", "club": "Talleres de Córdoba", "position": "DFC", "baseMedia": 72.0}, {"name": "Gastón Benavídez", "club": "Talleres de Córdoba", "position": "LD", "baseMedia": 75.0}, {"name": "Federico Fattori", "club": "Talleres de Córdoba", "position": "MC", "baseMedia": 77.0}, {"name": "Matías Galarza", "club": "Talleres de Córdoba", "position": "MC", "baseMedia": 74.0}, {"name": "Franco Cristaldo", "club": "Talleres de Córdoba", "position": "MCO", "baseMedia": 76.0}, {"name": "Diego Valoyes", "club": "Talleres de Córdoba", "position": "ED", "baseMedia": 74.0}, {"name": "Valentín Depietri", "club": "Talleres de Córdoba", "position": "EL", "baseMedia": 68.0}, {"name": "Federico Girotti", "club": "Talleres de Córdoba", "position": "DC", "baseMedia": 75.0}, {"name": "Thiago Cardozo", "club": "Belgrano de Córdoba", "position": "ARQ", "baseMedia": 74.0}, {"name": "Federico Ricca", "club": "Belgrano de Córdoba", "position": "LI", "baseMedia": 72.0}, {"name": "Leonardo Morales", "club": "Belgrano de Córdoba", "position": "DFC", "baseMedia": 74.0}, {"name": "Alexis Maldonado", "club": "Belgrano de Córdoba", "position": "DFC", "baseMedia": 72.0}, {"name": "Gabriel Compagnucci", "club": "Belgrano de Córdoba", "position": "LD", "baseMedia": 74.0}, {"name": "Adrián Sánchez", "club": "Belgrano de Córdoba", "position": "MC", "baseMedia": 72.0}, {"name": "Franco Vázquez", "club": "Belgrano de Córdoba", "position": "MC", "baseMedia": 75.0}, {"name": "Lucas Zelarayán", "club": "Belgrano de Córdoba", "position": "MCO", "baseMedia": 80.0}, {"name": "Emiliano Rigoni", "club": "Belgrano de Córdoba", "position": "ED", "baseMedia": 74.0}, {"name": "Bryan Reyna", "club": "Belgrano de Córdoba", "position": "EL", "baseMedia": 75.0}, {"name": "Nicolás Fernández", "club": "Belgrano de Córdoba", "position": "DC", "baseMedia": 77.0}, {"name": "Nahuel Losada", "club": "Lanús", "position": "ARQ", "baseMedia": 76.0}, {"name": "Sasha Marcich", "club": "Lanús", "position": "LI", "baseMedia": 74.0}, {"name": "Carlos Izquierdoz", "club": "Lanús", "position": "DFC", "baseMedia": 74.0}, {"name": "José Canale", "club": "Lanús", "position": "DFC", "baseMedia": 72.0}, {"name": "Juan José Cáceres", "club": "Lanús", "position": "LD", "baseMedia": 73.0}, {"name": "Agustín Cardozo", "club": "Lanús", "position": "MC", "baseMedia": 72.0}, {"name": "Ramiro Carrera", "club": "Lanús", "position": "MC", "baseMedia": 75.0}, {"name": "Marcelino Moreno", "club": "Lanús", "position": "MCO", "baseMedia": 78.0}, {"name": "Eduardo Salvio", "club": "Lanús", "position": "ED", "baseMedia": 74.0}, {"name": "Felipe Peña Biafore", "club": "Lanús", "position": "EL", "baseMedia": 70.0}, {"name": "Walter Bou", "club": "Lanús", "position": "DC", "baseMedia": 76.0}, {"name": "Orlando Gill", "club": "San Lorenzo", "position": "ARQ", "baseMedia": 72.0}, {"name": "Malcom Braida", "club": "San Lorenzo", "position": "LI", "baseMedia": 74.0}, {"name": "Gastón Hernández", "club": "San Lorenzo", "position": "DFC", "baseMedia": 74.0}, {"name": "Jhohan Romaña", "club": "San Lorenzo", "position": "DFC", "baseMedia": 74.0}, {"name": "Nicolás Tripichio", "club": "San Lorenzo", "position": "LD", "baseMedia": 73.0}, {"name": "Gonzalo Abrego", "club": "San Lorenzo", "position": "MC", "baseMedia": 72.0}, {"name": "Martín Río", "club": "San Lorenzo", "position": "MC", "baseMedia": 72.0}, {"name": "Nahuel Barrios", "club": "San Lorenzo", "position": "MCO", "baseMedia": 72.0}, {"name": "Ezequiel Cerutti", "club": "San Lorenzo", "position": "ED", "baseMedia": 70.0}, {"name": "Matías Reali", "club": "San Lorenzo", "position": "EL", "baseMedia": 73.0}, {"name": "Alexis Cuello", "club": "San Lorenzo", "position": "DC", "baseMedia": 72.0}, {"name": "Hernán Galíndez", "club": "Huracán", "position": "ARQ", "baseMedia": 74.0}, {"name": "César Ibáñez", "club": "Huracán", "position": "LI", "baseMedia": 70.0}, {"name": "Martín Nervo", "club": "Huracán", "position": "DFC", "baseMedia": 73.0}, {"name": "Fabio Pereyra", "club": "Huracán", "position": "DFC", "baseMedia": 72.0}, {"name": "Lucas Blondel", "club": "Huracán", "position": "LD", "baseMedia": 71.0}, {"name": "Leonardo Gil", "club": "Huracán", "position": "MC", "baseMedia": 72.0}, {"name": "Williams Alarcón", "club": "Huracán", "position": "MC", "baseMedia": 75.0}, {"name": "Óscar Romero", "club": "Huracán", "position": "MCO", "baseMedia": 73.0}, {"name": "Federico Vera", "club": "Huracán", "position": "ED", "baseMedia": 70.0}, {"name": "Facundo Waller", "club": "Huracán", "position": "EL", "baseMedia": 72.0}, {"name": "Ramón 'Wanchope' Ábila", "club": "Huracán", "position": "DC", "baseMedia": 74.0}, {"name": "Brayan Cortés", "club": "Argentinos Juniors", "position": "ARQ", "baseMedia": 74.0}, {"name": "Sebastián Prieto", "club": "Argentinos Juniors", "position": "LI", "baseMedia": 72.0}, {"name": "Francisco Álvarez", "club": "Argentinos Juniors", "position": "DFC", "baseMedia": 75.0}, {"name": "Erik Godoy", "club": "Argentinos Juniors", "position": "DFC", "baseMedia": 71.0}, {"name": "Thiago Santamaría", "club": "Argentinos Juniors", "position": "LD", "baseMedia": 73.0}, {"name": "Alan Lescano", "club": "Argentinos Juniors", "position": "MC", "baseMedia": 77.0}, {"name": "Nicolás Oroz", "club": "Argentinos Juniors", "position": "MC", "baseMedia": 74.0}, {"name": "Hernán López Muñoz", "club": "Argentinos Juniors", "position": "MCO", "baseMedia": 75.0}, {"name": "Gastón Verón", "club": "Argentinos Juniors", "position": "ED", "baseMedia": 69.0}, {"name": "Joaquín Gho", "club": "Argentinos Juniors", "position": "EL", "baseMedia": 68.0}, {"name": "Tomás Molina", "club": "Argentinos Juniors", "position": "DC", "baseMedia": 72.0}, {"name": "Juan Pablo Cozzani", "club": "Platense", "position": "ARQ", "baseMedia": 73.0}, {"name": "Tomás Silva", "club": "Platense", "position": "LI", "baseMedia": 69.0}, {"name": "Ignacio Vázquez", "club": "Platense", "position": "DFC", "baseMedia": 74.0}, {"name": "Víctor Cuesta", "club": "Platense", "position": "DFC", "baseMedia": 73.0}, {"name": "Juan Saborido", "club": "Platense", "position": "LD", "baseMedia": 70.0}, {"name": "Maximiliano Amarfil", "club": "Platense", "position": "MC", "baseMedia": 70.0}, {"name": "Leonel Picco", "club": "Platense", "position": "MC", "baseMedia": 73.0}, {"name": "Franco Zapiola", "club": "Platense", "position": "MCO", "baseMedia": 71.0}, {"name": "Guido Mainero", "club": "Platense", "position": "ED", "baseMedia": 70.0}, {"name": "Gastón Togni", "club": "Platense", "position": "EL", "baseMedia": 73.0}, {"name": "Nicolás 'Diente' López", "club": "Platense", "position": "DC", "baseMedia": 74.0}, {"name": "Matías Borgogno", "club": "Defensa y Justicia", "position": "ARQ", "baseMedia": 73.0}, {"name": "Fernando Román", "club": "Defensa y Justicia", "position": "LI", "baseMedia": 68.0}, {"name": "David Martínez", "club": "Defensa y Justicia", "position": "DFC", "baseMedia": 73.0}, {"name": "Damián Fernández", "club": "Defensa y Justicia", "position": "DFC", "baseMedia": 71.0}, {"name": "Ezequiel Cannavo", "club": "Defensa y Justicia", "position": "LD", "baseMedia": 70.0}, {"name": "Éver Banega", "club": "Defensa y Justicia", "position": "MC", "baseMedia": 76.0}, {"name": "Aaron Molinas", "club": "Defensa y Justicia", "position": "MC", "baseMedia": 74.0}, {"name": "David Barbona", "club": "Defensa y Justicia", "position": "MCO", "baseMedia": 70.0}, {"name": "Julián López", "club": "Defensa y Justicia", "position": "ED", "baseMedia": 70.0}, {"name": "Domingo Blanco", "club": "Defensa y Justicia", "position": "EL", "baseMedia": 71.0}, {"name": "Leandro Fernández", "club": "Defensa y Justicia", "position": "DC", "baseMedia": 68.0}, {"name": "Luis Ingolotti", "club": "Atlético Tucumán", "position": "ARQ", "baseMedia": 69.0}, {"name": "Juan Infante", "club": "Atlético Tucumán", "position": "LI", "baseMedia": 66.0}, {"name": "Juan Gabriel Rodríguez", "club": "Atlético Tucumán", "position": "DFC", "baseMedia": 73.0}, {"name": "Gastón Suso", "club": "Atlético Tucumán", "position": "DFC", "baseMedia": 72.0}, {"name": "Leonel Di Plácido", "club": "Atlético Tucumán", "position": "LD", "baseMedia": 71.0}, {"name": "Kevin Ortiz", "club": "Atlético Tucumán", "position": "MC", "baseMedia": 71.0}, {"name": "Guillermo Acosta", "club": "Atlético Tucumán", "position": "MC", "baseMedia": 72.0}, {"name": "Martín Benítez", "club": "Atlético Tucumán", "position": "MCO", "baseMedia": 72.0}, {"name": "Renzo Tesuri", "club": "Atlético Tucumán", "position": "ED", "baseMedia": 71.0}, {"name": "Ramiro Ruiz Rodríguez", "club": "Atlético Tucumán", "position": "EL", "baseMedia": 69.0}, {"name": "Leandro Díaz", "club": "Atlético Tucumán", "position": "DC", "baseMedia": 74.0}, {"name": "Matías Mansilla", "club": "Unión de Santa Fe", "position": "ARQ", "baseMedia": 72.0}, {"name": "Bruno Pittón", "club": "Unión de Santa Fe", "position": "LI", "baseMedia": 67.0}, {"name": "Juan Pablo Ludueña", "club": "Unión de Santa Fe", "position": "DFC", "baseMedia": 68.0}, {"name": "Lautaro Vargas", "club": "Unión de Santa Fe", "position": "DFC", "baseMedia": 71.0}, {"name": "Juan de Dios Pintado", "club": "Unión de Santa Fe", "position": "LD", "baseMedia": 72.0}, {"name": "Víctor Ignacio Malcorra", "club": "Unión de Santa Fe", "position": "MC", "baseMedia": 75.0}, {"name": "Mauro Pittón", "club": "Unión de Santa Fe", "position": "MC", "baseMedia": 71.0}, {"name": "Augusto Solari", "club": "Unión de Santa Fe", "position": "MCO", "baseMedia": 68.0}, {"name": "Julián Palacios", "club": "Unión de Santa Fe", "position": "ED", "baseMedia": 73.0}, {"name": "Franco Fragapane", "club": "Unión de Santa Fe", "position": "EL", "baseMedia": 69.0}, {"name": "Cristian Tarragona", "club": "Unión de Santa Fe", "position": "DC", "baseMedia": 73.0}, {"name": "Ezequiel Centurión", "club": "Independiente Rivadavia", "position": "ARQ", "baseMedia": 71.0}, {"name": "Luciano Gómez", "club": "Independiente Rivadavia", "position": "LI", "baseMedia": 72.0}, {"name": "Sheyko Studer", "club": "Independiente Rivadavia", "position": "DFC", "baseMedia": 73.0}, {"name": "Leonard Costa", "club": "Independiente Rivadavia", "position": "DFC", "baseMedia": 69.0}, {"name": "Alex Vigo", "club": "Independiente Rivadavia", "position": "LD", "baseMedia": 70.0}, {"name": "José Florentín", "club": "Independiente Rivadavia", "position": "MC", "baseMedia": 73.0}, {"name": "Franco Romero", "club": "Independiente Rivadavia", "position": "MC", "baseMedia": 70.0}, {"name": "Leonel Bucca", "club": "Independiente Rivadavia", "position": "MCO", "baseMedia": 70.0}, {"name": "Maximiliano Salas", "club": "Independiente Rivadavia", "position": "ED", "baseMedia": 75.0}, {"name": "Gonzalo Ríos", "club": "Independiente Rivadavia", "position": "EL", "baseMedia": 69.0}, {"name": "Alex Arce", "club": "Independiente Rivadavia", "position": "DC", "baseMedia": 76.0}, {"name": "Felipe Zenobio", "club": "Tigre", "position": "ARQ", "baseMedia": 70.0}, {"name": "Federico Álvarez", "club": "Tigre", "position": "LI", "baseMedia": 66.0}, {"name": "Joaquín Laso", "club": "Tigre", "position": "DFC", "baseMedia": 71.0}, {"name": "Gian Nardelli", "club": "Tigre", "position": "DFC", "baseMedia": 69.0}, {"name": "Guillermo Soto", "club": "Tigre", "position": "LD", "baseMedia": 67.0}, {"name": "Jalil Elías", "club": "Tigre", "position": "MC", "baseMedia": 71.0}, {"name": "Bruno Leyes", "club": "Tigre", "position": "MC", "baseMedia": 70.0}, {"name": "Gonzalo Martínez", "club": "Tigre", "position": "MCO", "baseMedia": 73.0}, {"name": "Jabes Saralegui", "club": "Tigre", "position": "ED", "baseMedia": 70.0}, {"name": "Ian Subiabre", "club": "Tigre", "position": "EL", "baseMedia": 71.0}, {"name": "Ignacio Russo", "club": "Tigre", "position": "DC", "baseMedia": 71.0}, {"name": "Marcos Ledesma", "club": "Instituto de Córdoba", "position": "ARQ", "baseMedia": 70.0}, {"name": "Diego Sosa", "club": "Instituto de Córdoba", "position": "LI", "baseMedia": 70.0}, {"name": "Jonathan Galván", "club": "Instituto de Córdoba", "position": "DFC", "baseMedia": 70.0}, {"name": "Fernando Alarcón", "club": "Instituto de Córdoba", "position": "DFC", "baseMedia": 68.0}, {"name": "Giuliano Cerato", "club": "Instituto de Córdoba", "position": "LD", "baseMedia": 71.0}, {"name": "Franco Moyano", "club": "Instituto de Córdoba", "position": "MC", "baseMedia": 68.0}, {"name": "Gastón Lodico", "club": "Instituto de Córdoba", "position": "MC", "baseMedia": 72.0}, {"name": "Alex Luna", "club": "Instituto de Córdoba", "position": "MCO", "baseMedia": 75.0}, {"name": "Jhon Córdoba", "club": "Instituto de Córdoba", "position": "ED", "baseMedia": 70.0}, {"name": "Damián Puebla", "club": "Instituto de Córdoba", "position": "EL", "baseMedia": 71.0}, {"name": "Facundo Suárez", "club": "Instituto de Córdoba", "position": "DC", "baseMedia": 66.0}, {"name": "Gabriel Arias", "club": "Newell's Old Boys", "position": "ARQ", "baseMedia": 73.0}, {"name": "Ángelo Martino", "club": "Newell's Old Boys", "position": "LI", "baseMedia": 73.0}, {"name": "Lautaro Giannetti", "club": "Newell's Old Boys", "position": "DFC", "baseMedia": 69.0}, {"name": "Ian Glavinovich", "club": "Newell's Old Boys", "position": "DFC", "baseMedia": 68.0}, {"name": "Armando Méndez", "club": "Newell's Old Boys", "position": "LD", "baseMedia": 70.0}, {"name": "Luca Regiardo", "club": "Newell's Old Boys", "position": "MC", "baseMedia": 68.0}, {"name": "Rodrigo Fernández Cedrés", "club": "Newell's Old Boys", "position": "MC", "baseMedia": 72.0}, {"name": "Mateo García", "club": "Newell's Old Boys", "position": "MCO", "baseMedia": 69.0}, {"name": "Walter Mazzantti", "club": "Newell's Old Boys", "position": "ED", "baseMedia": 69.0}, {"name": "Ramiro Sordo", "club": "Newell's Old Boys", "position": "EL", "baseMedia": 72.0}, {"name": "Matías Cóccaro", "club": "Newell's Old Boys", "position": "DC", "baseMedia": 70.0}, {"name": "Alan Aguerre", "club": "Central Córdoba (SdE)", "position": "ARQ", "baseMedia": 70.0}, {"name": "Leonardo Marchi", "club": "Central Córdoba (SdE)", "position": "LI", "baseMedia": 65.0}, {"name": "Felipe Aguilar", "club": "Central Córdoba (SdE)", "position": "DFC", "baseMedia": 71.0}, {"name": "Alejandro Maciel", "club": "Central Córdoba (SdE)", "position": "DFC", "baseMedia": 69.0}, {"name": "Santiago Moyano", "club": "Central Córdoba (SdE)", "position": "LD", "baseMedia": 66.0}, {"name": "Lucas González", "club": "Central Córdoba (SdE)", "position": "MC", "baseMedia": 71.0}, {"name": "Cristian Vega", "club": "Central Córdoba (SdE)", "position": "MC", "baseMedia": 69.0}, {"name": "Rodrigo Atencio", "club": "Central Córdoba (SdE)", "position": "MCO", "baseMedia": 70.0}, {"name": "Leonardo Sequeira", "club": "Central Córdoba (SdE)", "position": "ED", "baseMedia": 69.0}, {"name": "Horacio Tijanovich", "club": "Central Córdoba (SdE)", "position": "EL", "baseMedia": 68.0}, {"name": "Michael Santos", "club": "Central Córdoba (SdE)", "position": "DC", "baseMedia": 71.0}, {"name": "Juan Espínola", "club": "Barracas Central", "position": "ARQ", "baseMedia": 71.0}, {"name": "Rodrigo Insua", "club": "Barracas Central", "position": "LI", "baseMedia": 72.0}, {"name": "Yonatthan Rak", "club": "Barracas Central", "position": "DFC", "baseMedia": 70.0}, {"name": "Nicolás Demartini", "club": "Barracas Central", "position": "DFC", "baseMedia": 68.0}, {"name": "Rafael Barrios", "club": "Barracas Central", "position": "LD", "baseMedia": 69.0}, {"name": "Iván Tapia", "club": "Barracas Central", "position": "MC", "baseMedia": 71.0}, {"name": "Yeison Gordillo", "club": "Barracas Central", "position": "MC", "baseMedia": 66.0}, {"name": "Rodrigo Bogarín", "club": "Barracas Central", "position": "MCO", "baseMedia": 68.0}, {"name": "Gonzalo Morales", "club": "Barracas Central", "position": "ED", "baseMedia": 70.0}, {"name": "Nicolás Orsini", "club": "Barracas Central", "position": "EL", "baseMedia": 69.0}, {"name": "Facundo Bruera", "club": "Barracas Central", "position": "DC", "baseMedia": 70.0}, {"name": "Nelson Insfrán", "club": "Gimnasia LP", "position": "ARQ", "baseMedia": 74.0}, {"name": "Pedro Silva Torrejón", "club": "Gimnasia LP", "position": "LI", "baseMedia": 68.0}, {"name": "Germán Conti", "club": "Gimnasia LP", "position": "DFC", "baseMedia": 73.0}, {"name": "Enzo Martínez", "club": "Gimnasia LP", "position": "DFC", "baseMedia": 72.0}, {"name": "Alexis Steimbach", "club": "Gimnasia LP", "position": "LD", "baseMedia": 65.0}, {"name": "Ignacio Fernández", "club": "Gimnasia LP", "position": "MC", "baseMedia": 75.0}, {"name": "Mateo Seoane", "club": "Gimnasia LP", "position": "MC", "baseMedia": 67.0}, {"name": "Nicolás Barros Schelotto", "club": "Gimnasia LP", "position": "MCO", "baseMedia": 66.0}, {"name": "Manuel Panaro", "club": "Gimnasia LP", "position": "ED", "baseMedia": 66.0}, {"name": "Brian Andrada", "club": "Gimnasia LP", "position": "EL", "baseMedia": 64.0}, {"name": "Jorge de Asís", "club": "Gimnasia LP", "position": "DC", "baseMedia": 65.0}, {"name": "César Rigamonti", "club": "Gimnasia y Esgrima (M)", "position": "ARQ", "baseMedia": 70.0}, {"name": "Facundo Lencioni", "club": "Gimnasia y Esgrima (M)", "position": "LI", "baseMedia": 68.0}, {"name": "Ezequiel Muñoz", "club": "Gimnasia y Esgrima (M)", "position": "DFC", "baseMedia": 72.0}, {"name": "Maximiliano Padilla", "club": "Gimnasia y Esgrima (M)", "position": "DFC", "baseMedia": 66.0}, {"name": "Ismael Cortez", "club": "Gimnasia y Esgrima (M)", "position": "LD", "baseMedia": 67.0}, {"name": "Tomás O'Connor", "club": "Gimnasia y Esgrima (M)", "position": "MC", "baseMedia": 69.0}, {"name": "Ulises Sánchez", "club": "Gimnasia y Esgrima (M)", "position": "MC", "baseMedia": 72.0}, {"name": "Tomás Ortíz", "club": "Gimnasia y Esgrima (M)", "position": "MCO", "baseMedia": 67.0}, {"name": "Ignacio Sabatini", "club": "Gimnasia y Esgrima (M)", "position": "ED", "baseMedia": 67.0}, {"name": "Matías Vargas", "club": "Gimnasia y Esgrima (M)", "position": "EL", "baseMedia": 78.0}, {"name": "Santiago Rodríguez", "club": "Gimnasia y Esgrima (M)", "position": "DC", "baseMedia": 69.0}, {"name": "Diego Rodríguez", "club": "Banfield", "position": "ARQ", "baseMedia": 73.0}, {"name": "Ignacio Abraham", "club": "Banfield", "position": "LI", "baseMedia": 69.0}, {"name": "Nicolás Meriano", "club": "Banfield", "position": "DFC", "baseMedia": 70.0}, {"name": "Nehuén Paz", "club": "Banfield", "position": "DFC", "baseMedia": 70.0}, {"name": "Santiago López García", "club": "Banfield", "position": "LD", "baseMedia": 70.0}, {"name": "Lautaro Ríos", "club": "Banfield", "position": "MC", "baseMedia": 67.0}, {"name": "Yonathan Rodríguez", "club": "Banfield", "position": "MC", "baseMedia": 70.0}, {"name": "Matías González", "club": "Banfield", "position": "MCO", "baseMedia": 66.0}, {"name": "David Zalazar", "club": "Banfield", "position": "ED", "baseMedia": 68.0}, {"name": "Tomás Adoryán", "club": "Banfield", "position": "EL", "baseMedia": 67.0}, {"name": "Bruno Sepúlveda", "club": "Banfield", "position": "DC", "baseMedia": 68.0}, {"name": "Iván Mauricio Arboleda", "club": "Sarmiento de Junín", "position": "ARQ", "baseMedia": 68.0}, {"name": "Gabriel Díaz Núñez", "club": "Sarmiento de Junín", "position": "LI", "baseMedia": 68.0}, {"name": "Agustín Seyral", "club": "Sarmiento de Junín", "position": "DFC", "baseMedia": 66.0}, {"name": "Juan Manuel Insaurralde", "club": "Sarmiento de Junín", "position": "DFC", "baseMedia": 68.0}, {"name": "Juan Manuel Cabrera", "club": "Sarmiento de Junín", "position": "LD", "baseMedia": 67.0}, {"name": "Cristian Zabala", "club": "Sarmiento de Junín", "position": "MC", "baseMedia": 71.0}, {"name": "Mauricio Martínez", "club": "Sarmiento de Junín", "position": "MC", "baseMedia": 71.0}, {"name": "Osmar Giménez", "club": "Sarmiento de Junín", "position": "MCO", "baseMedia": 64.0}, {"name": "Joaquín Gho", "club": "Sarmiento de Junín", "position": "ED", "baseMedia": 68.0}, {"name": "Nicolás Pasquini", "club": "Sarmiento de Junín", "position": "EL", "baseMedia": 69.0}, {"name": "Junior Marabel", "club": "Sarmiento de Junín", "position": "DC", "baseMedia": 70.0}, {"name": "Ignacio Arce", "club": "Deportivo Riestra", "position": "ARQ", "baseMedia": 74.0}, {"name": "Rodrigo Gallo", "club": "Deportivo Riestra", "position": "LI", "baseMedia": 64.0}, {"name": "Carlos Quintana", "club": "Deportivo Riestra", "position": "DFC", "baseMedia": 74.0}, {"name": "Alan Barrionuevo", "club": "Deportivo Riestra", "position": "DFC", "baseMedia": 67.0}, {"name": "Jonatan Goitia", "club": "Deportivo Riestra", "position": "LD", "baseMedia": 67.0}, {"name": "Milton Céliz", "club": "Deportivo Riestra", "position": "MC", "baseMedia": 67.0}, {"name": "Pablo Monje", "club": "Deportivo Riestra", "position": "MC", "baseMedia": 66.0}, {"name": "Matías García", "club": "Deportivo Riestra", "position": "MCO", "baseMedia": 66.0}, {"name": "Walter Acuña", "club": "Deportivo Riestra", "position": "ED", "baseMedia": 66.0}, {"name": "Antony Alonso", "club": "Deportivo Riestra", "position": "EL", "baseMedia": 67.0}, {"name": "Jonathan Herrera", "club": "Deportivo Riestra", "position": "DC", "baseMedia": 68.0}, {"name": "Sebastián Moyano", "club": "Aldosivi", "position": "ARQ", "baseMedia": 69.0}, {"name": "Lucas Rodríguez", "club": "Aldosivi", "position": "LI", "baseMedia": 65.0}, {"name": "Leonardo Sigali", "club": "Aldosivi", "position": "DFC", "baseMedia": 72.0}, {"name": "Gonzalo Soto", "club": "Aldosivi", "position": "DFC", "baseMedia": 66.0}, {"name": "Rodrigo González", "club": "Aldosivi", "position": "LD", "baseMedia": 68.0}, {"name": "Alan Sosa", "club": "Aldosivi", "position": "MC", "baseMedia": 65.0}, {"name": "Marcelo Esponda", "club": "Aldosivi", "position": "MC", "baseMedia": 65.0}, {"name": "Valentín Larralde", "club": "Aldosivi", "position": "MCO", "baseMedia": 65.0}, {"name": "Nicolás Laméndola", "club": "Aldosivi", "position": "ED", "baseMedia": 65.0}, {"name": "Agustín Alonso", "club": "Aldosivi", "position": "EL", "baseMedia": 65.0}, {"name": "Andrés Vombergar", "club": "Aldosivi", "position": "DC", "baseMedia": 73.0}, {"name": "Manuel Vicentini", "club": "Colón de Santa Fe", "position": "ARQ", "baseMedia": 64.0}, {"name": "Facundo Castet", "club": "Colón de Santa Fe", "position": "LI", "baseMedia": 65.0}, {"name": "Hernán Lópes", "club": "Colón de Santa Fe", "position": "DFC", "baseMedia": 66.0}, {"name": "Paolo Goltz", "club": "Colón de Santa Fe", "position": "DFC", "baseMedia": 66.0}, {"name": "Ezequiel Herrera", "club": "Colón de Santa Fe", "position": "LD", "baseMedia": 66.0}, {"name": "Sebastián Prediger", "club": "Colón de Santa Fe", "position": "MC", "baseMedia": 66.0}, {"name": "Nicolás Talpone", "club": "Colón de Santa Fe", "position": "MC", "baseMedia": 66.0}, {"name": "Christian Bernardi", "club": "Colón de Santa Fe", "position": "MCO", "baseMedia": 67.0}, {"name": "Federico Jourdan", "club": "Colón de Santa Fe", "position": "ED", "baseMedia": 66.0}, {"name": "Ignacio Lago", "club": "Colón de Santa Fe", "position": "EL", "baseMedia": 66.0}, {"name": "Javier Toledo", "club": "Colón de Santa Fe", "position": "DC", "baseMedia": 66.0}, {"name": "Lucas Bruera", "club": "Estudiantes (RC)", "position": "ARQ", "baseMedia": 66.0}, {"name": "Ignacio Abraham", "club": "Estudiantes (RC)", "position": "LI", "baseMedia": 65.0}, {"name": "Gonzalo Maffini", "club": "Estudiantes (RC)", "position": "DFC", "baseMedia": 66.0}, {"name": "Marcio Gómez", "club": "Estudiantes (RC)", "position": "DFC", "baseMedia": 65.0}, {"name": "Valentín Fenoglio", "club": "Estudiantes (RC)", "position": "LD", "baseMedia": 65.0}, {"name": "Alejandro Cabrera", "club": "Estudiantes (RC)", "position": "MC", "baseMedia": 68.0}, {"name": "Francisco Romero", "club": "Estudiantes (RC)", "position": "MC", "baseMedia": 63.0}, {"name": "Tomás González", "club": "Estudiantes (RC)", "position": "MCO", "baseMedia": 65.0}, {"name": "Nahuel Cainelli", "club": "Estudiantes (RC)", "position": "ED", "baseMedia": 65.0}, {"name": "Mauro Valiente", "club": "Estudiantes (RC)", "position": "EL", "baseMedia": 65.0}, {"name": "Yeison Moreno", "club": "Estudiantes (RC)", "position": "DC", "baseMedia": 64.0}, {"name": "Mariano Monllor", "club": "Ferro Carril Oeste", "position": "ARQ", "baseMedia": 65.0}, {"name": "Martín Rodríguez", "club": "Ferro Carril Oeste", "position": "LI", "baseMedia": 64.0}, {"name": "Patricio Boolsen", "club": "Ferro Carril Oeste", "position": "DFC", "baseMedia": 66.0}, {"name": "Gabriel Díaz", "club": "Ferro Carril Oeste", "position": "DFC", "baseMedia": 65.0}, {"name": "Federico Murillo", "club": "Ferro Carril Oeste", "position": "LD", "baseMedia": 65.0}, {"name": "Juan Fernandes Pinto", "club": "Ferro Carril Oeste", "position": "MC", "baseMedia": 65.0}, {"name": "Nicolás Gómez", "club": "Ferro Carril Oeste", "position": "MC", "baseMedia": 64.0}, {"name": "Ricardo Blanco", "club": "Ferro Carril Oeste", "position": "MCO", "baseMedia": 66.0}, {"name": "Gastón Moreyra", "club": "Ferro Carril Oeste", "position": "ED", "baseMedia": 65.0}, {"name": "Alexander Díaz", "club": "Ferro Carril Oeste", "position": "EL", "baseMedia": 66.0}, {"name": "Mateo Levato", "club": "Ferro Carril Oeste", "position": "DC", "baseMedia": 65.0}];
    const LEGENDS = [{"name": "Miguel Á. 'Pepé' Santoro", "club": "Independiente", "position": "ARQ", "baseMedia": 82.0, "rarity": "leyenda"}, {"name": "Amadeo Carrizo", "club": "River Plate", "position": "ARQ", "baseMedia": 83.0, "rarity": "leyenda"}, {"name": "Daniel Passarella", "club": "River Plate", "position": "DFC", "baseMedia": 87.0, "rarity": "leyenda"}, {"name": "Juan Román Riquelme", "club": "Boca Juniors", "position": "MCO", "baseMedia": 90.0, "rarity": "leyenda"}, {"name": "Ricardo Bochini", "club": "Independiente", "position": "MCO", "baseMedia": 91.0, "rarity": "leyenda"}, {"name": "Diego Milito", "club": "Racing Club", "position": "DC", "baseMedia": 84.0, "rarity": "leyenda"}, {"name": "Arsenio Erico", "club": "Independiente", "position": "DC", "baseMedia": 85.0, "rarity": "leyenda"}, {"name": "Mario Kempes", "club": "Rosario Central", "position": "DC", "baseMedia": 86.0, "rarity": "leyenda"}, {"name": "Carlos Tevez", "club": "Boca Juniors", "position": "DC", "baseMedia": 88.0, "rarity": "leyenda"}, {"name": "Gabriel Batistuta", "club": "Boca Juniors", "position": "DC", "baseMedia": 89.0, "rarity": "leyenda"}];

    const POSITION_CATEGORIES = {
        ARQ: 'ARQUERO',
        LI: 'DEFENSA',
        DFC: 'DEFENSA',
        CEN: 'DEFENSA',
        LD: 'DEFENSA',
        MC: 'MEDIOCAMPO',
        MCO: 'MEDIOCAMPO',
        ED: 'DELANTERO',
        DC: 'DELANTERO',
        EL: 'DELANTERO',
        EI: 'DELANTERO'
    };

    const FORMATION_SLOTS = ['ARQ', 'LI', 'DFC', 'DFC', 'LD', 'MC', 'MC', 'MCO', 'EI', 'DC', 'ED'];

    const CUP_ROUNDS = [
        { key: 'DIECISEISAVOS', name: 'Dieciseisavos de final', boost: -2, pBuenos: 0.00, pInter: 0.30, pMalos: 0.70 },
        { key: 'OCTAVOS', name: 'Octavos de final', boost: 0, pBuenos: 0.05, pInter: 0.50, pMalos: 0.45 },
        { key: 'CUARTOS', name: 'Cuartos de final', boost: 2, pBuenos: 0.25, pInter: 0.50, pMalos: 0.25 },
        { key: 'SEMIFINAL', name: 'Semifinal', boost: 4, pBuenos: 0.50, pInter: 0.35, pMalos: 0.15 },
        { key: 'FINAL', name: 'Final', boost: 8, pBuenos: 0.65, pInter: 0.25, pMalos: 0.10 }
    ];

    const BASE_CLASSIC_PAIRS = [
        ['Boca Juniors', 'River Plate'],
        ['Racing Club', 'Independiente'],
        ['Rosario Central', "Newell's Old Boys"],
        ['San Lorenzo', 'Huracán'],
        ['Estudiantes LP', 'Gimnasia LP'],
        ['Belgrano de Córdoba', 'Talleres de Córdoba'],
        ['Lanús', 'Banfield'],
        ['Vélez Sarsfield', 'Unión de Santa Fe'],
        ['Argentinos Juniors', 'Platense'],
        ['Defensa y Justicia', 'Sarmiento de Junín'],
        ['Atlético Tucumán', 'Central Córdoba (SdE)'],
        ['Instituto de Córdoba', 'Estudiantes (RC)'],
        ['Independiente Rivadavia', 'Gimnasia y Esgrima (M)'],
        ['Tigre', 'Barracas Central']
    ];

    function isExactPosition(p1, p2) {
        if (p1 === p2) return true;
        if ((p1 === 'DFC' || p1 === 'CEN') && (p2 === 'DFC' || p2 === 'CEN')) return true;
        if ((p1 === 'EL' || p1 === 'EI') && (p2 === 'EL' || p2 === 'EI')) return true;
        return false;
    }

    function getCategory(pos) {
        return POSITION_CATEGORIES[pos] || 'DELANTERO';
    }

    function positionPriority(pos) {
        const cat = getCategory(pos);
        if (cat === 'DELANTERO') return 1;
        if (cat === 'MEDIOCAMPO') return 2;
        if (cat === 'DEFENSA') return 3;
        return 4;
    }

    function createTeam(name) {
        return {
            name: (name && name.trim()) ? name.trim() : 'ChiquiTeam',
            slots: FORMATION_SLOTS.map((pos, idx) => ({
                slotIndex: idx,
                requiredPosition: pos,
                requiredCategory: getCategory(pos),
                isEmpty: true,
                player: null,
                effectiveMedia: 0,
                penalty: 0
            }))
        };
    }

    function getEffectiveTeamRating(team) {
        const filled = team.slots.filter(s => !s.isEmpty);
        if (filled.length === 0) return 0;
        return filled.reduce((acc, s) => acc + s.effectiveMedia, 0) / filled.length;
    }

    function calculateProjectedFit(player, team) {
        const exact = team.slots.find(s => s.isEmpty && isExactPosition(s.requiredPosition, player.nativePosition || player.position));
        if (exact) return 'optima';
        const sameCat = team.slots.find(s => s.isEmpty && s.requiredCategory === getCategory(player.nativePosition || player.position));
        if (sameCat) return 'penalidad-cat';
        return 'penalidad-diff';
    }

    function assignPlayerToTeam(team, player) {
        const pos = player.nativePosition || player.position;
        let slot = team.slots.find(s => s.isEmpty && isExactPosition(s.requiredPosition, pos));
        if (!slot) slot = team.slots.find(s => s.isEmpty && s.requiredCategory === getCategory(pos));
        if (!slot) slot = team.slots.find(s => s.isEmpty);
        if (slot) {
            slot.isEmpty = false;
            slot.player = { ...player, nativePosition: pos };
            let penalty = 0;
            if (isExactPosition(slot.requiredPosition, pos)) {
                penalty = 0;
            } else if (slot.requiredCategory === getCategory(pos)) {
                penalty = 3;
            } else {
                penalty = 12;
            }
            slot.penalty = penalty;
            slot.effectiveMedia = Math.max(40, player.effectiveBaseMedia - penalty);
        }
        return slot;
    }

    function rollRarity(basePlayer, isGk, excludedNames, idolPool) {
        const roll = Math.random();
        if (roll < 0.0040) {
            const candidates = idolPool.filter(p => (isGk ? p.position === 'ARQ' : p.position !== 'ARQ') && !excludedNames.includes(p.name));
            if (candidates.length > 0) {
                const idol = candidates[Math.floor(Math.random() * candidates.length)];
                return {
                    name: idol.name,
                    club: idol.club,
                    position: idol.position,
                    nativePosition: idol.position,
                    category: getCategory(idol.position),
                    baseMedia: idol.baseMedia,
                    effectiveBaseMedia: idol.baseMedia,
                    bonusMedia: 0,
                    rarity: 'leyenda'
                };
            }
        }
        if (roll < 0.0110) {
            return {
                name: basePlayer.name,
                club: basePlayer.club,
                position: basePlayer.position,
                nativePosition: basePlayer.position,
                category: getCategory(basePlayer.position),
                baseMedia: basePlayer.baseMedia,
                effectiveBaseMedia: basePlayer.baseMedia + 5,
                bonusMedia: 5,
                rarity: 'diamante'
            };
        }
        if (roll < 0.0250) {
            return {
                name: basePlayer.name,
                club: basePlayer.club,
                position: basePlayer.position,
                nativePosition: basePlayer.position,
                category: getCategory(basePlayer.position),
                baseMedia: basePlayer.baseMedia,
                effectiveBaseMedia: basePlayer.baseMedia + 3,
                bonusMedia: 3,
                rarity: 'oro'
            };
        }
        return {
            name: basePlayer.name,
            club: basePlayer.club,
            position: basePlayer.position,
            nativePosition: basePlayer.position,
            category: getCategory(basePlayer.position),
            baseMedia: basePlayer.baseMedia,
            effectiveBaseMedia: basePlayer.baseMedia,
            bonusMedia: 0,
            rarity: 'normal'
        };
    }

    function pickGoalkeeperChoices(gkPool, idolPool, team) {
        const copy = [...gkPool];
        const result = [];
        const excluded = [];
        for (let i = 0; i < 4 && copy.length > 0; i++) {
            const idx = Math.floor(Math.random() * copy.length);
            const chosen = copy.splice(idx, 1)[0];
            const rolled = rollRarity(chosen, true, excluded, idolPool);
            rolled.index = i;
            rolled.projectedFit = calculateProjectedFit(rolled, team);
            result.push(rolled);
            excluded.push(rolled.name);
        }
        return result;
    }

    function pickFieldPlayerChoices(fpPool, idolPool, team) {
        const emptyCounts = {};
        team.slots.forEach(s => {
            if (s.isEmpty) {
                emptyCounts[s.requiredCategory] = (emptyCounts[s.requiredCategory] || 0) + 1;
            }
        });

        const copy = [...fpPool];
        const result = [];
        const excluded = [];

        for (let i = 0; i < 4 && copy.length > 0; i++) {
            let totalWeight = 0;
            const weights = copy.map(p => {
                const cat = getCategory(p.position);
                const empty = emptyCounts[cat] || 0;
                const w = 1.0 + (empty * 0.6);
                totalWeight += w;
                return w;
            });

            const roll = Math.random() * totalWeight;
            let cum = 0;
            let chosenIdx = copy.length - 1;
            for (let j = 0; j < copy.length; j++) {
                cum += weights[j];
                if (roll <= cum) {
                    chosenIdx = j;
                    break;
                }
            }

            const chosen = copy.splice(chosenIdx, 1)[0];
            const rolled = rollRarity(chosen, false, excluded, idolPool);
            rolled.index = i;
            rolled.projectedFit = calculateProjectedFit(rolled, team);
            result.push(rolled);
            excluded.push(rolled.name);
        }
        return result;
    }

    function calculateGoalProbability(homeRating, awayRating) {
        return 1.0 / (1.0 + Math.exp(-0.048 * (homeRating - awayRating)));
    }

    function simulateMatch(homeRating, awayRating, homeName, awayName, homeScorers, awayScorers, homeIsUser, userTeam, isKnockout) {
        const pHome = calculateGoalProbability(homeRating, awayRating);
        const events = [];
        let homeGoals = 0;
        let awayGoals = 0;

        for (let m = 1; m <= 90; m++) {
            if (Math.random() < 0.025) {
                const homeScores = Math.random() < pHome;
                let scorer;
                if (homeScores) {
                    homeGoals++;
                    scorer = homeScorers.length > 0 ? homeScorers[Math.floor(Math.random() * homeScorers.length)].name : homeName;
                } else {
                    awayGoals++;
                    scorer = awayScorers.length > 0 ? awayScorers[Math.floor(Math.random() * awayScorers.length)].name : awayName;
                }
                events.push({ minute: m, homeTeamScored: homeScores, scorer });
            }
        }

        const homeGoalsAt90 = homeGoals;
        const awayGoalsAt90 = awayGoals;
        let wentToExtraTime = false;
        let wentToPenalties = false;
        let homePenalties = 0;
        let awayPenalties = 0;
        const penaltyEvents = [];

        if (isKnockout && homeGoals === awayGoals) {
            wentToExtraTime = true;
            for (let m = 91; m <= 120; m++) {
                if (Math.random() < 0.025) {
                    const homeScores = Math.random() < pHome;
                    let scorer;
                    if (homeScores) {
                        homeGoals++;
                        scorer = homeScorers.length > 0 ? homeScorers[Math.floor(Math.random() * homeScorers.length)].name : homeName;
                    } else {
                        awayGoals++;
                        scorer = awayScorers.length > 0 ? awayScorers[Math.floor(Math.random() * awayScorers.length)].name : awayName;
                    }
                    events.push({ minute: m, homeTeamScored: homeScores, scorer });
                }
            }

            if (homeGoals === awayGoals) {
                wentToPenalties = true;
                const homeIsBetter = homeRating >= awayRating;
                const homeAcc = homeIsBetter ? 0.75 : 0.70;
                const awayAcc = homeIsBetter ? 0.70 : 0.75;

                const getKickers = (teamObj, clubName) => {
                    if (teamObj) {
                        const pl = teamObj.slots.filter(s => !s.isEmpty).map(s => s.player);
                        pl.sort((a, b) => positionPriority(a.nativePosition) - positionPriority(b.nativePosition) || b.baseMedia - a.baseMedia);
                        return pl.map(p => p.name);
                    }
                    const pl = PLAYERS.filter(p => p.club.toLowerCase() === clubName.toLowerCase());
                    pl.sort((a, b) => positionPriority(a.position) - positionPriority(b.position) || b.baseMedia - a.baseMedia);
                    return pl.length > 0 ? pl.map(p => p.name) : [clubName];
                };

                const homeKickers = getKickers(homeIsUser ? userTeam : null, homeName);
                const awayKickers = getKickers(!homeIsUser ? userTeam : null, awayName);

                let hScore = 0;
                let aScore = 0;

                for (let r = 1; r <= 5; r++) {
                    const hGoal = Math.random() < homeAcc;
                    if (hGoal) hScore++;
                    const hKicker = homeKickers[(r - 1) % homeKickers.length];
                    penaltyEvents.push({ round: r, isHome: true, kicker: hKicker, scored: hGoal, homeScore: hScore, awayScore: aScore });

                    const hRem = 5 - r;
                    const aRem = 5 - (r - 1);
                    if (hScore > aScore + aRem || aScore > hScore + hRem) break;

                    const aGoal = Math.random() < awayAcc;
                    if (aGoal) aScore++;
                    const aKicker = awayKickers[(r - 1) % awayKickers.length];
                    penaltyEvents.push({ round: r, isHome: false, kicker: aKicker, scored: aGoal, homeScore: hScore, awayScore: aScore });

                    if (hScore > aScore + (5 - r) || aScore > hScore + (5 - r)) break;
                }

                let roundNum = 6;
                while (hScore === aScore) {
                    const hGoal = Math.random() < homeAcc;
                    if (hGoal) hScore++;
                    const hKicker = homeKickers[(roundNum - 1) % homeKickers.length];
                    penaltyEvents.push({ round: roundNum, isHome: true, kicker: hKicker, scored: hGoal, homeScore: hScore, awayScore: aScore });

                    const aGoal = Math.random() < awayAcc;
                    if (aGoal) aScore++;
                    const aKicker = awayKickers[(roundNum - 1) % awayKickers.length];
                    penaltyEvents.push({ round: roundNum, isHome: false, kicker: aKicker, scored: aGoal, homeScore: hScore, awayScore: aScore });
                    roundNum++;
                }

                homePenalties = hScore;
                awayPenalties = aScore;
            }
        }

        const homeWon = wentToPenalties ? (homePenalties > awayPenalties) : (homeGoals > awayGoals);

        return {
            homeGoals,
            awayGoals,
            homeGoalsAt90,
            awayGoalsAt90,
            wentToExtraTime,
            wentToPenalties,
            homePenalties,
            awayPenalties,
            events,
            penaltyEvents,
            homeWon
        };
    }

    let cupState = null;

    function initCupState(teamName) {
        const userTeam = createTeam(teamName);
        const gkPool = PLAYERS.filter(p => p.position === 'ARQ');
        const fpPool = PLAYERS.filter(p => p.position !== 'ARQ');
        const idolPool = [...LEGENDS];
        const choices = pickGoalkeeperChoices(gkPool, idolPool, userTeam);

        cupState = {
            mode: 'CUP',
            userTeam,
            gkPool,
            fpPool,
            idolPool,
            currentDraftRound: 1,
            draftFinished: false,
            rerollsRemaining: 3,
            currentChoices: choices,
            currentCupRoundIndex: 0,
            cupFinished: false,
            userWonCup: false,
            facedClubs: []
        };
    }

    function buildCupGameStateJson() {
        const t = cupState.userTeam;
        return {
            userTeamName: t.name,
            currentDraftRound: cupState.currentDraftRound,
            draftFinished: cupState.draftFinished,
            rerollsRemaining: cupState.rerollsRemaining,
            effectiveTeamRating: Math.round(getEffectiveTeamRating(t)),
            choices: cupState.currentChoices,
            slots: t.slots.map(s => ({
                slotIndex: s.slotIndex,
                requiredPosition: s.requiredPosition,
                requiredCategory: s.requiredCategory,
                isEmpty: s.isEmpty,
                player: s.player ? {
                    name: s.player.name,
                    club: s.player.club,
                    nativePosition: s.player.nativePosition,
                    baseMedia: Math.round(s.player.baseMedia),
                    effectiveBaseMedia: Math.round(s.player.effectiveBaseMedia),
                    bonusMedia: Math.round(s.player.bonusMedia),
                    rarity: s.player.rarity
                } : null,
                effectiveMedia: Math.round(s.effectiveMedia),
                penalty: Math.round(s.penalty)
            })),
            currentCupRoundIndex: cupState.currentCupRoundIndex,
            currentCupRoundName: CUP_ROUNDS[cupState.currentCupRoundIndex].name,
            cupFinished: cupState.cupFinished,
            userWonCup: cupState.userWonCup
        };
    }

    function chooseCupPlayer(choiceIndex) {
        if (cupState.draftFinished || choiceIndex < 0 || choiceIndex >= cupState.currentChoices.length) {
            return { error: 'Elección inválida o draft finalizado' };
        }
        const chosen = cupState.currentChoices[choiceIndex];
        assignPlayerToTeam(cupState.userTeam, chosen);

        cupState.gkPool = cupState.gkPool.filter(p => p.name.toLowerCase() !== chosen.name.toLowerCase());
        cupState.fpPool = cupState.fpPool.filter(p => p.name.toLowerCase() !== chosen.name.toLowerCase());
        cupState.idolPool = cupState.idolPool.filter(p => p.name.toLowerCase() !== chosen.name.toLowerCase());

        if (cupState.currentDraftRound < 11) {
            cupState.currentDraftRound++;
            cupState.currentChoices = pickFieldPlayerChoices(cupState.fpPool, cupState.idolPool, cupState.userTeam);
        } else {
            cupState.draftFinished = true;
            cupState.currentChoices = [];
        }
        return buildCupGameStateJson();
    }

    function rerollCupChoices() {
        if (cupState.draftFinished || cupState.rerollsRemaining <= 0) {
            return { error: 'No quedan re-sorteos' };
        }
        cupState.rerollsRemaining--;
        if (cupState.currentDraftRound === 1) {
            cupState.currentChoices = pickGoalkeeperChoices(cupState.gkPool, cupState.idolPool, cupState.userTeam);
        } else {
            cupState.currentChoices = pickFieldPlayerChoices(cupState.fpPool, cupState.idolPool, cupState.userTeam);
        }
        return buildCupGameStateJson();
    }

    function playNextCupMatch() {
        if (!cupState.draftFinished || cupState.cupFinished) {
            return { error: 'La copa ya finalizó o draft incompleto' };
        }
        const roundDef = CUP_ROUNDS[cupState.currentCupRoundIndex];
        const availableClubs = CLUBS.filter(c => !cupState.facedClubs.includes(c.name));

        const rollTier = Math.random();
        let targetTier = 'MALO';
        if (rollTier < roundDef.pBuenos) targetTier = 'BUENO';
        else if (rollTier < roundDef.pBuenos + roundDef.pInter) targetTier = 'INTERMEDIO';

        let pool = availableClubs.filter(c => c.tier === targetTier);
        if (pool.length === 0) pool = availableClubs;

        let totalWeight = 0;
        pool.forEach(c => totalWeight += c.weight);
        let rollW = Math.random() * totalWeight;
        let opponent = pool[pool.length - 1];
        let cum = 0;
        for (const c of pool) {
            cum += c.weight;
            if (rollW <= cum) {
                opponent = c;
                break;
            }
        }

        cupState.facedClubs.push(opponent.name);

        const userRating = getEffectiveTeamRating(cupState.userTeam);
        const opponentRating = opponent.baseMedia + roundDef.boost;

        const userAttackers = cupState.userTeam.slots
            .filter(s => !s.isEmpty && (s.requiredCategory === 'DELANTERO' || s.requiredCategory === 'MEDIOCAMPO' || s.requiredPosition === 'LI' || s.requiredPosition === 'LD'))
            .map(s => s.player);
        const rivalPlayers = PLAYERS.filter(p => p.club.toLowerCase() === opponent.name.toLowerCase() && p.position !== 'ARQ');

        const sim = simulateMatch(userRating, opponentRating, cupState.userTeam.name, opponent.name, userAttackers, rivalPlayers, true, cupState.userTeam, true);

        const userWon = sim.homeWon;
        const isFinalRound = (cupState.currentCupRoundIndex === CUP_ROUNDS.length - 1);

        if (userWon) {
            if (isFinalRound) {
                cupState.cupFinished = true;
                cupState.userWonCup = true;
            } else {
                cupState.currentCupRoundIndex++;
            }
        } else {
            cupState.cupFinished = true;
            cupState.userWonCup = false;
        }

        return {
            roundName: roundDef.name,
            roundEnum: roundDef.key,
            opponent: {
                name: opponent.name,
                baseMedia: Math.round(opponent.baseMedia)
            },
            userWon,
            isFinalRound,
            homeGoals: sim.homeGoals,
            awayGoals: sim.awayGoals,
            wentToExtraTime: sim.wentToExtraTime,
            homeGoalsAt90: sim.homeGoalsAt90,
            awayGoalsAt90: sim.awayGoalsAt90,
            wentToPenalties: sim.wentToPenalties,
            homePenalties: sim.homePenalties,
            awayPenalties: sim.awayPenalties,
            penaltyKicks: sim.penaltyEvents,
            events: sim.events,
            nextCupRoundName: CUP_ROUNDS[cupState.currentCupRoundIndex].name,
            nextCupRoundIndex: cupState.currentCupRoundIndex,
            cupFinished: cupState.cupFinished,
            userWonCup: cupState.userWonCup
        };
    }

    let leagueStateObj = null;

    function isExcludedLeagueClub(club) {
        return club === 'Ferro Carril Oeste' || club === 'Colón de Santa Fe' || club === 'Aldosivi';
    }

    function initLeagueState(teamName) {
        const userTeam = createTeam(teamName);
        const gkPool = PLAYERS.filter(p => p.position === 'ARQ' && !isExcludedLeagueClub(p.club));
        const fpPool = PLAYERS.filter(p => p.position !== 'ARQ' && !isExcludedLeagueClub(p.club));
        const idolPool = [...LEGENDS];
        const choices = pickGoalkeeperChoices(gkPool, idolPool, userTeam);

        const cpuPairs = BASE_CLASSIC_PAIRS.map(p => [...p]);
        for (let i = cpuPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cpuPairs[i], cpuPairs[j]] = [cpuPairs[j], cpuPairs[i]];
        }

        const zoneA = [];
        const zoneB = [];
        for (const p of cpuPairs) {
            if (Math.random() < 0.5) {
                zoneA.push(p[0]);
                zoneB.push(p[1]);
            } else {
                zoneA.push(p[1]);
                zoneB.push(p[0]);
            }
        }

        zoneA.push(userTeam.name);
        zoneB.push('Deportivo Riestra');

        const order = Array.from({ length: 15 }, (_, i) => i);
        for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
        }

        const shuffledA = order.map(idx => zoneA[idx]);
        const shuffledB = order.map(idx => zoneB[idx]);

        const matchdays = [];
        const circle = Array.from({ length: 15 }, (_, i) => i);

        for (let r = 0; r < 15; r++) {
            const fechaNum = r + 1;
            const matches = [];

            const byeIdx = circle[0];
            const tA_bye = shuffledA[byeIdx];
            const tB_bye = shuffledB[byeIdx];
            const isUserInter = (tA_bye === userTeam.name || tB_bye === userTeam.name);
            matches.push({ matchday: fechaNum, homeTeam: tA_bye, awayTeam: tB_bye, isInterzonal: true, isUserMatch: isUserInter, played: false, homeGoals: 0, awayGoals: 0, events: [] });

            for (let i = 1; i <= 7; i++) {
                const idx1 = circle[i];
                const idx2 = circle[15 - i];
                const t1 = shuffledA[idx1];
                const t2 = shuffledA[idx2];
                const isUserM = (t1 === userTeam.name || t2 === userTeam.name);
                if ((r + i) % 2 === 0) {
                    matches.push({ matchday: fechaNum, homeTeam: t1, awayTeam: t2, isInterzonal: false, isUserMatch: isUserM, played: false, homeGoals: 0, awayGoals: 0, events: [] });
                } else {
                    matches.push({ matchday: fechaNum, homeTeam: t2, awayTeam: t1, isInterzonal: false, isUserMatch: isUserM, played: false, homeGoals: 0, awayGoals: 0, events: [] });
                }
            }

            for (let i = 1; i <= 7; i++) {
                const idx1 = circle[i];
                const idx2 = circle[15 - i];
                const t1 = shuffledB[idx1];
                const t2 = shuffledB[idx2];
                const isUserM = (t1 === userTeam.name || t2 === userTeam.name);
                if ((r + i) % 2 === 0) {
                    matches.push({ matchday: fechaNum, homeTeam: t1, awayTeam: t2, isInterzonal: false, isUserMatch: isUserM, played: false, homeGoals: 0, awayGoals: 0, events: [] });
                } else {
                    matches.push({ matchday: fechaNum, homeTeam: t2, awayTeam: t1, isInterzonal: false, isUserMatch: isUserM, played: false, homeGoals: 0, awayGoals: 0, events: [] });
                }
            }

            matchdays.push(matches);
            const last = circle.pop();
            circle.unshift(last);
        }

        const getMedia = name => {
            if (name === userTeam.name) return getEffectiveTeamRating(userTeam);
            const c = CLUBS.find(cl => cl.name.toLowerCase() === name.toLowerCase());
            return c ? c.baseMedia : 70;
        };

        const standingsA = shuffledA.map(name => ({
            teamName: name,
            baseMedia: getMedia(name),
            isUserTeam: name === userTeam.name,
            points: 0, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0
        }));

        const standingsB = shuffledB.map(name => ({
            teamName: name,
            baseMedia: getMedia(name),
            isUserTeam: false,
            points: 0, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0
        }));

        leagueStateObj = {
            mode: 'LEAGUE',
            userTeam,
            gkPool,
            fpPool,
            idolPool,
            currentDraftRound: 1,
            draftFinished: false,
            rerollsRemaining: 3,
            currentChoices: choices,
            currentMatchdayIndex: 0,
            regularSeasonFinished: false,
            fixture: matchdays,
            standingsA,
            standingsB,
            playoffPhase: false,
            currentPlayoffRoundName: null,
            currentPlayoffRoundBoost: 0,
            playoffMatches: [],
            lastPlayedPlayoffMatches: [],
            allPlayoffHistory: [],
            userPlayoffMatches: [],
            userQualifiedForPlayoffs: false,
            userEliminated: false,
            userWonLeague: false
        };
    }

    function sortStandings(list) {
        return [...list].sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
        }).map((s, idx) => ({ ...s, pos: idx + 1 }));
    }

    function buildLeagueStateJson() {
        const t = leagueStateObj.userTeam;
        const sortedA = sortStandings(leagueStateObj.standingsA);
        const sortedB = sortStandings(leagueStateObj.standingsB);

        const currentMatches = (leagueStateObj.currentMatchdayIndex < leagueStateObj.fixture.length)
            ? leagueStateObj.fixture[leagueStateObj.currentMatchdayIndex] : [];
        const currentUserMatch = currentMatches.find(m => m.isUserMatch) || null;

        const lastIdx = Math.max(0, leagueStateObj.currentMatchdayIndex - 1);
        const lastPlayedMatches = (leagueStateObj.fixture[lastIdx] && leagueStateObj.fixture[lastIdx][0].played)
            ? leagueStateObj.fixture[lastIdx] : [];

        const userStd = sortedA.find(s => s.isUserTeam) || { points: 0, won: 0, drawn: 0, lost: 0, played: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 };

        return {
            mode: 'LEAGUE',
            userTeamName: t.name,
            currentDraftRound: leagueStateObj.currentDraftRound,
            draftFinished: leagueStateObj.draftFinished,
            rerollsRemaining: leagueStateObj.rerollsRemaining,
            effectiveTeamRating: Math.round(getEffectiveTeamRating(t)),
            choices: leagueStateObj.currentChoices,
            slots: t.slots.map(s => ({
                slotIndex: s.slotIndex,
                requiredPosition: s.requiredPosition,
                requiredCategory: s.requiredCategory,
                isEmpty: s.isEmpty,
                player: s.player ? {
                    name: s.player.name,
                    club: s.player.club,
                    nativePosition: s.player.nativePosition,
                    baseMedia: Math.round(s.player.baseMedia),
                    effectiveBaseMedia: Math.round(s.player.effectiveBaseMedia),
                    bonusMedia: Math.round(s.player.bonusMedia),
                    rarity: s.player.rarity
                } : null,
                effectiveMedia: Math.round(s.effectiveMedia),
                penalty: Math.round(s.penalty)
            })),
            league: {
                currentMatchdayIndex: leagueStateObj.currentMatchdayIndex,
                currentMatchdayNumber: leagueStateObj.currentMatchdayIndex + 1,
                regularSeasonFinished: leagueStateObj.regularSeasonFinished,
                playoffPhase: leagueStateObj.playoffPhase,
                userQualifiedForPlayoffs: leagueStateObj.userQualifiedForPlayoffs,
                userEliminated: leagueStateObj.userEliminated,
                userWonLeague: leagueStateObj.userWonLeague,
                currentPlayoffRoundName: leagueStateObj.currentPlayoffRoundName,
                currentPlayoffRoundBoost: leagueStateObj.currentPlayoffRoundBoost,
                currentUserMatch,
                standingsA: sortedA,
                standingsB: sortedB,
                lastPlayedMatches,
                lastPlayedPlayoffMatches: leagueStateObj.lastPlayedPlayoffMatches,
                allPlayoffHistory: leagueStateObj.allPlayoffHistory,
                playoffMatches: leagueStateObj.playoffMatches,
                tournamentSummary: {
                    points: userStd.points,
                    won: userStd.won,
                    drawn: userStd.drawn,
                    lost: userStd.lost,
                    played: userStd.played,
                    goalsFor: userStd.goalsFor,
                    goalsAgainst: userStd.goalsAgainst,
                    goalDifference: userStd.goalDifference,
                    userPlayoffMatches: leagueStateObj.userPlayoffMatches
                }
            }
        };
    }

    function chooseLeaguePlayer(choiceIndex) {
        if (leagueStateObj.draftFinished || choiceIndex < 0 || choiceIndex >= leagueStateObj.currentChoices.length) {
            return { error: 'Elección inválida' };
        }
        const chosen = leagueStateObj.currentChoices[choiceIndex];
        assignPlayerToTeam(leagueStateObj.userTeam, chosen);

        leagueStateObj.gkPool = leagueStateObj.gkPool.filter(p => p.name.toLowerCase() !== chosen.name.toLowerCase());
        leagueStateObj.fpPool = leagueStateObj.fpPool.filter(p => p.name.toLowerCase() !== chosen.name.toLowerCase());
        leagueStateObj.idolPool = leagueStateObj.idolPool.filter(p => p.name.toLowerCase() !== chosen.name.toLowerCase());

        if (leagueStateObj.currentDraftRound < 11) {
            leagueStateObj.currentDraftRound++;
            leagueStateObj.currentChoices = pickFieldPlayerChoices(leagueStateObj.fpPool, leagueStateObj.idolPool, leagueStateObj.userTeam);
        } else {
            leagueStateObj.draftFinished = true;
            leagueStateObj.currentChoices = [];
            const userRating = getEffectiveTeamRating(leagueStateObj.userTeam);
            const userStd = leagueStateObj.standingsA.find(s => s.isUserTeam);
            if (userStd) userStd.baseMedia = userRating;
        }
        return buildLeagueStateJson();
    }

    function rerollLeagueChoices() {
        if (leagueStateObj.draftFinished || leagueStateObj.rerollsRemaining <= 0) {
            return { error: 'No quedan re-sorteos' };
        }
        leagueStateObj.rerollsRemaining--;
        if (leagueStateObj.currentDraftRound === 1) {
            leagueStateObj.currentChoices = pickGoalkeeperChoices(leagueStateObj.gkPool, leagueStateObj.idolPool, leagueStateObj.userTeam);
        } else {
            leagueStateObj.currentChoices = pickFieldPlayerChoices(leagueStateObj.fpPool, leagueStateObj.idolPool, leagueStateObj.userTeam);
        }
        return buildLeagueStateJson();
    }

    function recordStanding(stdList, name, gf, ga) {
        const item = stdList.find(s => s.teamName === name);
        if (item) {
            item.played++;
            item.goalsFor += gf;
            item.goalsAgainst += ga;
            item.goalDifference = item.goalsFor - item.goalsAgainst;
            if (gf > ga) {
                item.won++;
                item.points += 3;
            } else if (gf === ga) {
                item.drawn++;
                item.points += 1;
            } else {
                item.lost++;
            }
        }
    }

    function playLeagueMatchday() {
        if (!leagueStateObj.draftFinished || leagueStateObj.regularSeasonFinished) {
            return { error: 'Fase regular finalizada o draft incompleto' };
        }
        const matches = leagueStateObj.fixture[leagueStateObj.currentMatchdayIndex];
        const userRating = getEffectiveTeamRating(leagueStateObj.userTeam);

        matches.forEach(m => {
            const isUser = m.isUserMatch;
            const homeIsUser = m.homeTeam === leagueStateObj.userTeam.name;
            const awayIsUser = m.awayTeam === leagueStateObj.userTeam.name;

            const homeRating = homeIsUser ? userRating : (CLUBS.find(c => c.name === m.homeTeam)?.baseMedia || 70);
            const awayRating = awayIsUser ? userRating : (CLUBS.find(c => c.name === m.awayTeam)?.baseMedia || 70);

            const homeScorers = homeIsUser
                ? leagueStateObj.userTeam.slots.filter(s => !s.isEmpty && s.requiredCategory !== 'ARQUERO').map(s => s.player)
                : PLAYERS.filter(p => p.club === m.homeTeam && p.position !== 'ARQ');
            const awayScorers = awayIsUser
                ? leagueStateObj.userTeam.slots.filter(s => !s.isEmpty && s.requiredCategory !== 'ARQUERO').map(s => s.player)
                : PLAYERS.filter(p => p.club === m.awayTeam && p.position !== 'ARQ');

            const sim = simulateMatch(homeRating, awayRating, m.homeTeam, m.awayTeam, homeScorers, awayScorers, isUser, leagueStateObj.userTeam, false);

            m.played = true;
            m.homeGoals = sim.homeGoals;
            m.awayGoals = sim.awayGoals;
            m.events = sim.events;

            recordStanding(leagueStateObj.standingsA, m.homeTeam, sim.homeGoals, sim.awayGoals);
            recordStanding(leagueStateObj.standingsB, m.homeTeam, sim.homeGoals, sim.awayGoals);
            recordStanding(leagueStateObj.standingsA, m.awayTeam, sim.awayGoals, sim.homeGoals);
            recordStanding(leagueStateObj.standingsB, m.awayTeam, sim.awayGoals, sim.homeGoals);
        });

        leagueStateObj.currentMatchdayIndex++;

        if (leagueStateObj.currentMatchdayIndex >= leagueStateObj.fixture.length) {
            leagueStateObj.regularSeasonFinished = true;
            initPlayoffs();
        }

        return buildLeagueStateJson();
    }

    function initPlayoffs() {
        leagueStateObj.playoffPhase = true;
        leagueStateObj.currentPlayoffRoundName = 'Octavos de Final';
        leagueStateObj.currentPlayoffRoundBoost = 0;

        const sA = sortStandings(leagueStateObj.standingsA);
        const sB = sortStandings(leagueStateObj.standingsB);

        leagueStateObj.userQualifiedForPlayoffs = sA.slice(0, 8).some(s => s.isUserTeam);

        const createPM = (rName, t1, t2) => ({
            roundName: rName,
            homeTeam: t1,
            awayTeam: t2,
            isUserMatch: (t1 === leagueStateObj.userTeam.name || t2 === leagueStateObj.userTeam.name),
            played: false,
            winner: null,
            homeGoals: 0,
            awayGoals: 0,
            homeGoalsAt90: 0,
            awayGoalsAt90: 0,
            wentToExtraTime: false,
            wentToPenalties: false,
            homePenalties: 0,
            awayPenalties: 0,
            events: [],
            penaltyEvents: []
        });

        leagueStateObj.playoffMatches = [
            createPM('Octavos de Final', sA[0].teamName, sB[7].teamName),
            createPM('Octavos de Final', sB[3].teamName, sA[4].teamName),
            createPM('Octavos de Final', sA[1].teamName, sB[6].teamName),
            createPM('Octavos de Final', sB[2].teamName, sA[5].teamName),
            createPM('Octavos de Final', sB[0].teamName, sA[7].teamName),
            createPM('Octavos de Final', sA[3].teamName, sB[4].teamName),
            createPM('Octavos de Final', sB[1].teamName, sA[6].teamName),
            createPM('Octavos de Final', sA[2].teamName, sB[5].teamName)
        ];
    }

    function playLeaguePlayoffRound() {
        if (!leagueStateObj.playoffPhase || leagueStateObj.playoffMatches.length === 0) {
            return { error: 'No hay partidos de playoffs activos' };
        }

        const matches = leagueStateObj.playoffMatches;
        const boost = leagueStateObj.currentPlayoffRoundBoost;
        const userRating = getEffectiveTeamRating(leagueStateObj.userTeam);
        const winners = [];

        matches.forEach(m => {
            const isUser = m.isUserMatch;
            const homeIsUser = m.homeTeam === leagueStateObj.userTeam.name;
            const awayIsUser = m.awayTeam === leagueStateObj.userTeam.name;

            const baseHomeRating = homeIsUser ? userRating : (CLUBS.find(c => c.name === m.homeTeam)?.baseMedia || 70);
            const baseAwayRating = awayIsUser ? userRating : (CLUBS.find(c => c.name === m.awayTeam)?.baseMedia || 70);

            const homeRating = (isUser && !homeIsUser) ? baseHomeRating + boost : baseHomeRating;
            const awayRating = (isUser && !awayIsUser) ? baseAwayRating + boost : baseAwayRating;

            const homeScorers = homeIsUser
                ? leagueStateObj.userTeam.slots.filter(s => !s.isEmpty && s.requiredCategory !== 'ARQUERO').map(s => s.player)
                : PLAYERS.filter(p => p.club === m.homeTeam && p.position !== 'ARQ');
            const awayScorers = awayIsUser
                ? leagueStateObj.userTeam.slots.filter(s => !s.isEmpty && s.requiredCategory !== 'ARQUERO').map(s => s.player)
                : PLAYERS.filter(p => p.club === m.awayTeam && p.position !== 'ARQ');

            const sim = simulateMatch(homeRating, awayRating, m.homeTeam, m.awayTeam, homeScorers, awayScorers, isUser, leagueStateObj.userTeam, true);

            m.played = true;
            m.homeGoals = sim.homeGoals;
            m.awayGoals = sim.awayGoals;
            m.homeGoalsAt90 = sim.homeGoalsAt90;
            m.awayGoalsAt90 = sim.awayGoalsAt90;
            m.wentToExtraTime = sim.wentToExtraTime;
            m.wentToPenalties = sim.wentToPenalties;
            m.homePenalties = sim.homePenalties;
            m.awayPenalties = sim.awayPenalties;
            m.events = sim.events;
            m.penaltyEvents = sim.penaltyEvents;

            const winner = sim.homeWon ? m.homeTeam : m.awayTeam;
            m.winner = winner;
            winners.push(winner);

            if (isUser) {
                leagueStateObj.userPlayoffMatches.push({ ...m });
                if (winner !== leagueStateObj.userTeam.name) {
                    leagueStateObj.userEliminated = true;
                }
            }
        });

        leagueStateObj.lastPlayedPlayoffMatches = [...matches];
        leagueStateObj.allPlayoffHistory.push([...matches]);

        const createPM = (rName, t1, t2) => ({
            roundName: rName,
            homeTeam: t1,
            awayTeam: t2,
            isUserMatch: (t1 === leagueStateObj.userTeam.name || t2 === leagueStateObj.userTeam.name),
            played: false,
            winner: null,
            homeGoals: 0,
            awayGoals: 0,
            homeGoalsAt90: 0,
            awayGoalsAt90: 0,
            wentToExtraTime: false,
            wentToPenalties: false,
            homePenalties: 0,
            awayPenalties: 0,
            events: [],
            penaltyEvents: []
        });

        if (leagueStateObj.currentPlayoffRoundName === 'Octavos de Final') {
            leagueStateObj.currentPlayoffRoundName = 'Cuartos de Final';
            leagueStateObj.currentPlayoffRoundBoost = 2;
            leagueStateObj.playoffMatches = [
                createPM('Cuartos de Final', winners[0], winners[1]),
                createPM('Cuartos de Final', winners[2], winners[3]),
                createPM('Cuartos de Final', winners[4], winners[5]),
                createPM('Cuartos de Final', winners[6], winners[7])
            ];
        } else if (leagueStateObj.currentPlayoffRoundName === 'Cuartos de Final') {
            leagueStateObj.currentPlayoffRoundName = 'Semifinal';
            leagueStateObj.currentPlayoffRoundBoost = 4;
            leagueStateObj.playoffMatches = [
                createPM('Semifinal', winners[0], winners[1]),
                createPM('Semifinal', winners[2], winners[3])
            ];
        } else if (leagueStateObj.currentPlayoffRoundName === 'Semifinal') {
            leagueStateObj.currentPlayoffRoundName = 'Gran Final';
            leagueStateObj.currentPlayoffRoundBoost = 6;
            leagueStateObj.playoffMatches = [
                createPM('Gran Final', winners[0], winners[1])
            ];
        } else if (leagueStateObj.currentPlayoffRoundName === 'Gran Final') {
            leagueStateObj.currentPlayoffRoundName = 'Finalizado';
            leagueStateObj.playoffMatches = [];
            if (winners[0] === leagueStateObj.userTeam.name) {
                leagueStateObj.userWonLeague = true;
            }
        }

        return buildLeagueStateJson();
    }

    async function handleApi(urlStr, init) {
        let path = urlStr;
        let nameParam = 'ChiquiTeam';
        const qIdx = urlStr.indexOf('?');
        if (qIdx !== -1) {
            path = urlStr.substring(0, qIdx);
            const query = urlStr.substring(qIdx + 1);
            const params = query.split('&');
            for (const param of params) {
                const pair = param.split('=');
                if (pair[0] === 'name' && pair[1]) {
                    nameParam = decodeURIComponent(pair[1].replace(/\+/g, ' '));
                }
            }
        }

        let body = {};
        if (init && init.body) {
            try {
                body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
            } catch (e) {}
        }

        let data = null;

        if (path === '/api/game/new') {
            initCupState(body.name || nameParam);
            data = buildCupGameStateJson();
        } else if (path === '/api/draft/choose') {
            data = chooseCupPlayer(body.choiceIndex !== undefined ? body.choiceIndex : -1);
        } else if (path === '/api/draft/reroll') {
            data = rerollCupChoices();
        } else if (path === '/api/cup/next-match') {
            data = playNextCupMatch();
        } else if (path === '/api/league/new') {
            initLeagueState(body.name || nameParam);
            data = buildLeagueStateJson();
        } else if (path === '/api/league/choose') {
            data = chooseLeaguePlayer(body.choiceIndex !== undefined ? body.choiceIndex : -1);
        } else if (path === '/api/league/reroll') {
            data = rerollLeagueChoices();
        } else if (path === '/api/league/state') {
            if (!leagueStateObj) initLeagueState(nameParam);
            data = buildLeagueStateJson();
        } else if (path === '/api/league/play-matchday') {
            data = playLeagueMatchday();
        } else if (path === '/api/league/play-playoff') {
            data = playLeaguePlayoffRound();
        } else {
            return {
                ok: false,
                status: 404,
                json: async () => ({ error: 'Ruta no encontrada' })
            };
        }

        return {
            ok: !data.error,
            status: data.error ? 400 : 200,
            json: async () => data
        };
    }

    const originalFetch = window.fetch;
    window.fetch = async function(resource, init) {
        const url = typeof resource === 'string' ? resource : resource.url;
        if (url && (url.startsWith('/api/') || url.includes('/api/'))) {
            return handleApi(url, init);
        }
        if (originalFetch) return originalFetch(resource, init);
        return { ok: false, status: 404, json: async () => ({}) };
    };

    window.FulboEngine = {
        CLUBS,
        PLAYERS,
        LEGENDS,
        handleApi
    };
})(typeof window !== 'undefined' ? window : this);
