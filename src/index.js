import React from 'react';
const HOST = process.env.GRAPHQL_HOST || 'http://localhost:8001/graphql';

export const Query = (WrappedComponent, query, variables = () => {}, host = HOST) => {
  class WithRequest extends React.Component {
    constructor(props) {
      super(props);
      this.getData = this.getData.bind(this);
      this.state = {
        data: {},
      };
      this.getData(variables(props));
    }

    componentDidUpdate(prevProps) {
      if (JSON.stringify(this.props) !== JSON.stringify(prevProps))
        this.getData(variables(this.props));
    }

    getData(variables) {
      let vars = Object.assign({}, this.state, variables);
      vars.data = undefined;
      return adHocRequest(host, query, vars)
        .then(res => {
          vars.data = res.data;
          this.setState(vars);
        })
        .catch(err => {
          vars.data = { err };
          this.setState(vars);
        });
    }

    render() {
      return React.createElement(
        WrappedComponent,
        Object.assign({}, this.props, {
          data: this.state.data ? this.state.data : {},
          getData: this.getData,
        })
      );
    }
  }

  return WithRequest;
};

export const adHocRequest = (host, query, variables) => {
  return fetch(host, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  }).then(res => res.json());
};
