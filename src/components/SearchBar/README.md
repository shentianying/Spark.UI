# SearchBar组件说明
```
原理:
  通过@/SearchBar/index props的data遍历组件。
  data中component尤其关键，该参数决定渲染哪个组件，其对应@/components/SearchBar/form/下的组件名(文件名)
  
  如果为Input则渲染@/components/SearchBar/form/Input组件,如下
  {
    component:'Input', // 渲染@/components/SearchBar/form/Input，如果没有该组件则报错
    value:'',  // 关于value会通过v-modle绑定在组件上，所以在组件内要自己去实现v-modle的一些逻辑。
    
    // 其他参数剩下的所有参数都会通过props传递到组件里，由组件决定是否接收(如需要则在组件props中定义)
  }
```
## 增加组件
```
关于如何增加组件的一些说明
  1.组件放在哪里？
    答:组件统一放在<@/components/SearchBar/form/>，该文件夹下所有组件统一在<@/components/SearchBar/MyInput/index.js>中被导入使用。
  2.如何新建组件?
    答:与其他普通的组件一样，具体参考@/components/SearchBar/form/Input。
```

