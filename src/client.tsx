import React from 'react';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, graphql, MutateProps } from 'react-apollo';
import { Button, Form as SemanticUIForm, Message } from 'semantic-ui-react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { render } from 'react-dom';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink(),
});

const Form: React.FC<Partial<MutateProps>> = ({ mutate, result }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = React.useState('');

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        let file: File | undefined;

        if (inputRef.current && inputRef.current.files) {
            file = inputRef.current.files[0];
        }

        if (!mutate) {
            return setErrorMessage('Internal form error');
        } else if (!file) {
            return setErrorMessage('No files selected');
        }

        return mutate({
            variables: { file },
        });
    };

    const onChange = () => {
        setErrorMessage('');
    };

    return (
        <SemanticUIForm action="/graphql" method="POST" onSubmit={onSubmit}>
            {!!result && result.error && (
                <Message negative>
                    <Message.Header>{result.error.toString()}</Message.Header>
                </Message>
            )}
            {!!errorMessage && (
                <Message negative>
                    <Message.Header>{errorMessage}</Message.Header>
                </Message>
            )}
            <SemanticUIForm.Field>
                <label htmlFor="upload">Select an image</label>
                <input
                    accept="image/*"
                    id="upload"
                    onChange={onChange}
                    name="upload"
                    ref={inputRef}
                    type="file"
                />
            </SemanticUIForm.Field>
            <Button primary type="submit">
                Upload
            </Button>
        </SemanticUIForm>
    );
};

const WrappedForm = graphql(gql`
    mutation($file: Upload!) {
        singleUpload(file: $file) {
            encoding
            filename
            mimetype
        }
    }
`)(Form);

const App = () => (
    <ApolloProvider client={client}>
        <WrappedForm />
    </ApolloProvider>
);

render(<App />, document.getElementById('app'));
