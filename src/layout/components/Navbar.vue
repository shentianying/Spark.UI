<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="right-menu-item">
        <el-link :underline="false" @click="readMessages">
          <i class="el-icon-bell" style="font-size:20px" />
          <el-badge :value="noReadCount" :hidden="false" />
        </el-link>
      </div>
      <el-select v-model="selectOrgId" size="mini" class="right-menu-item hover-effect" placeholder="请选择公司" @change="toggleOrg">
        <el-option v-for="(item,index) in userOrg" :key="index" :label="item.name" :value="item.companyId" />
      </el-select>
      <div class="right-menu-item hover-effect">
        <el-dropdown class="avatar-container" trigger="hover">
          <div style="padding-top:5px;">
            <el-avatar :size="35" fit="contain" icon="el-icon-user-solid" style="border:1px solid lightblue" :src="getAvatar" />
            <span style="position:relative;top:-10px;">{{ name }}</span>
          </div>

          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/xtgl/jcsj/userProfile">
              <el-dropdown-item>
                个人中心
              </el-dropdown-item>
            </router-link>
            <router-link to="/xtgl/jcsj/userResetPassWord">
              <el-dropdown-item>
                修改密码
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <div class="right-menu-item hover-effect"></div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      selectOrgId: this.$store.state.user.selectOrgId,
      userOrg: this.$store.state.user.info.userOrg
      // avatar: process.env.VUE_APP_BASE_API + this.$store.state.user.info.avatar
      // badgeValue: 99
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      // 'avatar',
      'name',
      'info',
      'noReadCount'
    ]),
    getAvatar() {
      return process.env.VUE_APP_BASE_API + this.info.avatar
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    readMessages() {
      // this.badgeValue = 0
      this.$router.replace({ name: 'Message' })
    },
    async logout() {
      this.$store.dispatch('tagsView/delAllViews')
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`)
    },
    async toggleOrg() {
      await this.$store.dispatch('user/toggleOrg', this.selectOrgId)
      this.$router.go(0)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
