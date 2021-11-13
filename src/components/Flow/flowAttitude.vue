<template>
  <div style="margin-top:10px;">
    <el-collapse v-if="showAll" v-model="activeName">
      <el-collapse-item title="" name="1">
        <template slot="title">
          <div class="title"><i class="el-icon-s-comment" />审批信息</div>
        </template>

        <div v-if="show">
          <div v-if="!showForm && showRevoke">
            <el-button size="mini" type="success" :loading="loading" @click="revoke()">撤回</el-button>
          </div>
          <el-form
            v-if="showForm"
            ref="ruleForm"
            status-icon
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class=""
            style="margin-top:20px;"
            size="mini"
          >
            <el-form-item label="审批类型" prop="attitudeType">
              <el-radio-group v-model="ruleForm.attitudeType" size="mini" @change="radioChange">
                <el-radio :label="attitudeTypeList[0].value">{{ attitudeTypeList[0].name }}</el-radio>
                <el-radio v-if="showStay" :label="attitudeTypeList[1].value">{{ attitudeTypeList[1].name }}</el-radio>
                <el-radio v-if="showBack" :label="attitudeTypeList[2].value">{{ attitudeTypeList[2].name }}
                  <el-select v-model="ruleForm.backGroup">
                    <el-option v-for="(item,index) in billFlowNodeList" :key="index" :label="item.name" :value="item.value" />
                    <el-option v-if="toBack" label="制单" :value="0" />
                  </el-select>
                </el-radio>
                <el-radio v-if="toVoid" :label="attitudeTypeList[3].value">{{ attitudeTypeList[3].name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item v-if="toContent" label="审批意见" prop="content">
                  <el-input
                    v-model="ruleForm.content"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    type="textarea"
                    show-word-limit
                    placeholder="请输入审批意见"
                    size="mini"
                    maxlength="2000"
                  />
                </el-form-item>
                &nbsp;
              </el-col>
              <el-col :span="12"><el-form-item label="附件"><up-file
                v-model="ruleForm.fileList"
                :is-preview="true"
                :is-upfile="true"
                :is-delete="true"
              /></el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <!--默认按钮-->
              <slot name="saveBtn" :attitudeType="ruleForm.attitudeType">
                <el-button size="mini" type="success" :loading="loading" @click="submitForm()">保存</el-button>
              </slot>
              <!--这里放其他按钮-->
              <slot name="otherBtn" />
            </el-form-item>
          </el-form>
        </div>

        <el-timeline style="padding:20px 10px;">
          <el-timeline-item
            v-for="(attitude, index) in list"
            :key="index"
            type="primary"
            :timestamp="attitude.createDate"
          >
            <div>
              <el-tag size="small" effect="plain">{{ attitude.title }}-{{ attitude.createUserName }}</el-tag>：<span v-html="replaceAll(attitude.content)" />
              <table v-if="(attitude.upFiles||[]).length"><tr>
                <td style="width:60px;vertical-align: top;font-weight: bold;">附件：</td>
                <td><component :is="comName" :is-preview="true" :file-list="attitude.upFiles" /></td>
              </tr></table>
            </div>
          </el-timeline-item>

        </el-timeline>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
// 查看流程进度
import { addAttitude, initAttitude } from '@/api/xtgl/billFlow'
import UpFile from '@/components/UpLoad/UpFile'
export default {
  name: 'FlowAttitude',
  components: {
    UpFile
  },
  props: {
    para: { type: Object, default: null },
    show: { type: Boolean, default: false }, // 是否显示表单和撤销
    toVoid: { type: Boolean, default: true }, //  是否显示作废，默认显示
    toBack: { type: Boolean, default: true }, //  是否显示退回到制单，默认显示
    toBeforeState: { type: Boolean, default: true }, // 是否允许退到当前state状态之前（不包括制单）默认可以, false 的话，退回到制单状态也默认不显示
    toContent: { type: Boolean, default: true }, // 显示审批内容文本框
    showStay: { type: Boolean, default: true } // 是否显示"只填写意见不转下一步"选项
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        formId: 0,
        billId: 0,
        title: '',
        content: '',
        fileList: [],
        attitudeType: 1,
        backGroup: null, // 0 制单
        type: 1 // 操作类型
      },
      loading: false,
      list: null,
      billFlowNodeList: null,
      activeName: ['1'],
      upFiles: [],
      comName: 'UpFile',
      fileList: [],
      showBack: true, //  是否显示退回
      attitudeTypeList: [], // 列表
      showRevoke: false, // 显示撤销
      showForm: false, // 显示提交审批表单
      showAll: true, // 显示所有
      rules: {
        content: [{ required: true, message: '请输入', trigger: 'blur' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  watch: {
    para() {
      this.fetchData()
    }
  },
  created() {
  },
  mounted() {
    // 显示表单
    this.fetchData()
  },
  methods: {
    fetchData() {
      //  如果可退回到制单，backGroup初始值为0，默认 显示制单
      if (this.toBack) {
        this.ruleForm.backGroup = 0
      }

      const { planId, billFlowId, formId } = this.para
      const postData = {
        billId: planId,
        billFlowId: billFlowId,
        formId: formId,
        toBeforeState: this.toBeforeState
      }
      initAttitude(postData).then(response => {
        const { data, beforeBillFlowNodeList, checkState, isRevoke, attitudeTypeList } = response
        this.list = data
        this.billFlowNodeList = beforeBillFlowNodeList
        this.attitudeTypeList = attitudeTypeList
        if (this.show) {
          // 跟下面一样的道理,这里也应该这样写,如果担心不是boolean型的话可以用Boolean()强转一次,不过暂时看着似乎没必要
          this.showRevoke = isRevoke.item1 // true：可以撤回
          // true：可以审批
          // 需要这样写,一个是这样简洁,第二个是,如果是false的时候需要重新赋值false,否则第二次进入缓存的页面时填报栏的状态还是上次的模样,导致作废的单子也会出现填报界面
          this.showForm = checkState.item1
        }
        if ((this.list || []).length === 0 && !this.show) {
          this.showAll = false
        }
        if (this.billFlowNodeList === null && this.toBack === false) {
          this.showBack = false
        }
      })
    },
    submitForm() {
      if (this.checkValidate()) {
        const postData = this.getPostData()
        this.$confirm('是否确定', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.add(postData)
        }).catch(() => { this.loading = false })
      }
    },
    checkValidate() {
      let flag = false
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          flag = true
        }
      })
      return flag
    },
    // 获取请求参数
    getPostData() {
      const newObj = JSON.parse(JSON.stringify(this.ruleForm))
      newObj.billId = this.para.planId
      newObj.formId = this.para.formId

      // 退回 的审批动作 字符串 由前端拼接，其他的审批动作，由后端根据attitudeType 后端拼接。
      if (this.ruleForm.attitudeType === 3) {
        newObj.operation = this.attitudeTypeList.find(f => f.value === this.ruleForm.attitudeType).name
        if (this.ruleForm.backGroup === 0) {
          newObj.operation += '制单'
        } else {
          newObj.operation += this.billFlowNodeList.find(f => f.value === this.ruleForm.backGroup).name
        }
      }
      if (!newObj.backGroup) { newObj.backGroup = 0 }

      return newObj
    },
    add(newObj) {
      this.loading = true
      addAttitude(newObj).then(response => {
        const { attitudeList, message, billFlowState } = response
        // 如果只填写意见不转下一步 需要更新流程
        if (this.attitudeType !== 2) {
          this.list = attitudeList
        }
        this.ruleForm.content = ''
        this.$message(message)
        this.$emit('update', billFlowState) // 更新流程
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    revoke() {
      const postData = {}
      postData.billId = this.para.planId
      postData.formId = this.para.formId
      postData.title = '撤回人'
      postData.content = '撤回单据'
      postData.operation = '撤回'
      postData.attitudeType = -2
      this.add(postData)
    },
    replaceAll(str) {
      return str.replace(/\n/g, '<br>')
    },
    radioChange() {
      this.ruleForm.content = ''
    }
  }
}
</script>
<style scoped>
.title {
    padding: 0 32px 12px 32px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    font-weight: bold;
  }
</style>
