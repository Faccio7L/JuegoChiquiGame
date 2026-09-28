import java.io.File;

public class Main {

    public static void main(String[] args) {
        int port = 8080;
        String envPort = System.getenv("PORT");
        if (envPort != null && !envPort.trim().isEmpty()) {
            try {
                port = Integer.parseInt(envPort.trim());
            } catch (NumberFormatException ignored) {}
        } else if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {}
        }

        File webDir = new File("web");
        if (!webDir.exists()) {
            webDir = new File(System.getProperty("user.dir"), "web");
        }

        try {
            FulboServer server = new FulboServer(port, webDir);
            server.start();

            System.out.println();
            System.out.println("Fulbo listo en puerto " + port);
            System.out.println();
        } catch (Exception e) {
            System.err.println("Error al iniciar el servidor: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
