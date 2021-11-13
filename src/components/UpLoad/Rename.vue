<template>
  <div>
    <el-table
      :data="list"
      style="width: 600px;"
    >
      <el-table-column align="center" label="名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="Rename(scope.row)">重命名</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog
        title="重命名"
        :visible.sync="viewVisible"
        width="600px"
        append-to-body
      >
        <el-input v-model.trim="newValue" style="width:200px;" maxlength="50" />
        <el-button type="primary" :loading="buttonLoading" size="mini" @click="Save">保存</el-button>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { putFileName } from '@/api/index'
export default {
  props: {
    list: { type: [Array], default: null }
  },
  data() {
    return {
      viewVisible: false,
      newValue: '',
      selectObj: [],
      extension: '',
      buttonLoading: false
    }
  },
  methods: {
    Rename(row) {
      console.log('传过去的row:', row)
      this.viewVisible = true
      const lastIndex = row.name.lastIndexOf('.')
      if (lastIndex <= 0) {
        this.$message.info('文件名格式错误')
        return
      }
      this.newValue = row.name.substring(0, lastIndex)
      this.extension = row.name.substring(lastIndex)
      this.selectObj = row
    },
    Save() {
      if (this.newValue === '') {
        this.$message.info('不能为空')
        return
      }
      const newName = this.newValue + this.extension
      var postData = { id: this.selectObj.id, newName: newName, addFlag: this.selectObj.addFlag }
      // 修改后端的文件名
      this.buttonLoading = true
      putFileName(postData).then(response => {
        this.$message.info(response)
        // 修改前端 的文件名
        this.selectObj.name = newName
        this.viewVisible = false // 关闭
        this.buttonLoading = false
        this.$message.info(response.message)
      })
    }
  }
}
</script>
