const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    like: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  const { like } = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    like
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" })
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  
  const { title, url, techs, like } = repositories[repositoryIndex]

  repositories[repositoryIndex] = {
    id,
    title,
    url,
    techs,
    like: like + 1
  }

  const repository = repositories[repositoryIndex];

  return response.json(repository);
});

app.listen(3334, () => {
  console.log('Back-end started')
});

module.exports = app;
