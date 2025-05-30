# Backend Development Plan

This document describes the steps to implement the backend part of the Brain Agriculture technical test, based on the requirements specified in `job.md`.

## Main Backend Requirements (from job.md):

*   Develop a REST API.
*   Use Docker for application distribution.
*   Use Postgres as the database.
*   Create the necessary endpoints to meet business requirements.
*   Develop unit and integrated tests.
*   Structure "mocked" data for testing.
*   Include logs to ensure system observability.
*   Use an ORM framework (Prisma).
*   Business Requirements:
    *   Registration, editing, and deletion of rural producers.
    *   Validate CPF or CNPJ.
    *   Ensure that the sum of arable and vegetation areas does not exceed the total farm area.
    *   Allow the registration of multiple planted crops per producer's farm.
    *   A producer can be associated with 0, 1, or more rural properties.
    *   A rural property can have 0, 1, or more planted crops per harvest.
    *   Display a dashboard with total registered farms, total hectares, and data for charts (by state, planted crop, and land use).

## Step-by-Step Plan:

1.  **Initial Project Setup (NestJS):**
    *   Configure the development environment.
    *   Initialize the basic NestJS project (already done).

2.  **Architecture Definition:**
    *   Adopt Clean Architecture to structure the project, separating business rules (Core/Domain) from infrastructure and presentation (Frameworks, Database, API).
    *   Define layers and their responsibilities.

3.  **Database and ORM Configuration (Prisma):**
    *   Configure Postgres using Docker Compose (already done).
    *   Integrate Prisma with the NestJS project (initialization done).
    *   Configure Prisma connection to the database using `.env` environment variables.

4.  **Data Modeling (Prisma Schema):**
    *   Create models in `prisma/schema.prisma` for Rural Producer, Rural Property, Harvest (Safra), and Planted Crop based on the requirements.
    *   Define relationships between models.
    *   Run migrations to create tables in the database.

5.  **Core Implementation (Domain/Use Cases):**
    *   Implement main entities and business rules (validations, aggregation logic).
    *   Create use cases for business operations (registration, editing, deletion, etc.).
    *   Define interfaces (Ports) for interaction with external layers (database, external services).

6.  **Infrastructure Layer Implementation:**
    *   Implement adapters that connect to the ORM (Prisma) for data persistence, following interfaces defined in the Core.
    *   Implement external validation services (if needed).

7.  **Presentation Layer Creation (REST API with NestJS):**
    *   Create Controllers and Services in NestJS to expose Use Cases via REST endpoints.
    *   Implement data serialization/deserialization logic (DTOs).
    *   Inject dependencies (Use Cases, Adapters) into Services/Controllers.

8.  **Validation Implementation in the Appropriate Layer:**
    *   Ensure CPF/CNPJ and area validations are applied at the Core level (Use Cases) or Entities.
    *   Use NestJS Pipes/Guards for input validations (optional, depending on the approach).

9.  **Dashboard Endpoints Implementation:**
    *   Create specific Use Cases to aggregate necessary data for charts and totals.
    *   Implement endpoints in the presentation layer to call these Use Cases and return formatted data.

10. **Logging Implementation:**
    *   Configure a logging system in NestJS and integrate it into appropriate layers to record important events and errors.

11. **Testing Development:**
    *   Write unit tests for entities and Use Cases (Core).
    *   Write integration tests for infrastructure adapters and API endpoints.

12. **Mocked Data Structuring:**
    *   Create scripts or fixtures to generate mocked data for tests and initial development.

13. **Application Dockerization:**
    *   Ensure `Dockerfile` and `docker-compose.yml` are correct and functional (Dockerfile created, docker-compose.yml created, .env created/updated).
    *   Ensure environment variables are correctly passed to the application inside Docker.

14. **Documentation:**
    *   Update the `README.md` with detailed instructions.
    *   Generate or write the OpenAPI specification (Swagger) for the API.

This plan has been updated to reflect the use of NestJS, Prisma, and the adoption of Clean Architecture. Steps can be adjusted as needed for the project.

---

## Progresso do Projeto

### Etapas concluídas:
- [x] 1. Initial Project Setup (NestJS)
- [x] 2. Architecture Definition (estruturação inicial e pastas Clean Architecture)
- [x] 4. Data Modeling (Prisma Schema): Modelos criados e migrations aplicadas
- [x] 5. Core Implementation (Domain/Use Cases): Entidades e casos de uso CRUD para produtor rural
- [x] 6. Infrastructure Layer Implementation: Repositório Prisma implementado
- [x] 7. Presentation Layer Creation (REST API): Controller, DTOs e validação para produtor rural
- [x] 8. Validation Implementation: Validação no domínio e via DTOs/class-validator
- [x] 14. Documentation: Swagger em andamento

### Próxima etapa:
- [ ] 9. Dashboard Endpoints Implementation: Use cases e endpoints para dashboard (totais, gráficos por estado, cultura, uso do solo)

### Etapas seguintes:
- [ ] 10. Logging Implementation
- [ ] 11. Testing Development
- [ ] 12. Mocked Data Structuring
- [ ] 13. Application Dockerization
- [ ] 14. Documentation: Finalizar README e garantir cobertura Swagger