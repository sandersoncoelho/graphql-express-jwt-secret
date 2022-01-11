var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const jwt = require('jsonwebtoken');

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = {
  hello: () => {
    return 'Hello world!';
  },
};

const verifyToken = (req, res, next) => {  
  jwt.verify(req.headers.authorization, 'mysecret', (err, decoded) => {
    console.log(decoded)
    if (err){      
      return res.sendStatus(401);
    }
    next();
  });
}

var app = express();

app.use(verifyToken);
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
