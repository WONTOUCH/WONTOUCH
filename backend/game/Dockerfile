FROM amazoncorretto:17-alpine

WORKDIR /app

COPY /build/libs/game-0.0.1-SNAPSHOT.jar /app/wontouch-game.jar

EXPOSE 8085

CMD ["java", "-jar", "/app/wontouch-game.jar"]