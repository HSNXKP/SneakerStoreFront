<template>
  <div>
    <!--搜索-->
    <el-form inline>
      <el-form-item label="选择订单时间">
        <DateTimeRangePicker :date="queryInfo.date" :setDate="setDate" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-form inline>
			<el-form-item label="选择订单状态" size="small">
				<el-input  placeholder="请输入订单编号"  :clearable="true" v-model="queryInfo.orderNumber" @clear="search" @keyup.native.enter="search" size="small" style="min-width: 500px">
					<el-select  slot="prepend" placeholder="选择订单状态" v-model="queryInfo.status" @change="search()"     style="width: 160px">
            <!-- 0:未支付 1:已支付 2:已发货 3:已完成 4:已取消 '':全部 -->
            <el-option value="" label="全部"></el-option>
            <el-option value="0" label="待付款"></el-option>
            <el-option value="1" label="已支付"></el-option>
            <el-option value="2" label="已发货"></el-option>
            <el-option value="3" label="已完成"></el-option>
            <el-option value="4" label="已取消"></el-option>
            <el-option value="5" label="退款中"></el-option>
            <el-option value="6" label="退款成功"></el-option>
					</el-select>  
					<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
				</el-input >
			</el-form-item>
		</el-form>

    <el-table :data="orderList "  row-key="id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}" fixed>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="id" prop="id" width="50"></el-table-column>
      <el-table-column label="订单名称" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="订单商品">
        <template slot-scope="scope">
          <el-popover placement="right" width="360px" height="200px" trigger="hover" content="....">
            <div style="width: 380px;height: 200px;"><img style="width: 100%;height: 100%;"
                :src="scope.row.image" />
            </div>
            <div slot="reference" style="width: 65px;height: 36px;"><img style="width: 100%;height: 100%;"
                :src="scope.row.image" />
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="货号" prop="code" show-overflow-tooltip></el-table-column>
      <el-table-column label="尺码" prop="size" show-overflow-tooltip></el-table-column>
      <el-table-column label="单价" prop="price" show-overflow-tooltip></el-table-column>
      <el-table-column label="数量" prop="quantity" show-overflow-tooltip></el-table-column>
      <el-table-column label="总金额" prop="amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="订单状态" prop="status" >
        <template slot-scope="scope">
         <el-tag  type="warning" v-if="scope.row.status == 0">待付款</el-tag>
         <el-tag  type="success" v-else-if="scope.row.status == 1">已支付</el-tag>
         <el-tag  type="danger" v-else-if="scope.row.status == 2">已发货</el-tag>
         <el-tag  type="" v-else-if="scope.row.status == 3">已完成</el-tag>
         <el-tag  type="info" v-else-if="scope.row.status == 4">已取消</el-tag>
         <el-tag  type="warning" v-else-if="scope.row.status == 5">退款中</el-tag>
         <el-tag  type="info" v-else-if="scope.row.status == 6">退款成功</el-tag>
      </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" >
        <template v-slot="scope">{{ scope.row.createTime | dateFormat }}</template>
      </el-table-column> 
      <el-table-column label="订单编号" width="300" prop="orderNumber"></el-table-column>
      <el-table-column label="快递单号" width="200" prop="express"></el-table-column>
      <!-- dateFormat('YYYY-MM-DD HH:mm:ss') -->
      <el-table-column label="操作" width="200" fixed="right" >
        <template v-slot="scope">
          <el-button  v-if="scope.row.status == 1 || scope.row.status == 2"  type="success" icon="el-icon-truck" size="mini" @click="sendGoods(scope.row.id)">发货</el-button>
          <el-button  v-if="scope.row.status == 5"  icon="el-icon-s-check" size="mini" @click="goExamine(scope.row)">审核</el-button>
          <el-popconfirm title="确定删除吗？" icon="el-icon-delete" iconColor="red" @onConfirm="deleteOrder(scope.row.id)">
            <el-button size="mini" type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    
    </el-table>
    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
      :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pageSize" :total="total"
      layout="total, sizes, prev, pager, next, jumper" background>
    </el-pagination>
    <el-dialog title="填写快递单号" width="50%" :visible.sync="dialogVisible"
            :close-on-click-modal="false" @close="cancelVisble">
            <!--内容主体-->
            <el-form :rules="formRules" ref="visFormRef" label-width="80px">
                <el-form-item label="快递单号" prop="express">
                    <el-input v-model="visForm.express"></el-input>
                </el-form-item>
            </el-form>
            <!--底部-->
            <span slot="footer">
                <el-button @click="cancelVisble">取 消</el-button>
                <el-button type="primary" @click="editOrder">确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog title="审核退款" width="50%" :visible.sync="examineDialogVisible"
            :close-on-click-modal="false" @close="cancelExamineVisble">
            <!--内容主体-->
            <el-form :model="order"  label-width="80px">
                <el-form-item label="退款原因" prop="refundReason">
                    <el-input  disabled v-model="order.refundReason"></el-input>
                </el-form-item>
                <el-form-item label="退款金额" prop="refundAmount">
                    <el-input disabled v-model="order.refundAmount"></el-input>
                </el-form-item>
                <el-form-item label="退款备注" prop="refundRemarks">
                    <el-input  disabled v-model="order.refundRemarks" type="textarea"></el-input>
                </el-form-item>
            </el-form>
           <!--底部-->
           <span slot="footer">
                <el-button @click="cancelExamineVisble">取 消</el-button>
                <el-button type="danger" @click="refuseRefund">拒绝退款</el-button>
                <el-button type="success" @click="agreeRefund">同意退款</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
