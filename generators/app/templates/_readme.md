# <%=projectName%>

```zsh
# dev
npm run dev
# test
npm test
# lint
npm run lint
# coverage
npm run coverage
<% if (includeGraphql) {%>
# generate graphqlSchema.d.ts from codegen.yml
npm run graphql-codegen
<%}%>
```