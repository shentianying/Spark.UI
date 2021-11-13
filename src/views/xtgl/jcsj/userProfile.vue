<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <!-- <el-tab-pane label="基本信息" name="userInfo">
                <div>
                  基本信息
                </div>

              </el-tab-pane> -->
              <el-tab-pane label="设置" name="account">
                <el-form
                  label-width="120px"
                  size="mini"
                >
                  <el-form-item label="金额格式">
                    <el-select v-model="personalSettings.amountFormat">
                      <el-option label="千分位" :value="3" />
                      <el-option label="万分位（默认）" :value="4" />
                    </el-select><b style="margin-left:20px;">例如：￥{{ utils.formatMoney('99998888', 2, personalSettings.amountFormat) }}元</b>
                  </el-form-item>
                  <el-form-item label="翻页每页条数">
                    <el-select v-model="personalSettings.pageSize">
                      <el-option label="10条（默认）" :value="10" />
                      <el-option label="20条" :value="20" />
                      <el-option label="30条" :value="30" />
                      <el-option label="40条" :value="40" />
                      <el-option label="50条" :value="50" />
                      <el-option label="100条" :value="100" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="mini" @click="saveSet">保存</el-button>
                    <!-- <el-button type="primary" size="mini" @click="clearSet">清除</el-button> -->
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from './components/userCard'
import { LSSetObject, LSClear } from '@/utils/localstore'
export default {
  name: 'Profile',
  components: {
    UserCard
  },
  data() {
    return {
      personalSettings: {
        amountFormat: 4,
        pageSize: 10
      },
      activeTab: 'account'
    }
  },
  computed: {
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.personalSettings = this.utils.getPersonalSettings()
    },
    saveSet() {
      LSSetObject('PersonalSettings', this.personalSettings)
      this.$message.info(`设置成功`)
    },
    clearSet() {
      LSClear()
    }
  }
}
</script>
