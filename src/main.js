import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElRadio,
  ElRadioGroup,
  ElSwitch,
  ElUpload,
  ElTable,
  ElTableColumn
} from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

createApp(App)
  .use(ElForm)
  .use(ElFormItem)
  .use(ElInput)
  .use(ElButton)
  .use(ElRadio)
  .use(ElRadioGroup)
  .use(ElSwitch)
  .use(ElUpload)
  .use(ElTable)
  .use(ElTableColumn)
  .mount("#app");
