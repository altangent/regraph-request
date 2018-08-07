# regraph-request

> Simple React GraphQL requests

[![NPM](https://img.shields.io/npm/v/regraph-request.svg)](https://www.npmjs.com/package/regraph-request)

## Install

```bash
npm install --save regraph-request
```

## Usage

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'regraph-request';

const QUERY = `
  query Test(
    $inputName: String
  ) {
    hello(name: $inputName)
  }
`;

export const HelloComponent = ({ data }) => {
  if (!data.hello) return <div />;
  return <div>{data.hello}</div>;
};

HelloComponent.propTypes = {
  username: PropTypes.string,
};

export const Hello = Query(HelloComponent, QUERY, props => ({
  inputName: props.username,
}));

export const App = () => {
  return (
    <RegraphRequest value="https://example.com/graphql">
      <Hello />
    </RegraphRequest>
  );
};
```

## License

MIT © [Altangent](https://github.com/altangent)
