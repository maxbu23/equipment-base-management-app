FROM gradle:8.5.0-jdk17 AS build

WORKDIR /app/backend

COPY build.gradle settings.gradle /app/backend/

COPY src /app/backend/src

RUN gradle build

FROM openjdk:17-jdk-slim
WORKDIR /app/backend

COPY --from=build /app/backend/build/libs/*.jar app.jar

EXPOSE 8080

CMD ["java","-jar","app.jar"]

