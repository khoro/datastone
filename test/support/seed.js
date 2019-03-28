const schemaQuery = `
  CREATE TABLE if not exists users (
    id INTEGER PRIMARY KEY,
    email TEXT not NULL unique,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    bio TEXT,
    balance FLOAT,
    isActive BOOLEAN,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    userId INTEGER REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY,
    label TEXT NOT NULL,
    projectId INTEGER REFERENCES projects(id)
  );

  CREATE TABLE IF NOT EXISTS projects_tags (
    projectId INTEGER REFERENCES projects(id),
    tagId INTEGER REFERENCES projects(id)
  );
`;

const data = {
  users: [
    ['mail1@mail.com', 'pass1', 'name1', 'bio1', 1.5, 1, new Date(), new Date],
    ['mail2@mail.com', 'pass2', 'name2', 'bio2', 2.5, 1, new Date(), new Date],
    ['mail3@mail.com', 'pass3', 'name3', 'bio3', 3.5, 0, new Date(), new Date],
    ['mail4@mail.com', 'pass4', 'name4', 'bio4', 4.5, 1, new Date(), new Date],
    ['mail5@mail.com', 'pass5', 'name5', 'bio5', 5.5, 0, new Date(), new Date]
  ]
}

export const seedData = async (knex) => {
  await knex.raw(schemaQuery);

  for(let table in data) {
    for(let item of data[table]) {
      const values = item.map(i => `'${i}'`).join(',');
      await knex.raw(`INSERT INTO ${table} VALUES (NULL, ${values})`);
    }
  }
}
