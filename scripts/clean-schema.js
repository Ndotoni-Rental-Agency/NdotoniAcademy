// Strips AWS AppSync-specific directives from a downloaded introspection
// schema so standard GraphQL tooling (Amplify codegen, graphql-codegen) can
// parse it. AppSync's own directives aren't part of the GraphQL spec and
// aren't declared in the introspected SDL, so generic parsers choke on them.
//
// Must strip the directive name AND its parenthesized argument list together
// (e.g. `@aws_subscribe(mutations: ["acceptInvitation"])`) — stripping just
// the name leaves a dangling `(...)` behind, which is a syntax error.
const fs = require('fs');

const path = 'schema.graphql';
let schema = fs.readFileSync(path, 'utf8');

schema = schema.replace(/@aws_[a-zA-Z_]+(\([^)]*\))?/g, '');

// The backend's modular schema declares `_empty: String` on Query/Mutation/
// Subscription as a syntax placeholder (GraphQL doesn't allow a type with a
// truly empty body, and domain files attach real fields via `extend type`
// afterward). It's never meant to be queried, but Amplify's codegen chokes
// on the same field name existing on multiple root types ("There can be
// only one operation named _empty"). Strip it.
schema = schema.replace(/^\s*_empty:\s*String\s*$/gm, '');

fs.writeFileSync(path, schema);
