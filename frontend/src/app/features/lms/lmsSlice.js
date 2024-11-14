import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const getChosenModelLocal = () => {
  const parsed = JSON.parse(localStorage.getItem("chosenModel"));
  return { model: parsed };
};

const setChosenModelLocal = (model) => {
  const stringified = JSON.stringify(model);
  localStorage.setItem("chosenModel", stringified);
};

const removeChosenModelLocal = () => {
  localStorage.removeItem("chosenModel");
};

export const chosenModelSlice = createSlice({
  name: "chosenModel",
  initialState: getChosenModelLocal(),
  reducers: {
    set(state, action) {
      const model = action.payload;
      state.model = model;
      setChosenModelLocal(model);
    },
    remove(state, action) {
      state.model = null;
      removeChosenModelLocal();
    },
  },
  selectors: {
    getChosenModelSelector(state) {
      return state.chosenModel.model;
    },
  },
});

export const { getChosenModelSelector } = chosenModelSlice.getSelectors();

export const { set: chooseModel, remove: removeChosenModel } =
  chosenModelSlice.actions;

const modelsAdapter = createEntityAdapter({
  selectId: (model) => model.path,
});
const loadedModelsAdapter = createEntityAdapter({
  selectId: (model) => model.ident,
});

const modelsInitial = modelsAdapter.getInitialState();
const loadedModelsInitial = loadedModelsAdapter.getInitialState();

export const lmsSlice = createApi({
  reducerPath: "lmsSlice",
  tagTypes: ["Models", "LoadedModels"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    listModels: builder.query({
      query: () => ({
        method: "GET",
        url: "/list_models",
      }),
      transformResponse: (data) => {
        return modelsAdapter.setAll(modelsInitial, data);
      },
      providesTags: ["Models"],
    }),
    listLoadedModels: builder.query({
      query: () => ({
        method: "GET",
        url: "/list_loaded_models",
      }),
      transformResponse: (data) => {
        return loadedModelsAdapter.setAll(loadedModelsInitial, data);
      },
      providesTags: ["LoadedModels"],
    }),
    loadModel: builder.mutation({
      query: ({ path, ident, contextLength, GPULayers }) => ({
        method: "POST",
        url: "/load_model",
        body: {
          path: path,
          ident: ident,
          contextLength: contextLength,
          GPULayers: GPULayers,
        },
      }),
      invalidatesTags: ["LoadedModels"],
    }),
    unloadModel: builder.mutation({
      query: (ident) => ({
        method: "POST",
        url: "/unload_model",
        body: { ident: ident },
      }),
      invalidatesTags: ["LoadedModels"],
    }),
    stream: builder.query({
      query: ({ ident, history, promt }) => ({
        method: "POST",
        url: `/${ident}/stream`,
        body: { history: history, promt: promt },
      }),
    }),
  }),
});

export const {
  useListModelsQuery,
  useListLoadedModelsQuery,
  useStreamQuery,
  useLoadModelMutation,
  useUnloadModelMutation,
} = lmsSlice;

export const selectModelsResult = lmsSlice.endpoints.listModels.select();

export const selectLoadedModelsResult =
  lmsSlice.endpoints.listLoadedModels.select();

const selectModelsData = createSelector(
  selectModelsResult,
  (modelsResult) => modelsResult.data
);

const selectLoadedModelsData = createSelector(
  selectLoadedModelsResult,
  (loadedModelsResult) => loadedModelsResult.data
);

export const {
  selectAll: selectAllModels,
  selectById: selectModelByIdent,
  selectIds: selectModelsIdents,
} = modelsAdapter.getSelectors(
  (state) => selectModelsData(state) ?? modelsInitial
);

export const {
  selectAll: selectAllLoadedModels,
  selectById: selectLoadedModelByIdent,
  selectIds: selectLoadedModelsIdents,
} = loadedModelsAdapter.getSelectors(
  (state) => selectLoadedModelsData(state) ?? loadedModelsInitial
);
