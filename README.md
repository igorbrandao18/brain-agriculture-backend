# Brain Agriculture Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<p align="center">
  <b>Backend for Brain Agriculture Technical Challenge</b><br/>
  <i>REST API with NestJS, Prisma, PostgreSQL, Docker, Clean Architecture</i>
</p>

---

## 🚀 Features

- REST API for rural producer management
- Clean Architecture (Domain, Use Cases, Infrastructure, Presentation)
- PostgreSQL with Prisma ORM
- Docker & Docker Compose for easy setup
- CPF/CNPJ validation and business rules
- Dashboard endpoint with aggregations (farms, hectares, by state/crop/land use)
- Unit, integration, and e2e tests
- Linting and pre-commit hooks (Husky)
- Swagger/OpenAPI documentation
- Mocked data/seed for development
- Full logging and error handling

---

## 🏗️ Project Structure

- `src/core` - Domain entities, use cases, and business rules
- `src/infrastructure` - Prisma repository, database module
- `src/presentation` - Controllers, DTOs, API layer
- `prisma/` - Prisma schema, migrations, and seed script
- `test/` - e2e tests

---

## ⚡ Quickstart

### 1. Clone & Install

```bash
git clone <repo-url>
cd brain-agriculture-backend
yarn install
```

### 2. Run with Docker (Recommended)

```bash
docker-compose up --build
```
- API: http://localhost:3000
- DB:  localhost:5432

### 3. Run Locally (Dev)

```bash
yarn start:dev
```

### 4. Run Prisma Migrations

```bash
yarn prisma migrate deploy
```

### 5. Seed Database (Mock Data)

```bash
yarn prisma db seed
# or
npx prisma db seed
```

---

## 🧪 Testing

### Run all tests (unit + e2e)

```bash
yarn test
```

### Run only e2e tests

```bash
yarn test:e2e
```

### Test coverage

```bash
yarn test:cov
```

---

## 🧹 Linting

### Run linter and auto-fix

```bash
yarn lint
```

### Pre-commit hook

- Husky runs lint and tests before every commit.
- Commits with linter errors are **blocked**.

---

## 📖 API Documentation

- Interactive Swagger: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- All endpoints, payloads, and responses are documented.

---

## 🏛️ Architecture

- **Domain/Core**: Entities, business rules, use cases
- **Infrastructure**: Prisma repository, database access
- **Presentation**: Controllers, DTOs, API layer
- **Testing**: Unit, integration, and e2e tests

---

## 📝 Example Requests

See full examples in Swagger docs. Example payload for creating a producer:

```json
{
  "name": "João da Silva",
  "document": "12345678909",
  "farms": [
    {
      "name": "Fazenda Boa Vista",
      "state": "GO",
      "totalArea": 100,
      "arableArea": 60,
      "vegetationArea": 40,
      "crops": ["Soja", "Milho"]
    }
  ]
}
```

---

## 🐳 Docker Compose

- `docker-compose up --build` brings up API and Postgres
- `.env` is used for configuration

---

## 👨‍💻 Development Notes

- All business rules (CPF/CNPJ, area sum, etc) are enforced in the domain/use cases
- All code is type-safe and linter clean
- Seed script (`prisma/seed.ts`) provides mocked data for local/dev
- Logs are available for all important actions/errors

---

## 📚 References

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Swagger](http://localhost:3000/api/docs)

---

## License

MIT

---

## Autor

Desenvolvido por **Igor Brandão**  
[LinkedIn](https://www.linkedin.com/in/igorbrandaodeveloper/)
