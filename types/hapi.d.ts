// Shim for apollo-server, which uses the older package
declare module 'hapi' {
    import * as Hapi from '@hapi/hapi';

    export default Hapi;
}
