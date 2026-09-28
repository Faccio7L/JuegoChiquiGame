FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY src/ ./src/
RUN mkdir -p out && javac -d out src/*.java

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/out ./out
COPY web/ ./web/
EXPOSE 8080
ENV PORT=8080
CMD ["java", "-cp", "out", "Main"]
