# runtime
FROM amazoncorretto:17-alpine

WORKDIR /app

COPY /build/libs/auth-0.0.1-SNAPSHOT.jar /app/wontouch-auth.jar

EXPOSE 8082

CMD ["java", "-jar", "/app/wontouch-auth.jar"]