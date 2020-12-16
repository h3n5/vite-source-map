<template>
  <div class="main">
    <h1 class="title">Source Map Local</h1>
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="line:column">
        <el-input
          v-model="form.linecolumn"
          placeholder="line:column"
        ></el-input>
      </el-form-item>
      <el-form-item label="type">
        <el-radio-group v-model="form.type">
          <el-radio label="remote" value="remote"></el-radio>
          <el-radio label="local" value="local"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="sourceMapFile">
        <el-input
          v-if="form.type === 'remote'"
          v-model="form.resource"
          placeholder="js.map"
        ></el-input>
        <el-upload
          v-else
          action=""
          :on-change="filechange"
          :auto-upload="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">submit</el-button>
      </el-form-item>
    </el-form>
    <h4>result</h4>
    <el-table :data="tableData">
      <el-table-column type="index" label="index" width="100" />
      <el-table-column prop="name" label="name" width="180" />
      <el-table-column prop="line" label="line" width="100" />
      <el-table-column prop="column" label="column" width="100" />
      <el-table-column prop="source" label="source" />
      <el-table-column prop="originLine" label="oLine" width="100" />
      <el-table-column prop="originColumn" label="oColumn" width="100" />
      <el-table-column prop="originUrl" label="originUrl" />
    </el-table>
  </div>
</template>
<script>
import sourceMap from "source-map";
sourceMap.SourceMapConsumer.initialize({
  "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm",
});
export default {
  name: "App",
  data() {
    return {
      form: {
        linecolumn: "",
        type: "",
        resource: "",
      },
      tableData: [],
    };
  },
  methods: {
    onSubmit() {
      let form = {
        url: this.form.resource,
        line: +this.form.linecolumn.split(":")[0],
        column: +this.form.linecolumn.split(":")[1],
      };
      if (this.form.type == "remote") {
        this.remoteHandle(form);
      }
    },
    remoteHandle({ url, line, column }) {
      fetch(url)
        .then((res) => res.text())
        .then((res) => {
          this.smReader(res, { url, line, column });
        });
    },
    filechange(file) {
      if (!/js\.map$/.test(file.name)) {
        return console.error("please use file end with js.map");
      }
      const fileReader = new FileReader();
      fileReader.readAsText(file.raw);
      fileReader.onloadend = (e) => {
        let form = {
          url: file.name,
          line: +this.form.linecolumn.split(":")[0],
          column: +this.form.linecolumn.split(":")[1],
        };
        this.smReader(e.target.result, form);
      };
    },
    smReader(res, { url, line, column }) {
      sourceMap.SourceMapConsumer.with(res, null, (consumer) => {
        let result = consumer.originalPositionFor({
          source: "./",
          line: line,
          column: column,
        });
        let origin = {
          originUrl: url,
          originLine: line,
          originColumn: column,
        };
        this.tableData.push(Object.assign(result, origin));
        consumer.destroy();
      });
    },
  },
};
</script>
