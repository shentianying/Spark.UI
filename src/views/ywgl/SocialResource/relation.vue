<template>
  <div>
    <div style="margin-top:10px;padding-left:20px;">
      调整图谱层数到：
      <el-radio-group v-model="level" size="mini" @change="onLevelOptionChanged">
        <el-radio-button :label="1">1层</el-radio-button>
        <el-radio-button :label="2">2层</el-radio-button>
        <el-radio-button :label="3">3层</el-radio-button>
      </el-radio-group>
      <p>默认加载一层关系数据，可选择加载的层数（最多3层），点击圆圈会切换中心点，显示点击者的关系图谱，节点有悬浮窗显示基本信息</p>
    </div>
    <div ref="myRelation" style="height:calc(100vh - 50px);margin:10px;border: #efefef solid 1px;">
      <RelationGraph
        ref="seeksRelationGraph"
        :options="graphOptions"
        :on-node-click="onNodeClick"
        :on-line-click="onLineClick"
      >
        <div slot="node" slot-scope="{node}" @mouseover="showNodeTips(node, $event)" @mouseout="hideNodeTips(node, $event)">
          <div style="height:64px;line-height: 64px;border-radius: 32px;cursor: pointer;">
            {{ node.text }}
          </div>
          <!-- <div style="color: forestgreen;font-size: 16px;position: absolute;width: 160px;height:25px;line-height: 25px;margin-top:5px;margin-left:-48px;text-align: center;background-color: rgba(66,187,66,0.2);">
            {{ node.data.name }}
          </div> -->
        </div>
      </RelationGraph>
    </div>
    <div v-if="isShowNodeTipsPanel" :style="{left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }" style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
      <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">{{ currentNode.text }}</div>
      <div class="c-node-menu-item">单位：{{ currentNode.data.company }}</div>
      <div class="c-node-menu-item">职务：{{ currentNode.data.position }}</div>
    </div>
  </div>
</template>

<script>
import { getRelationGraph } from '@/api/ywgl/socialResource.js'
import RelationGraph from 'relation-graph'
export default {
  name: 'Relation',
  components: { RelationGraph },
  data() {
    return {
      isShowNodeTipsPanel: false,
      nodeMenuPanelPosition: { x: 0, y: 0 },
      currentNode: {},
      graphOptions: {
        defaultNodeBorderWidth: 0,
        disableZoom: true,
        defaultNodeColor: '#409EFF',
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultJunctionPoint: 'border',
        'layouts': [
          {
            'label': '自动布局',
            'layoutName': 'force',
            'layoutClassName': 'seeks-layout-force'
          }
        ]
        // 这里可以参考"Graph 图谱"中的参数进行设置
      },
      rootId: 0,
      level: 1
    }
  },
  mounted() {
    this.rootId = this.$route.query.id
    this.showSeeksGraph(this.rootId)
  },
  methods: {
    showSeeksGraph(rootId) {
      getRelationGraph({ id: rootId, level: this.level }).then(({ nodes, links }) => {
        var __graph_json_data = {
          rootId: rootId.toString(),
          nodes: nodes,
          links: links
        }
        // 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置
        this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
          // Called when the relation-graph is completed
        })
      })
    },
    onNodeClick(nodeObject, $event) {
      this.rootId = nodeObject.data.id
      this.showSeeksGraph(nodeObject.data.id)
    },
    onLineClick(lineObject, $event) {
      console.log('onLineClick:', lineObject)
    },
    onLevelOptionChanged() {
      this.showSeeksGraph(this.rootId)
    },
    showNodeTips(nodeObject, $event) {
      this.currentNode = nodeObject
      var _base_position = this.$refs.myRelation.getBoundingClientRect()
      this.isShowNodeTipsPanel = true
      this.nodeMenuPanelPosition.x = $event.clientX - _base_position.x + 10
      this.nodeMenuPanelPosition.y = $event.clientY - _base_position.y + 10
    },
    hideNodeTips(nodeObject, $event) {
      this.isShowNodeTipsPanel = false
    }
  }
}
</script>
<style lang="scss" scoped>
.c-node-menu-item{
  line-height: 30px;padding-left: 10px;cursor: pointer;color: #444444;font-size: 14px;border-top:#efefef solid 1px;
}
.c-node-menu-item:hover{
  background-color: rgba(66,187,66,0.2);
}
</style>
