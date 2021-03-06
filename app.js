const axios = require("axios");
const { UserInputError, ApolloServer, gql } = require("apollo-server");

//TYPE DEFINITIONS
const typeDefs = gql`
  type City {
    name: String
    country: String
    weather: Weather
  }
  type Summary {
    title: String
  }
  type Temperature {
    actual: Float
  }
  type Wind {
    speed: Float
  }
  type Clouds {
    all: Int
  }
  type Weather {
    summary: Summary
    temperature: Temperature
    wind: Wind
    clouds: Clouds
  }
  input ConfigInput {
    units: Unit
  }
  type Query {
    getCity(name: String!, country: String, config: ConfigInput): City
  }
  enum Unit {
    metric
  }
`;

// API & KEY
const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?appid=081dc4d92a2d6143ac8bda11d807f49c&lang=sv`;

// RESOLVERS
const resolvers = {
  Query: {
    getCity: async (_obj, args) => {
      const { name, country } = args;
      let url = `${WEATHER_API}&q=${name}&units=metric`;

      try {
        const { data } = await axios.get(url);
        if (country && country.toUpperCase() !== data.sys.country) {
          throw new UserInputError("Country code was invalid", {
            invalidArgs: { country: country },
          });
        }

        return {
          id: data.id,
          name: data.name,
          country: data.sys.country,
          weather: {
            summary: {
              title: data.weather[0].main,
            },
            temperature: {
              actual: data.main.temp,
            },
            wind: {
              speed: data.wind.speed,
            },
            clouds: {
              all: data.clouds.all,
            },
          },
        };
      } catch (err) {
        return err;
      }
    },
  },

};

module.exports = {
  resolvers,
  typeDefs
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => console.log(`Server running at ${url}`))