#!/bin/bash

echo "JWT Security 애플리케이션을 시작합니다..."
echo ""
echo "1. MySQL 서버가 실행 중인지 확인해주세요."
echo "2. 데이터베이스 'jwtsecurity'가 생성되어 있는지 확인해주세요."
echo ""

echo "백엔드 서버를 시작합니다..."
gnome-terminal --title="Backend Server" -- bash -c "mvn spring-boot:run; exec bash" &

echo "5초 후 프론트엔드 서버를 시작합니다..."
sleep 5

echo "프론트엔드 서버를 시작합니다..."
cd frontend
gnome-terminal --title="Frontend Server" -- bash -c "npm start; exec bash" &

echo ""
echo "서버들이 시작되었습니다:"
echo "- 백엔드: http://localhost:8080"
echo "- 프론트엔드: http://localhost:3000"
echo ""
echo "웹 브라우저에서 http://localhost:3000 을 열어서 애플리케이션을 사용하세요."
