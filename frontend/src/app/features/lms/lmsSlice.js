import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { messagesSlice } from "../chats/chatsSlice";
import { LMS_DOMAIN_LINK } from "../../config";
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
  baseQuery: fetchBaseQuery({ baseUrl: LMS_DOMAIN_LINK }),
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
    stream: builder.mutation({
      query: ({ ident, history, promt, chat_uuid }) => ({
        method: "POST",
        url: `/${ident}/stream`,
        body: { history: history, promt: promt, chat_uuid: chat_uuid },
      }),
      onQueryStarted: async (arg, api) => {
        await api.queryFulfilled;
        api.dispatch(messagesSlice.util.invalidateTags(["Messages"]));
      },
    }),
    resume: builder.mutation({
      query: ({ ident, history, chat_uuid }) => ({
        method: "POST",
        url: `/${ident}/resume`,
        body: { history: history, chat_uuid: chat_uuid },
      }),
      onQueryStarted: async (arg, api) => {
        await api.queryFulfilled;
        api.dispatch(messagesSlice.util.invalidateTags(["Messages"]));
      },
    }),
    tokenize: builder.mutation({
      query: ({ ident, content }) => ({
        method: "POST",
        url: `/${ident}/tokenize`,
        body: { content: content },
      }),
    }),
  }),
});

export const {
  useListModelsQuery,
  useListLoadedModelsQuery,
  useStreamMutation,
  useLoadModelMutation,
  useResumeMutation,
  useUnloadModelMutation,
  useTokenizeMutation,
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

export const { selectAll: selectAllModels } = modelsAdapter.getSelectors(
  (state) => selectModelsData(state) ?? modelsInitial
);

export const { selectAll: selectAllLoadedModels } =
  loadedModelsAdapter.getSelectors(
    (state) => selectLoadedModelsData(state) ?? loadedModelsInitial
  );
