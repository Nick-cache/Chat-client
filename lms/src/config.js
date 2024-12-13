const CORS_ORIGINS = process.env.LMS_CORS;
export const BACKEND_SERVICE = process.env.BACKEND_SERVICE;

export const LMS_HOST = process.env.LMS_LOCAL_HOST;
export const LMS_PORT = process.env.LMS_LOCAL_PORT;

const multipleCors = (origins) => {
  const inner = (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  };
  return inner;
};

export const appCorsConfig = {
  origin: multipleCors(CORS_ORIGINS),
};

export const ioConfig = {
  cors: {
    origin: multipleCors(CORS_ORIGINS),
  },
};
