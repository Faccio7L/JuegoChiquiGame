import java.io.File;

/**
 * Punto de entrada principal de Fulbo.
 * Inicia el servidor web nativo en el puerto 8080.
 */
public class Main {

    public static void main(String[] args) {
        int port = 8080;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {}
        }

        // Buscar directorio web
        File webDir = new File("web");
        if (!webDir.exists()) {
            webDir = new File(System.getProperty("user.dir"), "web");
        }

        try {
            FulboServer server = new FulboServer(port, webDir);
            server.start();

            System.out.println();
            System.out.println("⚽ ¡Juego Fulbo listo!");
            System.out.println("👉 Abrí tu navegador en: http://localhost:" + port);
            System.out.println();
        } catch (Exception e) {
            System.err.println("Error al iniciar el servidor: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
