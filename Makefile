up:
	docker-compose up --build

down:
	docker-compose down

test-backend:
	cd motor-speed-backend && dotnet test

test-frontend:
	cd motor-speed-frontend && npm test

lint:
	cd motor-speed-frontend && npm run lint

health:
	curl -f http://localhost/health
