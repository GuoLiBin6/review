webpackJsonp([8],{"9trz":function(t,e){},u0TH:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("mw3O"),l=i.n(a),s={data:function(){return{tableData:[],showData:[],page_size:7,cur_page:1,seen:!0,multipleSelection:[],select_cate:"",select_word:"",del_list:[],is_search:!1,editVisible:!1,delArr:[],delVisible:!1,delAllVisible:!1,form:{},idx:-1}},created:function(){this.getData()},methods:{handleCurrentChange:function(t){this.cur_page=t,this.getData()},getData:function(){var t=this;this.$axios.post("http://39.107.66.152:8080/admin/topic",l.a.stringify({page_size:7,cur_page:t.cur_page})).then(function(e){t.tableData=e.data})},search:function(){if(this.select_word){this.seen=!1;this.tableData=this.filterForm("topicName","topicContent")}else this.seen=!0,this.getData()},formatter:function(t,e){return t.address},filterForm:function(t,e){var i=this;return this.tableData.filter(function(e){for(var a=!1,l=0;l<i.del_list.length;l++)if(e.word1===i.del_list[l].word1){a=!0;break}if(!a&&(e[t].indexOf(i.select_word)>-1||e[t].indexOf(i.select_word)>-1))return console.log(e),e})},filterTag:function(t,e){return e.tag===t},handleEdit:function(t,e){if(this.chargeAdmin("change",e)){this.idx=t;var i=this.tableData[t];this.form={topicID:i.topicID,topicNum:i.topicNum,topicName:i.topicName,topicTime:i.topicTime,topicContent:i.topicContent},this.editVisible=!0}else this.$message.error("没有足够的权限！")},handleDelete:function(t,e){this.idx=t,this.delVisible=!0},addDelAll:function(){this.delAllVisible=!0},delAll:function(){for(var t=[],e=[],i=0;i<this.multipleSelection.length;i++)t.push(this.multipleSelection[i].topicID),e.push(this.multipleSelection[i].topicName);this.delForm(t,e),this.delAllVisible=!1},delForm:function(t,e){if(t==[])this.$message.error("请先选择活动！");else{for(var i=this,a="",s=0;s<e.length;s++)a=a+e[s]+",";this.$axios.post("http://39.107.66.152:8080/admin/rmTopic",l.a.stringify({delArr:t})).then(function(t){"1"==t.data&&(i.$message.success("删除成功"),i.getData(),i.$axios.post("http://39.107.66.152:8080/admin/addNewOption",l.a.stringify({options:localStorage.getItem("ms_username")+"删除了活动"+a.substring(0,a.length-1)})).then(function(t){}))})}},handleSelectionChange:function(t){this.multipleSelection=t},saveEdit:function(){this.$set(this.tableData,this.idx,this.form),this.editVisible=!1;var t=this;this.$axios.post("http://39.107.66.152:8080/admin/changeActivity",l.a.stringify({topicID:t.form.topicID,topicName:t.form.topicName,topicPlace:t.form.actPlace,actClass:t.form.actClass,actTime:t.form.actTime})).then(function(e){"1"==e.data&&t.$message.success("修改成功")})},deleteRow:function(){var t=[],e=[];t.push(this.tableData[this.idx].topicID),e.push(this.tableData[this.idx].topicName),this.delForm(t,e),this.delVisible=!1},chargeAdmin:function(t,e){return"delete"==t&&"admin"==localStorage.getItem("ms_username")&&localStorage.getItem("ms_username")!=e.username||"change"==t&&("admin"==localStorage.getItem("ms_username")||localStorage.getItem("ms_username")==e.username)}}},o={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"table"},[i("div",{staticClass:"crumbs"},[i("el-breadcrumb",{attrs:{separator:"/"}},[i("el-breadcrumb-item",[t._v("话题管理")]),t._v(" "),i("el-breadcrumb-item",[t._v("话题列表")])],1)],1),t._v(" "),i("div",{staticClass:"container"},[i("div",{staticClass:"handle-box"},[i("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary",icon:"delete"},on:{click:t.addDelAll}},[t._v("批量删除")]),t._v(" "),i("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"按名称搜索"},model:{value:t.select_word,callback:function(e){t.select_word=e},expression:"select_word"}}),t._v(" "),i("el-button",{attrs:{type:"primary",icon:"search"},on:{click:t.search}},[t._v("搜索")])],1),t._v(" "),i("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.tableData,border:""},on:{"selection-change":t.handleSelectionChange}},[i("el-table-column",{attrs:{type:"selection",width:"55"}}),t._v(" "),i("el-table-column",{attrs:{prop:"topicID",label:"话题ID"}}),t._v(" "),i("el-table-column",{attrs:{prop:"topicName",label:"话题名"}}),t._v(" "),i("el-table-column",{attrs:{prop:"topicNum",label:"评论人数"}}),t._v(" "),i("el-table-column",{attrs:{prop:"topicTime",label:"发布时间"}}),t._v(" "),i("el-table-column",{attrs:{prop:"topicContent",label:"主题内容"}}),t._v(" "),i("el-table-column",{attrs:{label:"操作",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{size:"small",type:"danger"},on:{click:function(i){t.handleDelete(e.$index,e.row)}}},[t._v("删除")])]}}])})],1),t._v(" "),t.seen?i("div",{staticClass:"pagination"},[i("el-pagination",{attrs:{layout:"prev, pager, next",total:50,"page-size":7,"current-page":t.cur_page},on:{"current-change":t.handleCurrentChange}})],1):t._e()],1),t._v(" "),i("el-dialog",{attrs:{title:"编辑场馆",visible:t.editVisible,width:"30%"},on:{"update:visible":function(e){t.editVisible=e}}},[i("el-form",{ref:"form",attrs:{model:t.form,"label-width":"100px"}},[i("el-form-item",{attrs:{label:"活动ID为："}},[t._v("\n                "+t._s(t.form.actID)+"\n            ")]),t._v(" "),i("el-form-item",{attrs:{label:"活动名："}},[i("el-input",{model:{value:t.form.actName,callback:function(e){t.$set(t.form,"actName",e)},expression:"form.actName"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"活动地址："}},[i("el-input",{model:{value:t.form.actPlace,callback:function(e){t.$set(t.form,"actPlace",e)},expression:"form.actPlace"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"活动时间："}},[i("el-input",{model:{value:t.form.actTime,callback:function(e){t.$set(t.form,"actTime",e)},expression:"form.actTime"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"活动分类："}},[i("el-input",{model:{value:t.form.actClass,callback:function(e){t.$set(t.form,"actClass",e)},expression:"form.actClass"}})],1)],1),t._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.editVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:t.saveEdit}},[t._v("确定修改 ")])],1)],1),t._v(" "),i("el-dialog",{attrs:{title:"提示",visible:t.delVisible,width:"300px",center:""},on:{"update:visible":function(e){t.delVisible=e}}},[i("div",{staticClass:"del-dialog-cnt"},[t._v("删除话题不可恢复，是否确定删除？")]),t._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.delVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:t.deleteRow}},[t._v("确 定")])],1)]),t._v(" "),i("el-dialog",{attrs:{title:"提示",visible:t.delAllVisible,width:"300px",center:""},on:{"update:visible":function(e){t.delAllVisible=e}}},[i("div",{staticClass:"del-dialog-cnt"},[t._v("批量删除话题不可恢复，是否确定删除？")]),t._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.delAllVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:t.delAll}},[t._v("确 定")])],1)])],1)},staticRenderFns:[]};var n=i("VU/8")(s,o,!1,function(t){i("9trz")},"data-v-3207732c",null);e.default=n.exports}});