import DateTimeRangePicker from "@/components/DateTimeRangePicker";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllOrder,deleteOrder,updateExpress,refund,refuseRefund} from '@/api/order'

export default {
  name: 'Order',
  components: { DateTimeRangePicker, Breadcrumb},
  data() {
    return {
      // 订单状态 0:未支付 1:已支付 2:已发货 3:已完成 4:已取消
      queryInfo: {
        status: '',
        date: [],
        orderNumber:'',
        pageNum: 1,
        pageSize: 10
      },
      orderList: [],
      total: 0,
      dialogVisible: false,
      examineDialogVisible:false,
      visForm: {
        id: '',
        express: ''
      },
      refundVisForm: {
        orderNumber: '',
        userId: ''
      },
      order: {},
      formRules: {
                express: [
                    { required: true, message: '请输入订单单号', trigger: 'blur' },
                ],
            },
    }
  },
  computed: {
  },
  created() {
    this.getAllOrder()
  },
  methods: {
    setDate(value) {
      this.queryInfo.date = value
    },
    search() {
      this.queryInfo.pageNum = 1
      this.queryInfo.pageSize = 10
        this.getAllOrder()
    },
    getAllOrder() {
      let query = {...this.queryInfo}
				if (query.date && query.date.length === 2) {
					query.date = query.date[0] + ',' + query.date[1]
				}
      getAllOrder(query).then(res => {
        this.orderList = res.data.list
        this.total = res.data.total
      })
    },
    deleteOrder(id) {
            this.$confirm('此操作将<strong style="color: red">永久删除该订单</strong>，是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true
            }).then(() => {
                deleteOrder(id).then(res => {
                    if (res.code === 200) {
                        this.msgSuccess(res.msg)
                        this.getAllOrder()
                    } else {
                        this.msgError(res.msg)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
    //监听 pageSize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getAllOrder()
    },
    //监听页码改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getAllOrder()
    },
    cancelVisble() {
      this.dialogVisible = false
      this.resetForm()
    },
    sendGoods(id){
      this.visForm.id = id
      this.dialogVisible = true
    },
    editOrder(){
      updateExpress(this.visForm).then(res => {
        if (res.code === 200) {
          this.msgSuccess(res.msg)
          this.getAllOrder()
          this.cancelVisble()
        } else {
          this.msgError(res.msg)
        }
      })
    },
     // 清空表单
     resetForm() {
        this.visForm = {
          id: '',
          express: '',
        },
        this.refundVisForm = {
          orderNumber: '',
          userId: ''
        }
    },
    goExamine(order){
      this.examineDialogVisible = true
      this.order = order
      console.log(this.order)
      this.refundVisForm.orderNumber = order.orderNumber
      this.refundVisForm.userId = order.userId
    },
    cancelExamineVisble(){
      this.examineDialogVisible = false
      this.resetForm()
    },
    refuseRefund(){
      refuseRefund(this.refundVisForm).then(res =>{
        if (res.code === 200) {
          this.msgSuccess(res.msg)
          this.getAllOrder()
          this.cancelExamineVisble()
        } else {
          this.msgError(res.msg)
        }
      })
    },
    agreeRefund(){
      refund(this.refundVisForm).then(res =>{
        if (res.code === 200) {
          this.msgSuccess(res.msg)
          this.getAllOrder()
          this.cancelExamineVisble()
        } else {
          this.msgError(res.msg)
        }
      })
    },
    
  }
}
</script>

<style scoped>
.el-button+span {
  margin-left: 10px;
}
.el-form--inline .el-form-item {
		margin-bottom: 0;
	}
</style>