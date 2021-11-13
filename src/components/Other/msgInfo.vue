<template>
  <div v-if="isShow" style="margin-top:10px;">
    <el-collapse v-model="active1">
      <el-collapse-item title="" name="1">
        <template slot="title">
          <h3><i class="el-icon-s-comment" />意见与信息</h3>
        </template>

        <el-tabs tab-position="right" style="height: 200px;margin-top:10px;">
          <el-tab-pane label="公开">
            <ul>
              <li v-for="(item1,index1) in pubMessage" :key="index1">{{ item1.sendTime }} {{ item1.sendName }}：{{ item1.content }}</li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="私密">
            <ul>
              <li v-for="(item2,index2) in priMessage" :key="index2">{{ item2.sendTime }} {{ item2.sendName }}：{{ item2.content }}</li>
            </ul>
          </el-tab-pane>
        </el-tabs>

        <p>
          <el-radio-group v-model="state" size="mini">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="0">私密</el-radio>
          </el-radio-group>
        </p>

        <div style="margin-top:10px;">
          <el-input
            v-model="content"
            type="textarea"
            autosize
            placeholder="发送内容"
            maxlength="500"
            show-word-limit
          />
          <el-row style="margin-top:10px;">
            <el-col :span="12">
              <el-button size="mini" type="primary" plain @click="addReminder">@提醒谁</el-button>
              <el-tooltip class="item" effect="dark" content="正确@的格式：@+人名+空格 例如：@张三 ，不要忽略最后的空格 " placement="top-start">
                <i class="el-icon-question" />
              </el-tooltip>
            </el-col>
            <el-col :span="12" style="text-align:right;">
              <el-button :loading="loading" size="mini" type="primary" @click="goSend">确定发送</el-button>
            </el-col>
          </el-row>
        </div>

        <div v-if="dialogTableVisible">
          <el-dialog
            title="选择人员"
            :destroy-on-close="true"
            width="70%"
            :visible.sync="dialogTableVisible"
            append-to-body
          >

            <el-button v-for="(item,index) in personList" :key="index" size="mini" @click="chooseUser(item.name)">{{ item.name }}</el-button>
            <!-- <SelectPerson @getPersons="getPersons" /> -->
          </el-dialog>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { getMessageByBillFlowId, sendMessage } from '@/api/xtgl/message'
// import SelectPerson from '@/components/Other/selectPerson'
export default {
  name: '',
  components: {
    // SelectPerson
  },
  props: {
    personArray: { type: Array, default: null }, // 传过来的指定的用户数组 必须包含字段 id,name, 支持自动去重
    billId: { type: Number, default: 0 },
    billFlowId: { type: Number, default: 0 },
    pageId: { type: Number, default: 0 },
    isShow: { type: Boolean, default: true }
  },
  data() {
    return {
      state: 1,
      content: '',
      dialogTableVisible: false,
      loading: false,
      pubMessage: [],
      priMessage: [],
      active1: ['1'],
      personList: [] // 去重后的数据
    }
  },
  computed: {
  },
  watch: {
    content(value) {
      // if () {
      //   this.popoverVisible = true
      //   console.log('存在@符号')
      // }
    }
  },
  created() {
    if ((this.personArray || []).length > 0) {
      // 去重，去自己
      this.personList = this.unique(this.personArray).filter(f => f.id !== this.$store.state.user.info.uid)
    } else { return null }
  },
  mounted() {
    if (this.isShow) {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      getMessageByBillFlowId({ billFlowId: this.billFlowId }).then(res => {
        const { pubData, priData } = res
        this.pubMessage = pubData
        this.priMessage = priData
      })
    },
    addReminder() {
      this.dialogTableVisible = true
    },
    unique(arr) {
      // 根据唯一标识id来对数组进行去重
      const res = new Map() // 定义常量 res,值为一个Map对象实例
      // 返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    chooseUser(text) {
      this.content += `@${text} `
      this.dialogTableVisible = false
    },
    // getPersons(selectedItems) {
    //   console.log('输出选中的用户：', selectedItems)
    // },
    goSend() {
      if (this.content.trim() === '') {
        this.$alert('内容不能为空')
        return false
      }

      const reg = /@[\u4e00-\u9fa5]{0,}\s/g // 匹配@符号后面带中文加空格 的字符串
      var arr = this.content.match(reg) // 获取匹配后的结果 数组
      // console.log('匹配的结果arr:', arr)

      if (arr) {
        // 根据姓名 找到 相对应的 Id 数组
        const idArr = arr.map(m => this.personList.find(f => f.name === m.substring(1).trim()).id)
        // console.log('根据@姓名 找到的 id数组:', idArr)

        var postData = {}
        postData.content = this.content
        postData.billId = this.billId
        postData.billFlowId = this.billFlowId
        postData.pageId = this.pageId
        // 公开,发送给全部人员
        if (this.state === 1) {
          postData.title = '有一条新的消息'
          postData.type = 3
          const item = []
          this.personList.forEach(e => {
            item.push({ receiverId: e.id })
          })
          postData.messageUser = item
        }

        // 私密，发送给特定人员
        if (this.state === 0) {
          if ((idArr || []).length === 0) {
            this.$alert('私密必须有人员对象，请@检查格式')
            return
          }
          postData.title = '有人私密@你了'
          postData.content = this.content
          postData.type = 4
          postData.billId = this.billId
          postData.billFlowId = this.billFlowId
          postData.pageId = this.pageId

          const item = []
          idArr.forEach(e => {
            item.push({ receiverId: e })
          })
          postData.messageUser = item
        }

        this.loading = true
        sendMessage(postData).then(res => {
          this.$message(res.message)
          // 清空
          this.state = 1
          this.content = ''

          // 刷新
          this.fetchData()

          this.loading = false
        }).catch(() => { this.loading = false })
      }
    }
  }
}
</script>
<style scoped>

</style>
