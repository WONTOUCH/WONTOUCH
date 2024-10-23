# 로비 서버 실행을 위한 절차

## 개요
여러분 로비 서버 실행이 다들 쉽겠지만, 혹시라도 새로운 세팅이 추가되거나 하면 어려울 수도 있으니까!!

로비 서버 실행을 위한 절차를 참고하여 실행해주세요.
## 기능
* **기능 1**: 사용자에게 로비 서버 실행 방법 제공
* **기능 2**: 그냥 이종민에게 물어보세요

## 사용 방법
1. 프로젝트 설정:

+    `File` -> `Project Structure`에 _SDK_ 를 _JAVA17_ 로 설정하세요


+    `Settings` -> `Build, Execution, Deplyoment` -> `Compiler` -> `Annotation Processor`에서 enable로 바꾸세요


+    `logging.level.wontouch.socket`의 값을 debug 대신 info로 바꾸어 성능의 저하를 막습니다.

+ docker를 킵니다. -> docker desktop을 사용한다면 redis image를 받아 port번호를 일치시키고, cli를 사용한다면, 명령어를 통해 image를 받아 사용하세요
2. 서버 환경 설정:

+ 먼저 `application.properties` 파일로 이동해주세요

+ `application.properties` 파일을 프로젝트 설정 파일에서 가져와서 넣어주세요.


### 그 외 설정

설정 파일(application.properties)에 문자가 깨진다면, `File` -> `Settings` -> `File Encodings` -> `Default encoding for properties` 를 UTF-8 로 바꾸고 적용하세요
