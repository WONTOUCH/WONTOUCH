FROM amazoncorretto:17-alpine

WORKDIR /app

COPY /build/libs/api-0.0.1-SNAPSHOT.jar /app/wontouch-api.jar

EXPOSE 8081

CMD ["java", "-jar", "/app/wontouch-api.jar"]