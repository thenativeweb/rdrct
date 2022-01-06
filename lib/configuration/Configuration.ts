interface Configuration {
  api: {
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
}

export { Configuration };
