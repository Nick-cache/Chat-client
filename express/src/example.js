// const govno = require("@lmstudio/sdk");

// const client = new govno.LMStudioClient();
// // { baseUrl: "ws://10.0.0.60" }
// function main() {
//   const modelPath =
//     "lmstudio-community/Qwen2.5-Coder-7B-Instruct-GGUF/Qwen2.5-Coder-7B-Instruct-Q4_K_M.gguf";

//   const model = client.llm.load(modelPath, {
//     config: {
//   gpuOffload: {
//     ratio: 1.0,
//     mainGpu: 0,
//     tensorSplit: [1.0],
//   },
//     },
//   });
// .then((model) => {
//   const response = model.respond([
//     {
//       role: "system",
//       content: "Act as Senior Front-end developer.",
//     },
//     {
//       role: "user",
//       content:
//         " \
// 						Use React.js, Javascript.  \
// 						Create Admin Panel, which include elements: \
// 						User(uuid, email, follow_notifications), \
// 						Product(id, name, download_link, tags), \
// 						Tag(id, name< products). \
// 				",
//     },
//   ]);
//   for (const text of response) {
//     process.stdout.write(text);
//   }
// })
// .catch();
// }

// main();
