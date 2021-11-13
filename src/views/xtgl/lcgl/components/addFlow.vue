<template>
  <!-- 显示流程 -->
  <el-form
    ref="ruleForm"
    status-icon
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    size="mini"
  >
    <el-form-item label="单据名称" prop="name" />
    <el-form-item label="流程名称" prop="name" />
    <el-form-item label="流程">
      <div class="main">
        <div class="flexwrap">
          <div class="flownode">
            <div>开始</div>
          </div>
          <div><i class="fontSize20 el-icon-right" /></div>
        </div>
        <div class="flexwrap">
          <div class="flownode">
            <div>结束</div>
          </div>
          <!-- <div><i class="fontSize20 el-icon-right" /></div> -->
        </div>
      </div>
    </el-form-item>
    <el-form-item label="是否可用" prop="inUse">
      <el-switch
        v-model="ruleForm.inUse"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm('ruleForm')">更新保存</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>

</template>

<style scoped>
.main{
    display:flex;flex-wrap:wrap;align-items:center ;
}
.flexwrap{
    display:flex;align-items:center;
}
.flownode {
  box-sizing:border-box;border:1px solid green;padding:0 10px;margin-top:10px;
}

.fontSize20{
    font-size:20px
}
