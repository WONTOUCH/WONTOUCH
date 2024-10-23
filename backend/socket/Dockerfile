FROM amazoncorretto:17-alpine

WORKDIR /app

COPY /build/libs/socket-0.0.1-SNAPSHOT.jar /app/wontouch-socket.jar

EXPOSE 8083

CMD ["java", "-jar", "/app/wontouch-socket.jar"]