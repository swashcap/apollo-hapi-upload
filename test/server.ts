import FormData from 'form-data';
import Fs from 'fs';
import Lab from '@hapi/lab';
import Path from 'path';
import { expect } from '@hapi/code';

import { init } from '../src/server';

const { test } = (exports.lab = Lab.script());

test('file uploads', async () => {
    const server = await init();
    const formData = new FormData();

    formData.append(
        'operation',
        JSON.stringify({
            query: `
            mutation(file: Upload!) {
                singleUpload(file: $file) {
                    encoding
                    filename
                    mimetype
                }
            }`,
            variables: {
                file: null,
            },
        })
    );
    formData.append(
        'map',
        JSON.stringify({
            upload: ['variables.file'],
        })
    );
    formData.append(
        'upload',
        Fs.readFileSync(Path.join(__dirname, 'fixture.jpg'))
    );

    const response = await server.inject({
        headers: formData.getHeaders(),
        payload: formData.getBuffer(),
        url: '/graphql',
    });

    // Log the result for debugging
    console.log(response.result);

    expect(response.statusCode).to.be.equal(200);
});
