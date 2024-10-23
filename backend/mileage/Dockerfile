FROM amazoncorretto:17-alpine

WORKDIR /app

COPY /build/libs/mileage-0.0.1-SNAPSHOT.jar /app/wontouch-mileage.jar

EXPOSE 8086

CMD ["java", "-jar", "/app/wontouch-mileage.jar"]