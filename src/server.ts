import 'hard-rejection/register';

import Path from 'path';

import { ApolloServer, gql, IResolvers } from 'apollo-server-hapi';
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Good from '@hapi/good';

/**
 * Basic upload schema
 * {@link
 * https://www.apollographql.com/docs/apollo-server/features/file-uploads/}
 */
const typeDefs = gql`
    type File {
        encoding: String!
        filename: String!
        mimetype: String!
    }

    type Query {
        uploads: [File!]!
    }

    type Mutation {
        singleUpload(file: Upload!): File!
    }
`;

const resolvers: IResolvers = {
    Mutation: {
        async singleUpload(parent, args) {
            const file = await args.file;
            return file;
        },
    },
    Query: {
        uploads() {
            return [];
        },
    },
};

export const init = async () => {
    const apolloServer = new ApolloServer({
        resolvers,
        typeDefs,
        uploads: true,
    });
    const server = new Hapi.Server({
        host: 'localhost',
        port: process.env.PORT || 3000,
        routes: {
            files: {
                relativeTo: Path.resolve(__dirname, '../dist'),
            },
        },
    });

    await Promise.all([
        server.register(Inert),
        process.env.NODE_ENV !== 'test'
            ? server.register({
                  options: {
                      ops: {
                          interval: 1000,
                      },
                      reporters: {
                          myConsoleReporter: [
                              {
                                  module: '@hapi/good-squeeze',
                                  name: 'Squeeze',
                                  args: [{ log: '*', response: '*' }],
                              },
                              {
                                  module: '@hapi/good-console',
                              },
                              'stdout',
                          ],
                      },
                  },
                  plugin: Good,
              })
            : undefined,
        apolloServer.applyMiddleware({
            app: server,
        }),
    ]);
    await apolloServer.installSubscriptionHandlers(server.listener);

    server.route({
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
            },
        },
        method: 'GET',
        path: '/{param*}',
    });

    return server;
};

if (require.main === module) {
    (async () => {
        const server = await init();

        await server.start();

        server.log(['info'], `Server running on ${server.info.uri}`);
    })();
}
