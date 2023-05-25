const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

const app = express();
let db = null;
const dbpath = path.join(__dirname, "moviesData.db");

const initializedbandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("AAAAAA");
    });
  } catch (e) {
    console.log(`Db error: ${e.message}`);
  }
};

initializedbandServer();

//    ///         ////      ////     /////         //////    ///

let responseObject = (each) => {
  return {
    movieId: each.movie_id,
    directorId: each.director_id,
    movieName: each.movie_name,
    leadActor: each.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
      movie_name
    FROM
      movie;`;

  const movieArray = await db.all(getMoviesQuery);
  response.send(movieArray.map((each) => ({ movieName: each.movie_name })));
});

app.get("/movies/:movieId/", async (request, response) => {
  let { movieId } = request.params;
  const getmovie = `
    SELECT *
    FROM movie
    WHERE movie_id = ${movieId}`;
  const movie = await db.get(getmovie);
  response.send(responseObject(movie));
});

//////// ////// /////     ////// ////// ////// //

app.post("/movies/", async (request, response) => {
  let { directorId, movieName, leadActor } = request.body;
  const postMovie = `
    INSERT INTO 
      movie (director_id,movie_name,lead_actor)
    VALUES
      (${directorId},'${movieName}','${leadActor}');`;
  await db.run(postMovie);
  response.send("Movie Successfully Added");
});

// /// /// //// ////        ////// ////      ////

app.put("/movies/:movieId", async (request, response) => {
  let { movieId } = recquest.params;
  let { directorId, movieName, leadActor } = request.body;
  const putqurey = `
      UPDATE
        movie
      SET
        dirctor_id = ${directorId}
        movie_name = '${movieName}'
        lead_actor = '${leadActor}'
      WHERE
        movie_id = ${movieId}`;
  await db.run(putqurey);
  response.send("Movie Details Updated");
});

//// ///// ///// ////// ////// ////// ///// ///// /

app.delete("/movies/:movieId/", async (request, response) => {
  let { movieId } = request.params;
  let deleteQurey = `
      DELETE FROM
        movie
      WHERE
        movie_id = ${movieId}
      `;
  await db.run(deleteQurey);
  response.send("Movie Removed");
});
//    /   /    /   /   /     /    /     //

const directorResponseObject = (each) => {
  return {
    directorId: each.director_id,
    directorName: each.director_name,
  };
};

app.get("/directors/", async (recqest, response) => {
  const directorQurey = `
        SELECT 
          * 
        FROM
          director`;
  const directorArray = await db.all(directorQurey);
  response.send(directorArray.map((each) => directorResponseObject(each)));
});

//       ///////      //////      //////      /////      /////   ///   ///

app.get(`/directors/:directorId/movies/`, (request, response) => {
  const { directorId } = request.params;
  const movieNameQurey = `
    SELECT
      movie_name
    From 
      movie
    WHERE
      director_id = ${directorId};`;
  const movieArray = db.all(movieNameQurey);
  response.send(
    movieArray.map((each) => (
      {
        moviename: each.movie_name;
      }
    ))
  );
});
module.exports = app;