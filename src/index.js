const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

const checksExistsRepository = (request, response, next) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex(repository => repository.id === id);

  if (indexRepository < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.indexRepository = indexRepository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksExistsRepository, (request, response) => {
  const {title, techs, url} = request.body;
  const { indexRepository } = request;

  const repository = {...repositories[indexRepository], title, techs, url}

  repositories[indexRepository] = repository

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", checksExistsRepository, (request, response) => {
  const { indexRepository } = request

  repositories.splice(indexRepository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsRepository, (request, response) => {
  const { indexRepository } = request

 const likes = ++repositories[indexRepository].likes;

  return response.status(201).json({ likes});
});

module.exports = app;
