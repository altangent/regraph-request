import React, { Component } from 'react';
const HOST = 'http://localhost:8001/graphql';
const QueryContext = React.createContext(HOST);

export const RegraphRequest = QueryContext.Provider;

class Inner extends Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.state = {
      data: {},
      query: props.query,
    };
    this.getData(this.props.variables(props));
  }

  updateQuery(query, callback) {
    this.setState({ query }, callback);
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.getData(this.props.variables(this.props));
    }
  }

  getData(variables) {
    let vars = Object.assign({}, this.state, variables);
    vars.data = undefined;
    let query = this.state.query || this.props.query;
    return adHocRequest(this.props.url, query, vars)
      .then(res => {
        vars.data = res.data;
        return new Promise(resolve => {
          this.setState(vars, () => {
            resolve(vars);
          });
        });
      })
      .catch(err => {
        vars.data = { err };
        return new Promise(resolve => {
          this.setState(vars, () => {
            resolve(vars);
          });
        });
      });
  }

  render() {
    let props = Object.assign({}, this.props, {
      data: this.state.data ? this.state.data : {},
      getData: this.getData,
      updateQuery: this.updateQuery,
    });
    let WrappedComponent = this.props.component;
    return <WrappedComponent {...props} />;
  }
}

export const Query = (component, query, variables = () => {}) => {
  return class extends Component {
    render() {
      let props = Object.assign({}, this.props, {
        component,
        query,
        variables,
      });
      return <QueryContext.Consumer>{url => <Inner url={url} {...props} />}</QueryContext.Consumer>;
    }
  };
};

export class QueryComponent extends Component {
  render() {
    return (
      <QueryContext.Consumer>{url => <Inner url={url} {...this.props} />}</QueryContext.Consumer>
    );
  }
}

export const adHocRequest = (host, query, variables) => {
  return fetch(host, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  }).then(res => res.json());
};
