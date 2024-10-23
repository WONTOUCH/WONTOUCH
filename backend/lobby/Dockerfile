FROM amazoncorretto:17-alpine

WORKDIR /app

COPY /build/libs/lobby-0.0.1-SNAPSHOT.jar /app/wontouch-lobby.jar

EXPOSE 8084

CMD ["java", "-jar", "/app/wontouch-lobby.jar"]